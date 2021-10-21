import { VideoTags } from "../../../../../../types";

export function getTag(
  tags: VideoTags[] | undefined,
  tooltipTime: number
): VideoTags | undefined {
  if (!tags) return;
  const tooltip = new Date(tooltipTime).getTime();
  for (let index = 0; index < tags.length; index++) {
    const element = tags[index];
    const tagTime = new Date(
      Number(element.time.hours) * 3600 +
        Number(element.time.minutes) * 60 +
        Number(element.time.seconds)
    ).getTime();
    // if exists return the next, else current;
    if (tooltip > tagTime) {
      const nextElement = tags[index + 1];
      if (nextElement) {
        const nexttagTime = new Date(
          Number(nextElement.time.hours) * 3600 +
            Number(nextElement.time.minutes) * 60 +
            Number(nextElement.time.seconds)
        ).getTime();
        if (tagTime < tooltip && tooltip < nexttagTime) {
          return element;
        }
      } else {
        return element;
      }
    }
  }
  return;
}
