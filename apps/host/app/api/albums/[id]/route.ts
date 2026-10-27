import { getAlbum } from "@web/album/catalogue";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const album = await getAlbum(id);
  if (!album) return Response.json({ message: "Album not found" }, { status: 404 });
  return Response.json(album);
}
