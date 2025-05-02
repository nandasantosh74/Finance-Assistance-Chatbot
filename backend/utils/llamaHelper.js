import axios from "axios";

export async function getLlamaResponse(question) {
  try {
    console.log("🚀 Sending to Llama:", question);

    const response = await axios.post("http://localhost:11434/api/generate", {
      model: "llama3",
      prompt: `You are a helpful Finance Assistant Chatbot. Your name is FinBot. You provide expert financial guidance. Stay on-topic and give clear, professional advice. If asked 'Who are you?', reply: "I am your Finance Assistant Bot, here to help with your financial queries." Now, answer the following question: "${question}"`,
      stream: false,
    });

    console.log("✅ Llama Response:", response.data.response);
    return response.data.response;
  } catch (error) {
    console.error("🔥 Llama Error:", error?.response?.data || error.message || error);
    return "I'm sorry, I couldn't process your request.";
  }
}
