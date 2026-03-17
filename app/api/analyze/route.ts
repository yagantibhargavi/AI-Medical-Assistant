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


    if (!data || !data.choices || !data.choices[0]) {
      return NextResponse.json({
        doctor: "Dr. Default",
        specialty: "General Medicine",
        availability: "Available",
      });
    }

    const specialty =
  data.choices[0].message?.content?.trim() || "General Medicine";

let mappedSpecialty = (specialty || "").toLowerCase();

if (mappedSpecialty.includes("heart") || mappedSpecialty.includes("cardio")) {
  mappedSpecialty = "cardiology";
}

if (mappedSpecialty.includes("skin")) {
  mappedSpecialty = "dermatology";
}

if (mappedSpecialty.includes("brain") || mappedSpecialty.includes("neuro")) {
  mappedSpecialty = "neurology";
}

const doctor = doctors.find((doc) =>
  doc.specialty.toLowerCase().includes(mappedSpecialty)
);
    if (!doctor) {
      return NextResponse.json({
        doctor: "Dr. General",
        specialty: specialty,
        availability: "Available",
      });
    }

    return NextResponse.json({
      doctor: doctor.name,
      specialty: doctor.specialty,
      availability: doctor.availability,
    });
  } catch (error) {
    console.error("Error:", error);

  
    return NextResponse.json({
      doctor: "Dr. Emergency",
      specialty: "General Medicine",
      availability: "Available",
    });
  }
}
