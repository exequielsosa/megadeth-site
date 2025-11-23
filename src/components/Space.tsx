import { useTranslations } from "next-intl";
import ArticleCard from "./ArticleCard";

function Space() {
  const t = useTranslations("spaceInterview");

  return (
    <ArticleCard
      title={t("title")}
      description={t("description")}
      imageUrl="/images/interviews/space.webp"
      imageAlt={t("imageAlt")}
      imageCaption={t("imageCaption")}
      linkUrl="/entrevistas/dave-mustaine-final-show-space-2025"
      linkTarget="_blank"
      priority={true}
    />
  );
}

export default Space;
