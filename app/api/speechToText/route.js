import OpenAI, { toFile } from "openai";
import fs from "fs";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request) {
  try {
    const req = await request.json();
    const audio = Buffer.from(req.input, "base64");
    const inputPath = "/tmp/input.mp3";
    fs.writeFileSync(inputPath, audio);
    const response = await openai.audio.transcriptions.create({
      file: fs.createReadStream(inputPath),
      model: "whisper-1",
    });
    fs.unlinkSync(inputPath);
    return new Response(JSON.stringify({ output: response.text }), {
      status: 200,
    });
  } catch (error) {
    console.error("Error during API request:", error);
    if (fs.existsSync(inputPath)) {
      fs.unlinkSync(inputPath);
    }
    return new Response(`API error: ${error.message}`, { status: 400 });
  }
}
