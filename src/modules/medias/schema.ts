import z from 'zod';

export class MediasSchema {
  static create = z.object({
    publicId: z.uuid('ID publik tidak valid.'),
    url: z.url('URL tidak valid.').nonempty('URL harus diisi.'),
    resourceType: z.enum(
      ['image', 'video'],
      'Jenis media harus berupa gambar atau video.',
    ),
    status: z.enum(['pending', 'attached'], 'Status media tidak valid.'),
  });
}
