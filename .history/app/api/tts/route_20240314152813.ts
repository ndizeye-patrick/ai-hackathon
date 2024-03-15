import { type NextRequest } from "next/server";
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
  const { text } = await req.json();

  try {
    const response = await client.audio.speech.create({
      model: "tts-1",
      voice: "alloy",
      input: text,
    });
    return new Response(response.body);
  } catch (error) {
    console.log(error);
  }
}
