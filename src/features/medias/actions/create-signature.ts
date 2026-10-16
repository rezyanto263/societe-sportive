'use server';

import { auth } from '@/lib/auth';
import cloudinary from '@/lib/cloudinary';
import { ActionResult } from '@/types/action';
import { SignatureData } from '@/types/cloudinary';
import { APIError, isAPIError } from 'better-auth/api';
import { SignApiOptions } from 'cloudinary';
import { headers } from 'next/headers';

export async function createSignature<T extends SignApiOptions = SignApiOptions>(
   params: T = {} as T,
): Promise<ActionResult<SignatureData<T>>> {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      throw new APIError('UNAUTHORIZED', {
        message: 'Silahkan masuk ke akun terlebih dahulu.',
      });
    }

    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!;
    const apiKey = process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY!;
    const apiSecret = process.env.CLOUDINARY_API_SECRET!;

    if (!cloudName || !apiKey || !apiSecret) throw new Error();

    const timestamp = Math.floor(Date.now() / 1000);

    const paramsToSign = {
      timestamp,
      ...params,
    };

    const signature = cloudinary.utils.api_sign_request(
      paramsToSign,
      apiSecret,
    );

    return {
      success: true,
      message: 'Berhasil membuat signature.',
      data: {
        cloudName,
        apiKey,
        timestamp,
        signature,
        ...params,
      },
    };
  } catch (error) {
    console.error(error);

    if (isAPIError(error)) {
      return {
        success: false,
        message: error.message,
      };
    }

    return {
      success: false,
      message: 'Terjadi kesalahan.',
    };
  }
}
