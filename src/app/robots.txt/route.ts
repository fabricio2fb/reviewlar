export function GET() {
  return new Response(
`User-agent: *
Allow: /

Sitemap: https://reviewlar.site/sitemap.xml
`,
    { headers: { "Content-Type": "text/plain" } }
  )
}
