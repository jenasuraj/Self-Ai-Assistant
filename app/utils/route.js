import axios from "axios";

export const sendToFastAPI = async (inputText) => {
  try {
    const response = await axios.post("http://127.0.0.1:8000/ask", {
      question: inputText,
    });
    return response.data.answer;
  } catch (error) {
    console.error("Error sending request:", error);
    return "Error processing request.";
  }
};
