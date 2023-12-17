import { url } from "../store";

interface SubmissionData {
  data: any;
}

export const submitPromotionApplication = async ({ data }: SubmissionData) => {
  const response = await fetch(`${url}/promotion`, {
    method: "POST",
    body: JSON.stringify({
      data: data,
    }),
    headers: {
      "Content-type": "application/json",
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message);
  }
  return await response.json();
};
