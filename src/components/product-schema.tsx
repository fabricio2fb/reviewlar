interface ProductSchemaProps {
  name: string
  image: string
  description: string
  brand?: string
  sku?: string
  price?: number
  priceCurrency?: string
  availability?: 'InStock' | 'OutOfStock' | 'PreOrder'
  ratingValue: number
  reviewCount?: number
  url: string
}

export default function ProductSchema({
  name,
  image,
  description,
  brand,
  sku,
  price,
  priceCurrency = 'BRL',
  availability = 'InStock',
  ratingValue,
  reviewCount = 1,
  url,
}: ProductSchemaProps) {
  const schema = {
    '@context': 'https://schema.org/',
    '@type': 'Product',
    name,
    image,
    description,
    ...(brand && {
      brand: {
        '@type': 'Brand',
        name: brand,
      },
    }),
    ...(sku && { sku }),
    ...(price && {
      offers: {
        '@type': 'Offer',
        url,
        priceCurrency,
        price: price.toFixed(2),
        availability: `https://schema.org/${availability}`,
      },
    }),
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: ratingValue.toFixed(1),
      reviewCount,
    },
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}