// server-actions.ts
'use server'

import { createClient } from '@supabase/supabase-js'
import { revalidatePath } from 'next/cache'
import type { Review, Category } from './types'

// 🔐 client com service role (só no servidor)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // precisa dessa key no .env
)


// GET Reviews do banco de dados
export async function getReviews(): Promise<Review[]> {
  const { data, error } = await supabase
    .from('reviews')
    .select('*')
    .order('published_at', { ascending: false })

  if (error) {
    console.error('Error fetching reviews:', error)
    return []
  }

  return data.map(review => ({
    ...review,
    imageAspectRatio: review.image_aspect_ratio || 'square',
    technicalSpecs: review.technical_specs || {},
    scores: review.scores || {},
    pros: review.pros || [],
    cons: review.cons || [],
    images: review.images || [],
    offers: review.offers || [],
    priceRange: review.price_range,
    publishedAt: review.published_at,
    keywords: review.keywords || [],
    metaDescription: review.meta_description || null,
    faq: review.faq || [],
  })) as Review[]
}

// GET Review por ID
export async function getReviewById(id: string): Promise<Review | null> {
  const { data, error } = await supabase
    .from('reviews')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    console.error('Error fetching review:', error)
    return null
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
    keywords: data.keywords || [],
    metaDescription: data.meta_description || null,
    faq: data.faq || [],
  } as Review
}

// GET Review por Slug
export async function getReviewBySlug(slug: string): Promise<Review | null> {
  const { data, error } = await supabase
    .from('reviews')
    .select('*')
    .eq('slug', slug)
    .single()

  if (error) {
    console.error('Error fetching review:', error)
    return null
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
    keywords: data.keywords || [],
    metaDescription: data.meta_description || null,
    faq: data.faq || [],
  } as Review
}

// GET Reviews por Categoria
export async function getReviewsByCategory(categorySlug: string): Promise<Review[]> {
  const { data, error } = await supabase
    .from('reviews')
    .select('*')
    .eq('category', categorySlug)
    .order('published_at', { ascending: false })

  if (error) {
    console.error('Error fetching reviews by category:', error)
    return []
  }

  return data.map(review => ({
    ...review,
    imageAspectRatio: review.image_aspect_ratio || 'square',
    technicalSpecs: review.technical_specs || {},
    scores: review.scores || {},
    pros: review.pros || [],
    cons: review.cons || [],
    images: review.images || [],
    offers: review.offers || [],
    priceRange: review.price_range,
    publishedAt: review.published_at,
    keywords: review.keywords || [],
    metaDescription: review.meta_description || null,
    faq: review.faq || [],
  })) as Review[]
}

// GET Categorias
export async function getCategories(): Promise<Category[]> {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('name')

  if (error) {
    console.error('Error fetching categories:', error)
    return []
  }

  return data as Category[]
}

// GET Categoria por Slug
export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .eq('slug', slug)
    .single()

  if (error) {
    console.error('Error fetching category:', error)
    return null
  }

  return data as Category
}

// CREATE Review
export async function createReview(review: Review): Promise<Review> {
  const { id, ...reviewData } = review
  
  const { data, error } = await supabase
    .from('reviews')
    .insert([{
      slug: review.slug,
      title: review.title,
      category: review.category,
      rating: review.rating,
      image: review.image,
      images: review.images || [],
      image_aspect_ratio: review.imageAspectRatio,
      summary: review.summary,
      content: review.content,
      pros: review.pros || [],
      cons: review.cons || [],
      technical_specs: review.technicalSpecs || {},
      scores: review.scores || {},
      price_range: review.priceRange || null,
      offers: review.offers || [],
      published_at: review.publishedAt || new Date().toISOString(),
      // 🆕 Novos campos SEO
      keywords: review.keywords || [],
      meta_description: review.metaDescription || review.summary || null,
      faq: review.faq || [],
    }])
    .select()
    .single()

  if (error) {
    console.error('Error creating review:', error)
    throw new Error('Erro ao criar review: ' + error.message)
  }

  revalidatePath('/admin/dashboard')
  revalidatePath('/')
  
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
    keywords: data.keywords || [],
    metaDescription: data.meta_description || null,
    faq: data.faq || [],
  } as Review
}

// UPDATE Review
export async function updateReview(review: Review): Promise<Review> {
  const { data, error } = await supabase
    .from('reviews')
    .update({
      slug: review.slug,
      title: review.title,
      category: review.category,
      rating: review.rating,
      image: review.image,
      images: review.images || [],
      image_aspect_ratio: review.imageAspectRatio,
      summary: review.summary,
      content: review.content,
      pros: review.pros || [],
      cons: review.cons || [],
      technical_specs: review.technicalSpecs || {},
      scores: review.scores || {},
      price_range: review.priceRange || null,
      offers: review.offers || [],
      published_at: review.publishedAt,
      // 🆕 Novos campos SEO
      keywords: review.keywords || [],
      meta_description: review.metaDescription || review.summary || null,
      faq: review.faq || [],
    })
    .eq('id', review.id)
    .select()
    .single()

  if (error) {
    console.error('Error updating review:', error)
    throw new Error('Erro ao atualizar review: ' + error.message)
  }

  revalidatePath('/admin/dashboard')
  revalidatePath(`/review/${review.slug}`)
  revalidatePath(`/admin/reviews/${review.id}/edit`)
  
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
    keywords: data.keywords || [],
    metaDescription: data.meta_description || null,
    faq: data.faq || [],
  } as Review
}

// DELETE Review
export async function deleteReview(id: string): Promise<{ success: true }> {
  const { error } = await supabase
    .from('reviews')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Error deleting review:', error)
    throw new Error('Erro ao deletar review: ' + error.message)
  }

  revalidatePath('/admin/dashboard')
  revalidatePath('/')
  return { success: true }
}

// CREATE Category
export async function createCategory(category: Omit<Category, 'id' | 'created_at'>): Promise<Category> {
  const { data, error } = await supabase
    .from('categories')
    .insert([category])
    .select()
    .single()

  if (error) {
    console.error('Error creating category:', error)
    throw new Error('Erro ao criar categoria: ' + error.message)
  }

  revalidatePath('/admin/dashboard')
  return data as Category
}