export const IMAGE_MAX_DIMENSION = 1920;
export const THUMBNAIL_WIDTH = 400;
export const MAX_FILE_SIZE_MB = 10;
export const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

export function validateImageFile(file: File): string | null {
  if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
    return "Chỉ chấp nhận file JPG, PNG, hoặc WEBP.";
  }
  if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
    return `Kích thước file tối đa là ${MAX_FILE_SIZE_MB}MB.`;
  }
  return null;
}

export function getSupabaseImageUrl(
  bucket: string,
  path: string,
  supabaseUrl: string
): string {
  return `${supabaseUrl}/storage/v1/object/public/${bucket}/${path}`;
}

export function getSupabaseTransformUrl(
  originalUrl: string,
  width: number,
  quality = 80
): string {
  const url = new URL(originalUrl);
  url.searchParams.set("width", String(width));
  url.searchParams.set("quality", String(quality));
  return url.toString();
}
