import { NextResponse } from "next/server";
import { uploadFile, listMedia, deleteFile } from "@/lib/storage";

export async function GET() {
  try {
    const files = await listMedia();
    return NextResponse.json({ success: true, files });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const folder = (formData.get("folder") as string) ?? "images";

    if (!file) {
      return NextResponse.json(
        { success: false, error: "No file provided" },
        { status: 400 },
      );
    }

    const result = await uploadFile(file, folder);
    return NextResponse.json({ success: true, ...result }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 },
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { path } = await request.json();
    if (!path) {
      return NextResponse.json(
        { success: false, error: "No path provided" },
        { status: 400 },
      );
    }
    await deleteFile(path);
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 },
    );
  }
}
