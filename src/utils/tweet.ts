import { getTweet } from 'react-tweet/api'
import { UTFile } from 'uploadthing/server'

export function extractTweetIdFromUrl(tweetUrl: string) {
  const url = new URL(tweetUrl)

  return url.searchParams.get('post_id') ?? url.pathname.split('/').at(-1)
}

// If too many rates limit, maybe try fallback on this one:
// https://pub.tweetbinder.com:51026/twitter/status/:tweetId
export async function getTweetById(tweetId: string) {
  const tweet = await getTweet(tweetId)

  if (!tweet || !tweet.video || tweet.video.variants.length === 0) {
    return Promise.reject(new Error('tweet invalid'))
  }

  const { poster } = tweet.video
  const video = tweet.video.variants.at(-1)!
  const videoUrl = video.src

  async function fetchBlob(...args: Parameters<typeof fetch>) {
    const response = await fetch(...args)

    return response.blob()
  }

  const [videoBlob, posterBlob] = await Promise.all([
    fetchBlob(videoUrl),
    fetchBlob(poster)
  ])

  const tweetUrl = `https://x.com/${tweet.user.screen_name}/status/${tweet.id_str}`

  return {
    url: tweetUrl,
    id: tweet.id_str,
    video: {
      url: video.src,
      blob: videoBlob,
      file: new UTFile([videoBlob], `${tweetId}.mp4`),
      poster: {
        url: poster,
        blob: posterBlob,
        file: new UTFile([posterBlob], `${tweetId}.jpeg`)
      }
    }
  }
}
