// app/sitemap.ts
import { MetadataRoute } from 'next'
import { getReviews, getCategories } from '@/lib/server-actions'

export const revalidate = 3600 // Revalida a cada 1 hora

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://reviewlar.site'
  
  const routes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
  ]

  try {
    // Busca todos os reviews do Supabase
    const reviews = await getReviews()
    
    // Adiciona cada review ao sitemap
    reviews.forEach((review) => {
      routes.push({
        url: `${baseUrl}/review/${review.slug}`,
        lastModified: review.publishedAt ? new Date(review.publishedAt) : new Date(),
        changeFrequency: 'monthly',
        priority: 0.8,
      })
    })

    // Busca e adiciona páginas de categorias
    const categories = await getCategories()
    categories.forEach((category) => {
      routes.push({
        url: `${baseUrl}/categoria/${category.slug}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.7,
      })
    })

  } catch (error) {
    console.error('Erro ao gerar sitemap:', error)
  }

  return routes
}
