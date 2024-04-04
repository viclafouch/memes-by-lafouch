export function extractTweetIdFromUrl(tweetUrl: string) {
  return tweetUrl.split('/').at(-1) as string
}
