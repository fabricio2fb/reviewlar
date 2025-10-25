'use server';

/**
 * @fileOverview This file defines a Genkit flow for suggesting pros and cons based on a review text.
 *
 * - suggestProsCons - A function that takes review text as input and returns suggested pros and cons.
 * - SuggestProsConsInput - The input type for the suggestProsCons function.
 * - SuggestProsConsOutput - The return type for the suggestProsCons function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestProsConsInputSchema = z.object({
  reviewText: z
    .string()
    .describe('The text of the review from which to extract pros and cons.'),
});
export type SuggestProsConsInput = z.infer<typeof SuggestProsConsInputSchema>;

const SuggestProsConsOutputSchema = z.object({
  pros: z.array(z.string()).describe('Suggested pros based on the review text.'),
  cons: z.array(z.string()).describe('Suggested cons based on the review text.'),
});
export type SuggestProsConsOutput = z.infer<typeof SuggestProsConsOutputSchema>;

export async function suggestProsCons(input: SuggestProsConsInput): Promise<SuggestProsConsOutput> {
  return suggestProsConsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestProsConsPrompt',
  input: {schema: SuggestProsConsInputSchema},
  output: {schema: SuggestProsConsOutputSchema},
  prompt: `You are an AI assistant helping a reviewer extract the pros and cons from a product review.

  Given the following review text, please identify and list the pros and cons.

  Review Text: {{{reviewText}}}

  Format your response as a JSON object with "pros" and "cons" fields, each containing a list of strings.
  `,
});

const suggestProsConsFlow = ai.defineFlow(
  {
    name: 'suggestProsConsFlow',
    inputSchema: SuggestProsConsInputSchema,
    outputSchema: SuggestProsConsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);