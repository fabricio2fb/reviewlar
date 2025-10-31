'use server'

import { supabaseAdmin } from './supabase-server'

export type Review = {
  id?: string
  title: string
  rating: number
  category: string
  priceRange?: string
  image?: string
  imageAspectRatio?: 'square' | 'wide' | 'tall'
  technicalSpecs?: Record<string, string>
  scores?: Record<string, number>
  pros?: string[]
  cons?: string[]
  offers?: string[]
  images?: string[]
  publishedAt?: string
}

export async function createReview(review: Review): Promise<Review> {
  const { id, ...reviewData } = review

  const { data, error } = await supabaseAdmin
    .from('reviews')
    .insert([{
      ...reviewData,
      published_at: review.publishedAt || new Date().toISOString(),
    }])
    .select()
    .single()

  if (error) {
    console.error('Erro ao criar review:', error)
    throw new Error('Erro ao criar review: ' + error.message)
  }

  return {
    ...data,
    imageAspectRatio: data.image_aspect_ratio || 'square',
    technicalSpecs: data.technical_specs || {},
    scores: data.scores || {},
    pros: data.pros || [],
    cons: data.cons || [],
    images: data.images || [],
    offers: data.offers || [],
    priceRange: data.price_range,
    publishedAt: data.published_at,
  } as Review
}
