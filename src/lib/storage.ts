import { supabaseAdmin } from "./supabase";

const BUCKET = "media";

export async function uploadFile(
  file: File,
  folder = "images",
): Promise<{ url: string; path: string }> {
  const ext = file.name.split(".").pop() ?? "jpg";
  const name = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
  const filePath = `${folder}/${name}`;

  const { error } = await supabaseAdmin.storage
    .from(BUCKET)
    .upload(filePath, file, {
      cacheControl: "31536000",
      upsert: false,
    });

  if (error) throw error;

  const { data: publicUrl } = supabaseAdmin.storage
    .from(BUCKET)
    .getPublicUrl(filePath);

  return { url: publicUrl.publicUrl, path: filePath };
}

export async function listMedia(
  folder?: string,
): Promise<{ name: string; url: string; created_at: string; size: number }[]> {
  const prefix = folder ? `${folder}/` : undefined;
  const { data, error } = await supabaseAdmin.storage
    .from(BUCKET)
    .list(prefix ?? "", { sortBy: { column: "created_at", order: "desc" } });

  if (error) throw error;

  return (data ?? [])
    .filter((f) => !f.id) // only files, not folders
    .map((f) => ({
      name: f.name,
      url: supabaseAdmin.storage.from(BUCKET).getPublicUrl(prefix ? `${prefix}${f.name}` : f.name).data.publicUrl,
      created_at: f.created_at ?? "",
      size: (f.metadata as any)?.size ?? 0,
    }));
}

export async function deleteFile(path: string): Promise<void> {
  const { error } = await supabaseAdmin.storage.from(BUCKET).remove([path]);
  if (error) throw error;
}

export async function listFolders(): Promise<string[]> {
  const { data, error } = await supabaseAdmin.storage
    .from(BUCKET)
    .list();

  if (error) throw error;

  const folderNames = new Set<string>();
  for (const item of data ?? []) {
    if (item.metadata === null) folderNames.add(item.name.replace("/", ""));
  }
  return Array.from(folderNames);
}
