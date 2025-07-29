interface PlayerEventData {
  seconds: number
  duration: number
}

interface Player {
  on(
    event: 'ready' | 'timeupdate' | string,
    callback: (data: PlayerEventData) => void
  ): void
  off(event: 'ready' | 'timeupdate' | string): void
  play: () => void
}

declare global {
  interface Window {
    playerjs: {
      Player: new (node: HTMLIFrameElement | HTMLVideoElement | null) => Player
    }
  }
}

export {}
