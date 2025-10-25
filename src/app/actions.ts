'use server';

import { suggestProsCons } from "@/ai/flows/suggest-pros-cons";

export async function getAiSuggestions(reviewText: string) {
  try {
    if (reviewText.trim().length < 50) {
      return { pros: [], cons: [] };
    }
    const result = await suggestProsCons({ reviewText });
    return result;
  } catch (error) {
    console.error('Error fetching AI suggestions:', error);
    return { pros: [], cons: [], error: 'Failed to get suggestions.' };
  }
}