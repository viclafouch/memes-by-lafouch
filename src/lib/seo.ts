import type { MemeWithCategories, MemeWithVideo } from '@/constants/meme'
import { buildVideoImageUrl } from '@/lib/bunny'

export function seo({
  title,
  description,
  keywords,
  image
}: {
  title: string
  description?: string
  image?: string
  keywords?: string
}) {
  const tags = [
    { title },
    { name: 'description', content: description },
    { name: 'keywords', content: keywords },
    { name: 'author', content: 'Victor de la Fouchardière' },
    { name: 'twitter:title', content: title },
    { name: 'twitter:description', content: description },
    { name: 'twitter:creator', content: '@TrustedSheriff' },
    { name: 'twitter:site', content: '@TrustedSheriff' },
    { name: 'og:type', content: 'website' },
    { name: 'og:site_name', content: title },
    { name: 'og:title', content: title },
    { name: 'og:description', content: description },
    { name: 'og:url', content: 'https://memes-by-lafouch.vercel.app' },
    { name: 'og:locale', content: 'fr_FR' },
    ...(image
      ? [
          { name: 'twitter:image', content: image },
          { name: 'twitter:card', content: 'summary_large_image' },
          { name: 'og:image', content: image }
        ]
      : [])
  ]

  return tags
}

export const buildMemeSeo = (meme: MemeWithVideo & MemeWithCategories) => {
  const categoryKeywords = meme.categories.flatMap((category) => {
    return category.category.keywords
  })

  return seo({
    title: `Studio - ${meme.title}`,
    description: `Découvrez et partagez ce mème de "${meme.title}" avec tous vos proches. Meme Studio vous permet de rechercher, partager et découvrir des mèmes...`,
    keywords: [...meme.keywords, ...categoryKeywords].join(', '),
    image: buildVideoImageUrl(meme.video.bunnyId)
  })
}
