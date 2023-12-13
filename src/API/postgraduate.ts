import { url } from "../store";

interface SubmissionData {
  data: any;
}

export const submitPostgraduateApplication = async ({
  data,
}: SubmissionData) => {
  const response = await fetch(`${url}/postgraduate`, {
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

export const getPostgraduateApplicants = async () => {
  const response = await fetch(`${url}/postgraduate`, {
    method: "GET",
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
