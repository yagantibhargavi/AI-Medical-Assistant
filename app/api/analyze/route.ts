import { NextResponse } from "next/server";
import { doctors } from "@/data/doctors";

export async function POST(req: Request) {
    try{
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

    //  SAFETY CHECK (prevents crash)
    if (!data || !data.choices || !data.choices[0]) {
      return NextResponse.json({
        doctor: "Dr. Default",
        specialty: "General Medicine",
        availability: "Available",
      });
    }

    const specialty =
      data.choices[0].message?.content?.trim() || "General Medicine";

    //  SAFE MATCHING
    const doctor = doctors.find(
      (doc) =>
        doc.specialty.toLowerCase() === (specialty || "").toLowerCase()
    );

    //  FALLBACK IF NO MATCH
    if (!doctor) {
      return NextResponse.json({
        doctor: "Dr. General",
        specialty: specialty,
        availability: "Available",
      });
    }

    //  SUCCESS RESPONSE
    return NextResponse.json({
      doctor: doctor.name,
      specialty: doctor.specialty,
      availability: doctor.availability,
    });
  } catch (error) {
    console.error("Error:", error);

    //  FINAL FAILSAFE
    return NextResponse.json({
      doctor: "Dr. Emergency",
      specialty: "General Medicine",
      availability: "Available",
    });
  }
}
