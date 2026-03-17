import { NextResponse } from "next/server";
import { doctors } from "@/data/doctors";

export async function POST(req: Request) {
  const body = await req.json();
  const message  = body.message || body.input || "";

  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.GROQ_API_KEY}`
    },
    body: JSON.stringify({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content: "You are a medical triage assistant. Return only one specialty: heart, knee, skin, or eye."
        },
        {
          role: "user",
          content: message
        }
      ]
    })
  });

  const data = await response.json();

  const specialty = data.choices[0].message.content.trim();
  const doctor = doctors.find(
  (doc) => doc.specialty.toLowerCase() === specialty.toLowerCase()
);

if (!doctor) {
  return NextResponse.json({
    message: "No matching doctor found."
  });
}
return NextResponse.json({
  doctor: doctor.name,
  specialty: doctor.specialty,
  availability: doctor.availability
});
}