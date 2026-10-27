import { getTracks } from "@web/album/catalogue";

export async function GET(request: Request) {
  const ids = new URL(request.url).searchParams.get("ids") ?? "";
  return Response.json(await getTracks(ids));
}
