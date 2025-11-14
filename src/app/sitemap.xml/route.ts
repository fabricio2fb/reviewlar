import { getReviews, getCategories } from '@/lib/server-actions'

export async function GET() {
  const baseUrl = 'https://reviewlar.site'

  let xmlItems = `
    <url>
      <loc>${baseUrl}</loc>
      <lastmod>${new Date().toISOString()}</lastmod>
      <changefreq>daily</changefreq>
      <priority>1.0</priority>
    </url>
  `

  try {
    const reviews = await getReviews()

    reviews.forEach((review: any) => {
      xmlItems += `
        <url>
          <loc>${baseUrl}/review/${review.slug}</loc>
          <lastmod>${new Date(review.publishedAt || new Date()).toISOString()}</lastmod>
          <changefreq>monthly</changefreq>
          <priority>0.8</priority>
        </url>
      `
    })

    const categories = await getCategories()

    categories.forEach((category: any) => {
      xmlItems += `
        <url>
          <loc>${baseUrl}/categoria/${category.slug}</loc>
          <lastmod>${new Date().toISOString()}</lastmod>
          <changefreq>weekly</changefreq>
          <priority>0.7</priority>
        </url>
      `
    })

  } catch (err) {
    console.error('Erro ao gerar sitemap.xml:', err)
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    ${xmlItems}
  </urlset>`

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml",
    },
  })
}
