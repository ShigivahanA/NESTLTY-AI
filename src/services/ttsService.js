const ELEVENLABS_API_KEY = import.meta.env.VITE_ELEVENLABS_API_KEY;
const VOICE_ID = 'qQfU5YYBVdiZOXa4SQhO'; // Serena

/**
 * Generates audio for a story using ElevenLabs.
 * Uses the stream endpoint for better stability with long texts.
 */
export async function generateStoryAudio(storyText) {
  if (!storyText) throw new Error("No story text provided");
  if (!ELEVENLABS_API_KEY) {
    console.error("ElevenLabs API Key is missing from environment variables.");
    throw new Error("API Key Missing");
  }

  // We use the stream endpoint and manually collect chunks to prevent connection timeouts
  // on longer stories (which can happen with the standard endpoint).
  const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}/stream`, {
    method: 'POST',
    headers: {
      'xi-api-key': ELEVENLABS_API_KEY,
      'Content-Type': 'application/json',
      'accept': 'audio/mpeg',
    },
    body: JSON.stringify({
      text: storyText,
      model_id: 'eleven_multilingual_v2',
      voice_settings: {
        stability: 0.5,
        similarity_boost: 0.8,
        style: 0.0,
        use_speaker_boost: true
      },
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const errorMessage = errorData.detail?.message || `Error ${response.status}: ${response.statusText}`;
    console.error("ElevenLabs API Failure:", errorMessage);
    throw new Error(errorMessage);
  }

  // Read the stream manually to keep the connection alive
  const reader = response.body.getReader();
  const chunks = [];
  
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    chunks.push(value);
  }

  return new Blob(chunks, { type: 'audio/mpeg' });
}
