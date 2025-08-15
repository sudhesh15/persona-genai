import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { OpenAI } from 'openai';
import { personas } from './personas.js';

const app = express();
const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

app.use(cors());
app.use(express.json());

function getSystemPrompt(persona) {
  return `
    You are an AI assistant who is ${persona.name}. You are a persona of a developer.
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
    ${persona.examples.map(e => `- ${e}`).join('\n')}
  `;
}

app.post('/chat', async (req, res) => {
  const { personaId, userMessage } = req.body;
  const persona = personas[personaId];
  if (!persona) return res.status(404).send({ error: "Persona not found" });

  const response = await client.chat.completions.create({
    model: 'gpt-4.1-mini',
    messages: [
      { role: 'system', content: getSystemPrompt(persona) },
      { role: 'user', content: userMessage }
    ]
  });

  res.json({ reply: response.choices[0].message.content });
});

app.get('/personas', (req, res) => {
  res.json(personas);
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));
