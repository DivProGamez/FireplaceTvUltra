// src/ai/flows/personalized-ambiance.ts
'use server';

/**
 * @fileOverview A flow for generating personalized ambiance soundscapes based on user activity.
 *
 * - generatePersonalizedAmbiance - A function that generates personalized ambiance.
 * - PersonalizedAmbianceInput - The input type for the generatePersonalizedAmbiance function.
 * - PersonalizedAmbianceOutput - The return type for the generatePersonalizedAmbiance function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PersonalizedAmbianceInputSchema = z.object({
  ambianceType: z
    .string()
    .describe('The type of ambiance (e.g., Fireplace, Rain, Aquarium).'),
  userActivity: z
    .string()
    .describe(
      'A description of the user activity (e.g., using the device, sleeping, reading).'    ),
  timerStatus: z.string().optional().describe('The status of the sleep timer (e.g., active, inactive).'),
});

export type PersonalizedAmbianceInput = z.infer<typeof PersonalizedAmbianceInputSchema>;

const PersonalizedAmbianceOutputSchema = z.object({
  adjustedAudioLoop: z
    .string()
    .describe(
      'A description of the adjusted audio loop, incorporating changes based on user activity and timer status.'
    ),
});

export type PersonalizedAmbianceOutput = z.infer<typeof PersonalizedAmbianceOutputSchema>;

export async function generatePersonalizedAmbiance(
  input: PersonalizedAmbianceInput
): Promise<PersonalizedAmbianceOutput> {
  return personalizedAmbianceFlow(input);
}

const adjustAmbiancePrompt = ai.definePrompt({
  name: 'adjustAmbiancePrompt',
  input: {schema: PersonalizedAmbianceInputSchema},
  output: {schema: PersonalizedAmbianceOutputSchema},
  prompt: `You are an AI that subtly adjusts audio loops for relaxation ambiances based on user activity and timer status.

  Ambiance Type: {{{ambianceType}}}
  User Activity: {{{userActivity}}}
  Timer Status: {{#if timerStatus}}{{{timerStatus}}}{{else}}inactive{{/if}}

  Based on the ambiance type, user activity, and timer status, describe how the audio loop should be adjusted to create a more personalized and immersive experience. Provide specific details on subtle changes to the audio elements.
  `,
});

const personalizedAmbianceFlow = ai.defineFlow(
  {
    name: 'personalizedAmbianceFlow',
    inputSchema: PersonalizedAmbianceInputSchema,
    outputSchema: PersonalizedAmbianceOutputSchema,
  },
  async input => {
    const {output} = await adjustAmbiancePrompt(input);
    return output!;
  }
);
