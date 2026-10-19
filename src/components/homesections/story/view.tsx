import { useTranslations } from "next-intl";
import StoryBible from "./bible";

const StoriesSection = () => {
    const t = useTranslations("stories");
    const stories = t.raw("stories");
    const conclusion = t("conclusion");
    console.log(stories)
    return (
        <StoryBible stories={stories} conclusion={conclusion} />
    )
}

export default StoriesSection