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
    // eslint-disable-next-line promise/prefer-await-to-then
    node.play().catch(() => {})
  }
}

export const stopOtherVideos = (node: HTMLVideoElement) => {
  const targetId = node.getAttribute('data-id')

  const allVideos = Array.from(
    document.querySelectorAll<HTMLVideoElement>('video')
  )

  for (const video of allVideos) {
    const id = video.getAttribute('data-id')

    if (targetId === id) {
      continue
    } else {
      stopVideo(video)
    }
  }
}
