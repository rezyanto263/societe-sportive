'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  FileUpload,
  FileUploadDropzone,
  FileUploadItem,
  FileUploadItemDelete,
  FileUploadItemMetadata,
  FileUploadItemPreview,
  FileUploadItemProgress,
  FileUploadList,
  FileUploadProps,
  FileUploadTrigger,
} from '@/components/ui/file-upload';
import {
  Progress,
  ProgressLabel,
  ProgressValue,
} from '@/components/ui/progress';
import { Medias } from '@/database/types';
import { cleanupPendingMedia } from '@/features/medias/actions/cleanup-pending-media';
import { createMedia } from '@/features/medias/actions/create-media';
import { uploadImageToCloudinary } from '@/features/medias/services/upload-image';
import { getImageMimeType } from '@/lib/utils';
import { UploadIcon, XIcon } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';

type ImageInputProps = Omit<FileUploadProps, 'value'> & {
  value?: string | string[];
  onChange?: (value: string | string[]) => void;
  dropzone?: boolean;
  initialImages?: (Medias | null | undefined)[];
};

export default function ImageInput({
  value: realValue,
  onChange,
  maxFiles = 1,
  maxSize = 1 * 1024 * 1024,
  accept = '.png,.jpg,.jpeg',
  dropzone = false,
  initialImages,
  ...props
}: ImageInputProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [uploadedMedias, setUploadedMedias] = useState(new Map<File, Medias>());
  const [initialFiles, setInitialFiles] = useState(new Map<File, Medias>());

  useEffect(() => {
    const validImages = (initialImages ?? []).filter(
      (media): media is Medias => media != null && media.deletedAt === null,
    );

    if (validImages.length === 0) return;

    let ignore = false;

    const load = async () => {
      const results = await Promise.all(
        validImages
          .filter(
            (media) =>
              media.resourceType === 'image' &&
              getImageMimeType(media.url) !== undefined,
          )
          .slice(0, maxFiles)
          .map(async (media) => {
            try {
              const res = await fetch(media.url);
              if (!res.ok) return null;

              const blob = await res.blob();
              const name = media.url.split('?')[0].split('/').pop() ?? media.id;

              return {
                media,
                file: new File([blob], name, {
                  type: getImageMimeType(media.url),
                }),
              };
            } catch {
              return null;
            }
          }),
      );

      if (ignore) return;

      const loaded = results.filter((item) => item !== null);
      if (loaded.length === 0) return;

      setFiles((previous) => [...loaded.map((item) => item.file), ...previous]);
      setUploadedMedias((previous) => {
        const next = new Map(previous);
        loaded.forEach(({ file, media }) => next.set(file, media));
        return next;
      });
      setInitialFiles(new Map(loaded.map(({ file, media }) => [file, media])));
    };

    load();

    return () => {
      ignore = true;
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const cancelledFiles = useRef(new WeakSet<File>());
  const abortControllers = useRef(new Map<File, AbortController>());

  // Selalu gunakan nilai terbaru dari parent.
  const valueRef = useRef(realValue);

  useEffect(() => {
    valueRef.current = realValue;
  }, [realValue]);

  // Tambahkan ID media ke value.
  const addMediaId = useCallback(
    (id: string) => {
      const current = valueRef.current;

      let next: string | string[];

      if (maxFiles === 1) {
        next = id;
      } else {
        const currentIds = Array.isArray(current)
          ? current
          : current
            ? [current]
            : [];

        next = currentIds.includes(id) ? currentIds : [...currentIds, id];
      }

      // Perbarui ref sebelum memanggil callback.
      // Berguna ketika beberapa upload selesai berdekatan.
      valueRef.current = next;
      onChange?.(next);
    },
    [maxFiles, onChange],
  );

  // Hapus ID media dari value.
  const removeMediaId = useCallback(
    (id: string) => {
      const current = valueRef.current;

      let next: string | string[];

      if (maxFiles === 1) {
        next = current === id ? '' : (current ?? '');
      } else {
        const currentIds = Array.isArray(current)
          ? current
          : current
            ? [current]
            : [];

        next = currentIds.filter((value) => value !== id);
      }

      valueRef.current = next;
      onChange?.(next);
    },
    [maxFiles, onChange],
  );

  // Menangani pemilihan dan penghapusan file lokal.
  const onValueChange: FileUploadProps['onValueChange'] = useCallback(
    async (value: File[]) => {
      const addedFiles = value.filter((file) => !files.includes(file));

      if (addedFiles.length > 0) {
        const nextFiles = [...files, ...addedFiles];

        if (nextFiles.length > maxFiles) {
          return;
        }

        props.onValueChange?.(nextFiles);
        setFiles(nextFiles);
        return;
      }

      const removedFiles = files.filter((file) => !value.includes(file));

      removedFiles.forEach(async (file) => {
        cancelledFiles.current.add(file);

        // Batalkan upload yang masih berjalan.
        abortControllers.current.get(file)?.abort();

        const media = uploadedMedias.get(file);

        if (media) {
          const isInitial = initialFiles.has(file);

          if (!isInitial && media.status === 'pending') {
            await cleanupPendingMedia(media.id);
          }

          removeMediaId(media.id);
        }

        setUploadedMedias((previous) => {
          const next = new Map(previous);
          next.delete(file);
          return next;
        });
      });

      props.onValueChange?.(value);
      setFiles(value);
    },
    [files, maxFiles, props, uploadedMedias, removeMediaId, initialFiles],
  );

  // Upload ke Cloudinary lalu buat record media.
  const UPLOAD_WEIGHT = 90;

  const onUpload: FileUploadProps['onUpload'] = useCallback(
    async (uploadFiles, { onProgress, onSuccess, onError }) => {
      await Promise.all(
        uploadFiles.map(async (file) => {
          const controller = new AbortController();

          abortControllers.current.set(file, controller);
          cancelledFiles.current.delete(file);

          try {
            // Tahap 1: upload ke Cloudinary (0-90%).
            const image = await uploadImageToCloudinary(
              file,
              (progress) => onProgress(file, (progress * UPLOAD_WEIGHT) / 100),
              controller.signal,
            );

            if (cancelledFiles.current.has(file)) return;

            // Tahap 2: simpan ke database (90-100%).
            onProgress(file, UPLOAD_WEIGHT);

            const res = await createMedia({
              publicId: image.publicId,
              url: image.url,
              resourceType: 'image',
              status: 'pending',
            });

            if (!res.success) throw new Error(res.message);

            const media = res.data!;

            if (cancelledFiles.current.has(file)) {
              await cleanupPendingMedia(media.id);
              return;
            }

            setUploadedMedias((previous) => {
              const next = new Map(previous);
              next.set(file, media);
              return next;
            });

            addMediaId(media.id);
            onProgress(file, 100);
            onSuccess(file);
          } catch (error) {
            if (cancelledFiles.current.has(file)) return;

            const message =
              error instanceof Error
                ? error.message
                : 'Gagal mengunggah gambar.';

            onError(file, new Error(message));
            toast.error(message);
          } finally {
            abortControllers.current.delete(file);
          }
        }),
      );
    },
    [addMediaId],
  );

  // Validasi file.
  const onFileValidate: FileUploadProps['onFileValidate'] = useCallback(
    (file: File) => {
      if (file.size > maxSize) {
        const maxSizeMB = maxSize / (1024 * 1024);

        return `Ukuran file maksimal ${maxSizeMB} MB.`;
      }

      const allowedTypes = ['image/png', 'image/jpeg'];

      if (!allowedTypes.includes(file.type)) {
        return 'Format file harus PNG atau JPEG.';
      }

      return null;
    },
    [maxSize],
  );

  // Pesan ketika file ditolak.
  const onFileReject: FileUploadProps['onFileReject'] = useCallback(
    (file: File, message: string) => {
      const filename =
        file.name.length > 20 ? `${file.name.slice(0, 20)}...` : file.name;

      toast.error(message, {
        description: `"${filename}" telah ditolak.`,
      });
    },
    [],
  );

  return (
    <FileUpload
      {...props}
      value={files}
      onValueChange={onValueChange}
      onUpload={onUpload}
      onFileValidate={onFileValidate}
      onFileReject={onFileReject}
      maxFiles={maxFiles}
      maxSize={maxSize}
      accept={accept}
    >
      {files.length < maxFiles &&
        (dropzone ? (
          <FileUploadDropzone
            className="cursor-pointer"
            data-invalid={props['aria-invalid'] || undefined}
          >
            <div className="flex flex-col items-center gap-1">
              <div className="flex items-center justify-center rounded-full border p-2.5">
                <UploadIcon className="size-6 text-muted-foreground" />
              </div>

              <p className="text-sm font-medium">
                Seret dan lepaskan gambar di sini
              </p>

              <p className="text-xs text-muted-foreground">
                Atau klik untuk mengunggah gambar
              </p>
            </div>
          </FileUploadDropzone>
        ) : (
          <FileUploadTrigger
            aria-invalid={props['aria-invalid']}
            render={(triggerProps) => (
              <Button
                {...triggerProps}
                type="button"
                variant="outline"
                className="w-fit cursor-pointer"
              >
                <UploadIcon />
                Unggah gambar
              </Button>
            )}
          />
        ))}

      <FileUploadList>
        {files.map((file, index) => {
          const initialMedia = initialFiles.get(file);

          return (
            <FileUploadItem
              key={`${file.name}-${index}`}
              value={file}
              className="flex-col rounded-3xl"
            >
              <div className="flex w-full items-center gap-2 relative">
                <FileUploadItemPreview />
                <FileUploadItemMetadata />

                <div className="flex items-center gap-3">
                  {initialMedia && (
                    <Badge className="text-[10px]">Digunakan</Badge>
                  )}
                  <FileUploadItemDelete
                    render={(deleteProps) => (
                      <Button
                        {...deleteProps}
                        variant="ghost"
                        size="icon"
                        className="size-7 cursor-pointer"
                      >
                        <XIcon />
                      </Button>
                    )}
                  />
                </div>
              </div>

              {!initialMedia && (
                <FileUploadItemProgress
                  render={({ 'aria-valuenow': progress }) => (
                    <Progress
                      value={Number(progress ?? 0)}
                      className="w-full *:data-[slot=progress-track]:h-1 **:text-xs gap-1.5"
                    >
                      <ProgressLabel className="font-normal text-muted-foreground">
                        Mengunggah...
                      </ProgressLabel>
                      <ProgressValue />
                    </Progress>
                  )}
                />
              )}
            </FileUploadItem>
          );
        })}
      </FileUploadList>
    </FileUpload>
  );
}
