import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(req: Request) {
  const body = await req.json();

  const chatCompletion = await groq.chat.completions.create({
    messages: [
      {
        role: "system",
        content: "You are a helpful medical AI assistant.",
      },
      {
        role: "user",
        content: body.message,
      },
    ],
    model: "llama-3.3-70b-versatile",
  });

  return Response.json({
    reply: chatCompletion.choices[0].message.content,
  });
}