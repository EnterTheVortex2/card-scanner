import type { Context, Config } from "@netlify/functions";
import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic();

const PROMPT = `You are a trading card game expert. Analyze this card image and return ONLY a JSON object with no markdown, no explanation, just raw JSON.

Identify if this is a Pokémon card or Yu-Gi-Oh card, then extract:

For Pokémon:
{
  "type": "pokemon",
  "name": "exact pokemon name (e.g. Charizard)",
  "set": "set name (e.g. Base Set, Fossil, Sword & Shield)",
  "number": "card number if visible (e.g. 4/102)",
  "rarity": "Common/Uncommon/Rare/Holo Rare/Ultra Rare etc",
  "year": "year if visible",
  "description": "one sentence about this card's collector/gameplay value"
}

For Yu-Gi-Oh:
{
  "type": "yugioh",
  "name": "exact card name as printed",
  "set": "set name if visible",
  "rarity": "Common/Rare/Super Rare/Ultra Rare/Secret Rare etc",
  "cardType": "Monster/Spell/Trap",
  "year": "year if visible",
  "description": "one sentence about this card's collector/gameplay value"
}

If you cannot identify it clearly, return:
{"type": "unknown", "name": "Unknown Card", "description": "Could not identify this card clearly."}

Return ONLY the JSON object.`;

export default async (req: Request, context: Context) => {
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const { image, mediaType } = await req.json();

    if (!image) {
      return new Response(
        JSON.stringify({ error: "No image data provided" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const message = await anthropic.messages.create({
      model: "claude-haiku-4-5",
      max_tokens: 500,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "image",
              source: {
                type: "base64",
                media_type: mediaType || "image/jpeg",
                data: image,
              },
            },
            { type: "text", text: PROMPT },
          ],
        },
      ],
    });

    const text = message.content
      .map((b) => ("text" in b ? b.text : ""))
      .join("")
      .trim();
    const clean = text.replace(/```json|```/g, "").trim();

    const cardInfo = JSON.parse(clean);

    return new Response(JSON.stringify(cardInfo), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};

export const config: Config = {
  path: "/api/identify-card",
};
