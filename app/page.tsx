"use client";

import { useState } from "react";
import { doctors } from "../data/doctors";
import Vapi from "@vapi-ai/web";

export default function Home() {

  const [patient, setPatient] = useState<any>(null);

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    dob: "",
    phone: "",
    email: "",
    reason: ""
  });

  const [messages, setMessages] = useState([
  { role: "assistant", content: "Hello, please describe your symptoms." }
]);

const [input, setInput] = useState("");
const [selectedDoctor, setSelectedDoctor] = useState<any>(null);
const [appointment, setAppointment] = useState<any>(null);
const vapi = new Vapi(process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY!);

const startVoiceCall = () => {
  vapi.start(process.env.NEXT_PUBLIC_VAPI_ASSISTANT_ID!, {
    metadata: {
      chatHistory: messages
    }
  });
};
const endVoiceCall = () => {
  vapi.stop();
};

 const handleSubmit = () => {
    setPatient(form);
  };

  if (!patient) {
    return (
      <div className="p-10 text-white">

        <h1 className="text-2xl mb-6">
          Kyron Medical Patient Intake
        </h1>

       <input
  placeholder="First Name"
  value={form.firstName}
  className="border border-gray-400 bg-white text-black p-2 rounded w-full mb-3"
  onChange={(e) =>
    setForm({ ...form, firstName: e.target.value })
  }
/>
          <input
          placeholder="Last Name"
          value={form.lastName}
          className="border border-gray-400 bg-white text-black p-2 rounded w-full mb-3"
          onChange={(e) =>
            setForm({ ...form, lastName: e.target.value })
          }
        />

        <input
          placeholder="DOB"
          value={form.dob}
          className="border border-gray-400 bg-white text-black p-2 rounded w-full mb-3"
          onChange={(e) =>
            setForm({ ...form, dob: e.target.value })
          }
        />

        <input
          placeholder="Phone"
          value={form.phone}
          className="border border-gray-400 bg-white text-black p-2 rounded w-full mb-3"
          onChange={(e) =>
            setForm({ ...form, phone: e.target.value })
          }
        />

        <input
          placeholder="Email"
          value={form.email}
          className="border border-gray-400 bg-white text-black p-2 rounded w-full mb-3"
          onChange={(e) =>
            setForm({ ...form, email: e.target.value })
          }
        />

        <input
          placeholder="Reason for Appointment"
          value={form.reason}
          className="border border-gray-400 bg-white text-black p-2 rounded w-full mb-3"
          onChange={(e) =>
            setForm({ ...form, reason: e.target.value })
          }
        />

        <button 
        className="bg-blue-600 text-white px-4 py-2 rounded mt-3"
        onClick={handleSubmit}>
          Start Chat
        </button>

      </div>
    );
  }

  const symptomMap: any = {
  heart: ["chest pain", "heart pain", "palpitations"],
  knee: ["knee pain", "leg injury", "joint pain"],
  skin: ["rash", "itching", "acne"],
  eye: ["blurry vision", "eye pain", "vision problem"]
};

const handleSend = async () => {
  if (!input.trim()) return;

  const userMessage = input.toLowerCase();

  const res = await fetch("/api/analyze", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({ message: input }),
})

const data = await res.json()

let response = "";

if (data.doctor) {
  const response = `You should see ${data.doctor} (${data.specialty}). Availability: ${data.availability}`;
} else {
  response = "Assigned to General Doctor";
}
  setMessages([
    ...messages,
    { role: "user", content: input },
    { role: "assistant", content: response }
  ]);

  setInput("");
};
const handleBooking = async () => {
  if (!selectedDoctor) return;

  const time = selectedDoctor.availability[0];

  const newAppointment = {
    doctor: selectedDoctor.name,
    time: time
  };

  setAppointment(newAppointment);

  await fetch("/api/send-email", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      email: "bhargavi.developer99@gmail.com",
      doctor: newAppointment.doctor,
      time: newAppointment.time
    })
  });
};

return (
 <div className="p-10 text-white">

<h2 className="text-xl mb-4">Welcome</h2>

<div className="border p-4 h-48 mb-4">
  {messages.map((m, i) => (
    <div key={i}>
      <b>{m.role === "assistant" ? "AI Assistant" : "You"}:</b> {m.content}
    </div>
  ))}
</div>

<input
  type="text"
  value={input}
  onChange={(e) => setInput(e.target.value)}
  placeholder="Describe your symptoms..."
  className="border border-gray-400 bg-white text-black p-2 rounded w-full mb-3"
/>
<button
  className="bg-blue-600 px-4 py-2 mt-2 rounded"
  onClick={handleSend}
>
Send
</button>


    {/* Doctor Card */}
    {selectedDoctor && (
      <div className="border p-4 rounded mt-6 bg-gray-900 text-white w-96">

        <h2 className="text-xl font-bold">
          {selectedDoctor.name}
        </h2>

        <p className="mb-2 capitalize">
          {selectedDoctor.specialty} Specialist
        </p>

        <p className="font-semibold">Available Times:</p>

        <ul className="mb-3">
          {selectedDoctor.availability.map((time: string, i: number) => (
            <li key={i}>{time}</li>
          ))}
        </ul>
        {appointment && (
  <div className="mt-6 p-4 border rounded bg-green-900 w-96">

    <h2 className="text-xl font-bold">
      Appointment Confirmed
    </h2>

    <p>Doctor: {appointment.doctor}</p>
    <p>Time: {appointment.time}</p>

    <button
 onClick={startVoiceCall}
 className="bg-purple-600 text-white px-4 py-2 mt-3 rounded"
>
 Continue by Voice
</button>

<button
  onClick={endVoiceCall}
  className="bg-red-600 px-4 py-2 mt-2 rounded text-white"
>
  End Voice Call
</button>
  </div>
)}

        <button 
        onClick={handleBooking}
        className="bg-blue-600 px-4 py-2 rounded">
          Book Appointment
        </button>

      </div>
    )}

  </div>
);
}
