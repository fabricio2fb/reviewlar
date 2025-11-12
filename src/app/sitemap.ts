// app/sitemap.ts
// Sitemap automático usando as mesmas funções do seu review/[slug]/page.tsx

import { MetadataRoute } from 'next'

// Importe a função que você já usa para buscar reviews
// Você vai precisar criar uma nova função em @/lib/server-actions
// que retorna TODOS os reviews (não apenas por categoria)
import { getAllReviews } from '@/lib/server-actions'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://reviewlar.site'
  
  // Página principal
  const routes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
  ]

  try {
    // Busca todos os reviews usando sua função
    const reviews = await getAllReviews()
    
    // Adiciona cada review ao sitemap
    reviews.forEach((review) => {
      routes.push({
        url: `${baseUrl}/review/${review.slug}`,
        lastModified: review.updatedAt ? new Date(review.updatedAt) : new Date(),
        changeFrequency: 'monthly',
        priority: 0.8,
      })
    })

    // Se você tiver páginas de categorias, adicione também
    const categories = [...new Set(reviews.map(r => r.category))]
    categories.forEach((category) => {
      routes.push({
        url: `${baseUrl}/categoria/${category}`,
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
