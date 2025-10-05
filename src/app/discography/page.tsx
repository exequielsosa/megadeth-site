import DiscographyGrid from "@/components/DiscographyGrid";
import data from "../../constants/discography.json";
import ContainerGradient from "../../components/atoms/ContainerGradient";

export const metadata = {
  title: "Discografía — Megadeth Fan",
  description:
    "Discografía de Megadeth: álbumes, portadas, productores y links a streaming.",
};

export default function AlbumsPage() {
  return (
    <ContainerGradient>
      <DiscographyGrid albums={data} />
    </ContainerGradient>
  );
}
