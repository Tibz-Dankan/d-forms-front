export const formattedDate = (dateString: string) => {
  const date = new Date(dateString);

  const day = date.toDateString();
  const time = date.toLocaleTimeString("en-Us", {
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  });

  return `${day} ${time}`;
};
