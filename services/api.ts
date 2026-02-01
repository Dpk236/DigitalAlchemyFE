
const BASE_URL = "https://askdoubt-backend.onrender.com";

export interface AskWithImageResponse {
  status: string;
  extracted_text: string;
  ai_response: string;
  type: string;
  data: any;
}

export const uploadQuestionImage = async (
  file: File,
  userId: string,
  videoId: string,
  sessionId: string,
  message?: string
): Promise<AskWithImageResponse> => {
  const formData = new FormData();
  formData.append("image", file);
  formData.append("user_id", userId);
  formData.append("video_id", videoId);
  formData.append("session_id", sessionId);
  if (message) formData.append("message", message);

  const response = await fetch(`${BASE_URL}/ask-with-image`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error("Failed to upload image");
  }

  return response.json();
};
