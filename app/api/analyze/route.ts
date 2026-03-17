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
    error: "AI response failed",
  });
}
   const specialty =
  data.choices[0].message?.content?.trim() || " ";


let mappedSpecialty = specialty.toLowerCase();

if (mappedSpecialty.includes("heart") || mappedSpecialty.includes("cardio")) {
  mappedSpecialty = "cardiology";
  } else if (mappedSpecialty.includes("knee") || mappedSpecialty.includes("bone")) {
  mappedSpecialty = "orthopedic";
} else if (mappedSpecialty.includes("skin") || mappedSpecialty.includes("rash")) {
  mappedSpecialty = "dermatology";
} else if (mappedSpecialty.includes("eye") || mappedSpecialty.includes("eye")) {
  mappedSpecialty = "ophthalmology";
} else {
  mappedSpecialty = "general medicine";
}


const doctor = doctors.find((doc) =>
  doc.specialty.toLowerCase().includes(mappedSpecialty)
);
    if (!doctor) {
      return NextResponse.json({
        doctor: "Dr. Hardin",
        specialty: mappedSpecialty,
        availability: ["9:00AM", "1:00PM"],
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
      doctor: "Dr.Smith",
      specialty: "mappedSpecialty",
      availability:  ["9:00AM", "1:00PM"],
  });
}
}
