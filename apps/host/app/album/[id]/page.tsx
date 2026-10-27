import { AlbumPage } from "@web/album";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <AlbumPage id={id} />;
}
