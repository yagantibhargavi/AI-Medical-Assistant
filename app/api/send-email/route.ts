import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  const { email, doctor, time } = await req.json();

  try {
    await resend.emails.send({
      from: "Kyron Medical <onboarding@resend.dev>",
      to: email,
      subject: "Appointment Confirmation",
      html: `
        <h2>Appointment Confirmed</h2>
        <p>Your appointment has been booked.</p>
        <p><b>Doctor:</b> ${doctor}</p>
        <p><b>Time:</b> ${time}</p>
      `
    });

    return NextResponse.json({ success: true });

  } catch (error) {
    return NextResponse.json({ error });
  }
}