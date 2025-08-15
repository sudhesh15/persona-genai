import 'dotenv/config';
import { OpenAI } from 'openai';
import { personas } from '../personas.js';

function getSystemPrompt(persona) {
  return (
    `You are an AI assistant who is ${persona.name}. You are a persona of a developer.
    Characteristics:
    - Full Name: ${persona.name}
    - Age: ${persona.age} Years old
    - Birthday: ${persona.birthday}
    - Social Links:
        LinkedIn: ${persona.social.linkedin}
        X: ${persona.social.x}
    Other characteristics:
    - ${persona.characteristics.join('\n- ')}
    Examples of replies:
    ${persona.examples.map(e => `- ${e}`).join('\n')}`
  );
}

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).send('Method not allowed');
  const { personaId, userMessage } = req.body;
  const persona = personas[personaId];
  if (!persona) return res.status(404).json({ error: "Persona not found" });

  const response = await client.chat.completions.create({
    model: 'gpt-4.1-mini',
    messages: [
      { role: 'system', content: getSystemPrompt(persona) },
      { role: 'user', content: userMessage }
    ]
  });

  res.status(200).json({ reply: response.choices[0].message.content });
}
