import dayjs from "dayjs";

export const timeAgo = (createdAt) => {
  const now = dayjs();
  const createdTime = dayjs(createdAt);
  const diffInSeconds = now.diff(createdTime, "second");
  const diffInMinutes = now.diff(createdTime, "minute");
  const diffInHours = now.diff(createdTime, "hour");
  const diffInDays = now.diff(createdTime, "day");

  if (diffInSeconds < 60) {
    return `${diffInSeconds}s`;
  } else if (diffInMinutes < 60) {
    return `${diffInMinutes}m`;
  } else if (diffInHours < 24) {
    return `${diffInHours}h`;
  } else {
    return `${diffInDays}d`;
  }
};
