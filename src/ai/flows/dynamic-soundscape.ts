// src/ai/flows/dynamic-soundscape.ts
'use server';

/**
 * @fileOverview A flow for dynamically adjusting the soundscape based on the sleep timer.
 *
 * - adjustSoundscape - A function that adjusts the soundscape based on the current time, original audio description, and timer status.
 * - AdjustSoundscapeInput - The input type for the adjustSoundscape function.
 * - AdjustSoundscapeOutput - The return type for the adjustSoundscape function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AdjustSoundscapeInputSchema = z.object({
  audioDescription: z.string().describe('A description of the original ambiance audio.'),
  timerStatus: z.enum(['off', 'running', 'almost_done']).describe('The current sleep timer status.'),
  currentTime: z.string().describe('The current time of day.'),
});
export type AdjustSoundscapeInput = z.infer<typeof AdjustSoundscapeInputSchema>;

const AdjustSoundscapeOutputSchema = z.object({
  modifiedAudioDescription: z.string().describe('A description of the modified ambiance audio.'),
});
export type AdjustSoundscapeOutput = z.infer<typeof AdjustSoundscapeOutputSchema>;

export async function adjustSoundscape(input: AdjustSoundscapeInput): Promise<AdjustSoundscapeOutput> {
  return adjustSoundscapeFlow(input);
}

const modifyAudioDescriptionTool = ai.defineTool({
    name: 'modifyAudioDescription',
    description: 'Modifies the description of the ambiance audio based on the current time and timer status to create a more engaging and dynamic soundscape.',
    inputSchema: z.object({
      originalAudioDescription: z.string().describe('The original description of the ambiance audio.'),
      timerStatus: z.enum(['off', 'running', 'almost_done']).describe('The current sleep timer status.'),
      currentTime: z.string().describe('The current time of day.'),
    }),
    outputSchema: z.string().describe('The modified description of the ambiance audio.'),
  },
  async (input) => {
    // Simulate modifying the audio description based on the input.
    // In a real application, this could involve using audio processing libraries or APIs.
    let modifiedDescription = input.originalAudioDescription;

    if (input.timerStatus === 'running') {
      modifiedDescription += ` The ambiance is subtly changing as the timer progresses.`;
    } else if (input.timerStatus === 'almost_done') {
      modifiedDescription += ` The ambiance is slowly fading out as the timer nears its end.`;
    }

    return modifiedDescription;
  }
);

const adjustSoundscapePrompt = ai.definePrompt({
  name: 'adjustSoundscapePrompt',
  tools: [modifyAudioDescriptionTool],
  input: {schema: AdjustSoundscapeInputSchema},
  output: {schema: AdjustSoundscapeOutputSchema},
  prompt: `You are an AI that subtly modifies an ambiance audio description based on the current time and sleep timer status.

The original audio description is: {{{audioDescription}}}
The current time is: {{{currentTime}}}
The sleep timer status is: {{{timerStatus}}}

Use the modifyAudioDescription tool to adjust the audio description to create a more engaging and dynamic soundscape.  The transitions should be seamless and not abrupt.
`, 
});

const adjustSoundscapeFlow = ai.defineFlow(
  {
    name: 'adjustSoundscapeFlow',
    inputSchema: AdjustSoundscapeInputSchema,
    outputSchema: AdjustSoundscapeOutputSchema,
  },
  async input => {
    const {output} = await adjustSoundscapePrompt(input);
    return output!;
  }
);
