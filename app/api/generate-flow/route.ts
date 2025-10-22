import { NextRequest, NextResponse } from 'next/server';
import { ChatGoogleGenerativeAI } from '@langchain/google-genai';
import { HumanMessage } from '@langchain/core/messages';
import { JsonOutputParser } from '@langchain/core/output_parsers';
import { z } from 'zod';

// The Zod schema for validation remains exactly the same. It defines the required structure for our React Flow state.
const flowSchema = z.object({
  nodes: z.array(
    z.object({
      id: z.string(),
      type: z.literal('textNode'),
      position: z.object({ x: z.number(), y: z.number() }),
      data: z.object({ label: z.string() }),
    })
  ),
  edges: z.array(
    z.object({
      id: z.string(),
      source: z.string(),
      target: z.string(),
    })
  ),
});

export async function POST(req: NextRequest) {
  try {
    const { prompt } = await req.json();

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    // Check for the new environment variable
    if (!process.env.GOOGLE_API_KEY) {
      return NextResponse.json({ error: 'GOOGLE_API_KEY is not configured' }, { status: 500 });
    }

    // Initialize the ChatGoogleGenerativeAI model
    const model = new ChatGoogleGenerativeAI({
      apiKey: process.env.GOOGLE_API_KEY,
      model: 'gemini-2.5-flash',
      temperature: 0.6,
    });

    // The JSON output parser remains the same
    const parser = new JsonOutputParser<z.infer<typeof flowSchema>>();

    // The system prompt, It tells the AI its role and the exact JSON format required.
    const systemPrompt = `
      You are an expert chatbot flow designer. Based on the user's description, create a complete chatbot flow.
      The flow must consist of an array of 'nodes' and an array of 'edges'.
      - Each node is a message and must have a unique 'id', a 'type' of 'textNode', a 'position' (arrange them logically, like in a vertical column, spaced 150 pixels apart on the y-axis), and 'data' with a 'label'.
      - Each edge connects two nodes and must have a unique 'id' (e.g., "e1-2"), a 'source' (the ID of the starting node), and a 'target' (the ID of the ending node).
      - Ensure the flow is logical and all nodes are connected. The first node should be the starting point.
      - Return ONLY a single, valid, minified JSON object that strictly adheres to the following Zod schema and contains no other text, explanations, or markdown formatting like \`\`\`json.
      
      Schema:
      ${JSON.stringify(flowSchema.shape)}
    `;

    // Chain the model and parser together
    const chain = model.pipe(parser);

    // Invoke the chain with the user's prompt
    const response = await chain.invoke([
      new HumanMessage(systemPrompt),
      new HumanMessage(`User's description: "${prompt}"`),
    ]);

    // Return the structured JSON response
    return NextResponse.json(response);

  } catch (error) {
    console.error('Error generating flow:', error);
    return NextResponse.json({ error: 'Failed to generate flow. The AI model may have returned an invalid structure.' }, { status: 500 });
  }
}