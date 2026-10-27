import { getAlbums } from "@web/album/catalogue";

export async function GET() {
  return Response.json(await getAlbums());
}
