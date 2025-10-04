import DiscographyGrid from "@/components/DiscographyGrid";
import data from "../../constants/discography.json";

export const metadata = {
  title: "Discografía — Megadeth Fan",
  description:
    "Discografía de Megadeth: álbumes, portadas, productores y links a streaming.",
};

export default function AlbumsPage() {
  return <DiscographyGrid albums={data} />;
}
