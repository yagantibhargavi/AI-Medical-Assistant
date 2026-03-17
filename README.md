# AI Medical Assistant

An AI-powered medical assistant that helps patients describe symptoms, recommends doctors, books appointments, and allows continuing the conversation through voice.

## Features

* AI symptom analysis through chat
* Doctor recommendation based on symptoms
* Appointment booking system
* Email confirmation for appointments
* Voice AI conversation that continues the chat context

## Technologies Used

* Next.js
* TypeScript
* JavaScript
* GROQ API
* Vapi (Voice AI)
* Resend (Email API)
* Tailwind CSS

## How It Works

1. The user describes their symptoms in the chat.
2. The AI analyzes the symptoms and recommends a doctor.
3. The user books an appointment.
4. A confirmation email is sent to the patient.
5. The user can continue the conversation with the AI using voice.

## Running the Project Locally

Install dependencies:

npm install

Run the development server:

npm run dev

Open:

http://localhost:3000

## Project Structure

app/

* page.tsx – Main UI
* api/analyze – AI symptom analysis
* api/send-email – Email confirmation

doctors.ts – Doctor data and availability

## Future Improvements

* Real doctor database integration
* Calendar scheduling
* Medical history storage
* Video consultation

## Author
Bhargavi 
