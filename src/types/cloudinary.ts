import { SignApiOptions } from "cloudinary";

export type CloudinaryImage = {
  publicId: string;
  url: string;
  width: number;
  height: number;
  format: string;
  bytes: number;
};

export type SignatureData<T extends SignApiOptions> = T & {
  cloudName: string;
  apiKey: string;
  timestamp: number;
  signature: string;
};

export type CloudinaryUploadResponse = {
  public_id: string;
  secure_url: string;
  width: number;
  height: number;
  format: string;
  bytes: number;
  error?: {
    message?: string;
  };
};