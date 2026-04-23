const OPENROUTER_API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY;
const BASE_URL = "https://openrouter.ai/api/v1/chat/completions";

const MODELS = [
  "google/gemma-3-27b-it:free",
  "meta-llama/llama-3.3-70b-instruct:free",
  "openrouter/free",
  "qwen/qwen-2.5-7b-instruct:free"
];

let lastCallTimestamp = 0;
const THROTTLE_DURATION = 3000; // 3 seconds

/**
 * Generates a personalized bedtime story using OpenRouter AI.
 * Handles rate limits, fallbacks, and throttling.
 */
export async function generateStory(childProfile, dailyInput) {
  // 1. Client-side Throttling
  const now = Date.now();
  if (now - lastCallTimestamp < THROTTLE_DURATION) {
    const waitTime = Math.ceil((THROTTLE_DURATION - (now - lastCallTimestamp)) / 1000);
    throw new Error(`Please wait ${waitTime}s before weaving another story.`);
  }

  if (!OPENROUTER_API_KEY) {
    throw new Error("OpenRouter API Key is missing. Please set VITE_OPENROUTER_API_KEY in your .env file.");
  }

  const systemPrompt = `
You are an expert children's bedtime storyteller.

Your goal is to create soothing, imaginative, emotionally warm stories for children aged 3–10.

Always prioritize:
- calmness and safety
- gentle pacing
- positive emotional tone
- simple, vivid language

Avoid:
- anything scary, loud, or intense
- complex or confusing plots
- negative or sad endings
`;
  const userPrompt = `
Create a personalized bedtime story using the details below.

Child Details:
- Name: ${childProfile.name}
- Gender: ${childProfile.gender === 'male'
      ? 'Boy (use he/him)'
      : childProfile.gender === 'female'
        ? 'Girl (use she/her)'
        : 'Child (use they/them)'
    }
- Age: ${childProfile.age || 'young child'}

Personality & Interests:
- Interests: ${Array.isArray(childProfile.interests)
      ? childProfile.interests.join(', ')
      : childProfile.interests || 'imagination, play, and curiosity'
    }

Today’s Context:
- Activities: ${dailyInput.activities || 'had a simple, happy day'}
- Mood: ${dailyInput.mood || 'calm'}
- Notes: ${dailyInput.notes || 'none'}

---

Story Requirements:

1. The child MUST be the main character.
2. Use the child’s name naturally throughout the story (not over-repeated).
3. Reflect today’s activities subtly in the story.
4. Match the tone to the mood (e.g., calm → soothing, adventurous → light excitement but still gentle).
5. Include:
   - a simple beginning (setting)
   - a small magical or imaginative moment
   - a gentle resolution
6. End with a peaceful, comforting conclusion that encourages sleep.

---

Style Guidelines:

- The story MUST be at least 450–600 words
- Do NOT generate a short story
- Expand scenes with details, descriptions, and gentle pacing
- If the story is too short, continue writing until it reaches full length
- Language: simple, clear, and visual
- Sentences: short to medium (easy for listening)
- Tone: warm, soft, and slightly dreamy
- Add natural pauses using commas and short sentences
- Occasionally use ellipses (...) for gentle pauses
- Break long sentences into smaller ones
- If the story feels short, continue expanding it with more descriptive and calming details until it reaches full bedtime story length.

---

Output:

- Write ONLY the story
- Do NOT include headings or explanations
- Do NOT repeat instructions
`;

  let currentModelIndex = 0;
  let retries = 3;
  let delay = 3000; // Initial delay 3s

  while (currentModelIndex < MODELS.length) {
    const currentModel = MODELS[currentModelIndex];

    try {
      lastCallTimestamp = Date.now();

      const response = await fetch(BASE_URL, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
          "HTTP-Referer": window.location.origin,
          "X-Title": "Nestly Bedtime Stories",
        },
        body: JSON.stringify({
          model: currentModel,
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt }
          ],
          temperature: 0.7,
          max_tokens: 1500,
        })
      });

      // Handle 429 Rate Limit
      if (response.status === 429) {
        const retryAfter = response.headers.get("Retry-After");
        const waitMs = retryAfter ? parseInt(retryAfter) * 1000 : delay;

        console.warn(`Rate limited (429) on ${currentModel}. Waiting ${waitMs}ms...`);
        await new Promise(resolve => setTimeout(resolve, waitMs));

        delay *= 2; // Exponential backoff
        retries--;

        if (retries <= 0) {
          console.warn(`Max retries for ${currentModel}. Switching to next model...`);
          currentModelIndex++;
          retries = 2; // Reset retries for next model
          delay = 3000;
        }
        continue;
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || `API error: ${response.status}`);
      }

      const data = await response.json();
      const storyText = data.choices?.[0]?.message?.content;

      if (!storyText) {
        throw new Error("AI returned an empty response.");
      }

      console.log(`Successfully generated story using: ${currentModel}`);
      return storyText.trim();

    } catch (error) {
      console.error(`Error with model ${currentModel}:`, error.message);

      // If it's the last model, throw the error
      if (currentModelIndex === MODELS.length - 1) {
        throw error;
      }

      // Otherwise, try next model
      currentModelIndex++;
      retries = 2;
      delay = 3000;
      console.warn(`Switching to fallback model: ${MODELS[currentModelIndex]}`);
    }
  }

  throw new Error("All models failed to generate the story. Please try again later.");
}
