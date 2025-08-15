export function matchIsVideoElement(node: Element): node is HTMLVideoElement {
  return node instanceof HTMLVideoElement
}

export function stopVideo(node: Element) {
  if (matchIsVideoElement(node)) {
    node.pause()
  }
}

export function playVideo(node: Element) {
  if (matchIsVideoElement(node)) {
    node.currentTime = 0
    node.play().catch(() => {})
  }
}

export const stopOtherVideos = (node: HTMLVideoElement) => {
  const allVideos = Array.from(
    document.querySelectorAll<HTMLVideoElement>('video')
  )

  for (const video of allVideos) {
    if (video === node) {
      continue
    } else {
      stopVideo(video)
    }
  }
}
