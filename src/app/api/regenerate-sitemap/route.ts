// app/api/regenerate-sitemap/route.ts
// API que regenera o sitemap automaticamente

import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { writeFile } from 'fs/promises'
import path from 'path'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: Request) {
  try {
    // Verifica autenticação (opcional, mas recomendado)
    const { authorization } = Object.fromEntries(request.headers)
    
    // Se quiser proteger, descomente:
    // if (authorization !== `Bearer ${process.env.SITEMAP_SECRET_KEY}`) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    // }

    const baseUrl = 'https://reviewlar.site'
    
    console.log('🔍 Regenerando sitemap...')
    
    // Busca reviews
    const { data: reviews, error: reviewsError } = await supabase
      .from('reviews')
      .select('slug, published_at')
      .order('published_at', { ascending: false })

    if (reviewsError) throw reviewsError

    // Busca categorias
    const { data: categories, error: categoriesError } = await supabase
      .from('categories')
      .select('slug')
      .order('name')

    if (categoriesError) throw categoriesError

    // Gera XML
    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n'
    xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'

    // Página principal
    xml += '  <url>\n'
    xml += `    <loc>${baseUrl}</loc>\n`
    xml += `    <lastmod>${new Date().toISOString()}</lastmod>\n`
    xml += '    <changefreq>daily</changefreq>\n'
    xml += '    <priority>1.0</priority>\n'
    xml += '  </url>\n'

    // Reviews
    reviews?.forEach(review => {
      xml += '  <url>\n'
      xml += `    <loc>${baseUrl}/review/${review.slug}</loc>\n`
      xml += `    <lastmod>${new Date(review.published_at).toISOString()}</lastmod>\n`
      xml += '    <changefreq>monthly</changefreq>\n'
      xml += '    <priority>0.8</priority>\n'
      xml += '  </url>\n'
    })

    // Categorias
    categories?.forEach(category => {
      xml += '  <url>\n'
      xml += `    <loc>${baseUrl}/categoria/${category.slug}</loc>\n`
      xml += `    <lastmod>${new Date().toISOString()}</lastmod>\n`
      xml += '    <changefreq>weekly</changefreq>\n'
      xml += '    <priority>0.7</priority>\n'
      xml += '  </url>\n'
    })

    xml += '</urlset>'

    // Salva arquivo
    const publicDir = path.join(process.cwd(), 'public')
    const sitemapPath = path.join(publicDir, 'sitemap.xml')
    
    await writeFile(sitemapPath, xml, 'utf8')

    console.log('✅ Sitemap regenerado!')
    console.log(`📊 Total: ${(reviews?.length || 0) + (categories?.length || 0) + 1} URLs`)

    return NextResponse.json({ 
      success: true, 
      totalUrls: (reviews?.length || 0) + (categories?.length || 0) + 1,
      message: 'Sitemap regenerado com sucesso!'
    })

  } catch (error) {
    console.error('❌ Erro ao regenerar sitemap:', error)
    return NextResponse.json(
      { error: 'Erro ao regenerar sitemap' }, 
      { status: 500 }
    )
  }
}

// Permite GET também para testar manualmente
export async function GET() {
  return POST(new Request('http://localhost'))
}
