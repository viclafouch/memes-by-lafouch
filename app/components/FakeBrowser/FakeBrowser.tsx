import React from 'react'
import {
  ArrowLeft,
  ArrowRight,
  ArrowsClockwise,
  Lock,
  TwitchLogo
} from '@phosphor-icons/react'

export type FakeBrowserProps = never

const FakeBrowser = () => {
  return (
    <div className="flex h-full w-full flex-col overflow-hidden rounded-lg border border-gray-700 shadow-xl lg:aspect-video lg:mask-hero lg:w-auto">
      <div className="flex flex-col bg-gray-850">
        <div className="flex px-1.5 w-full">
          <div className="flex items-center space-x-1 px-2.5">
            <div className="size-2.5 rounded-full bg-gray-600" />
            <div className="size-2.5 rounded-full bg-gray-600" />
            <div className="size-2.5 rounded-full bg-gray-600" />
          </div>
          <div className="flex flex-1 pt-1.5" role="tablist">
            <button
              className="flex items-center text-xs font-medium text-white py-2 px-3 sm:min-w-[10rem] rounded-t-md gap-x-2 hover:cursor-pointer hover:text-gray-400 bg-gray-800"
              role="tab"
              aria-selected="false"
              tabIndex={-1}
              type="button"
            >
              <TwitchLogo />
              <span className="truncate">ironmouse</span>
            </button>
            <button
              className="flex items-center text-xs font-medium text-gray-500 py-2 px-3 sm:min-w-[10rem] rounded-t-md gap-x-2 hover:cursor-pointer hover:text-gray-400"
              role="tab"
              aria-selected="false"
              tabIndex={-1}
              type="button"
            >
              <TwitchLogo />
              <span className="truncate">ironmouse</span>
            </button>
            <button
              className="flex items-center text-xs font-medium text-gray-500 py-2 px-3 sm:min-w-[10rem] rounded-t-md gap-x-2 hover:cursor-pointer hover:text-gray-400"
              id="headlessui-tabs-tab-4"
              role="tab"
              aria-selected="false"
              tabIndex={-1}
              type="button"
            >
              <TwitchLogo />
              <span className="truncate">ironmouse</span>
            </button>
          </div>
        </div>
      </div>
      <div
        className="flex flex-1 flex-col"
        id="headlessui-tabs-panel-6"
        role="tabpanel"
        aria-labelledby="headlessui-tabs-tab-3"
        tabIndex={0}
      >
        <div className="flex items-center space-x-1.5 border-b border-gray-700 bg-gray-800 py-1 px-1.5 sm:space-x-2.5 sm:py-1.5 sm:px-2">
          <ArrowLeft className="text-gray-600" />
          <ArrowRight className="text-gray-600" />
          <ArrowsClockwise className="text-gray-600" />
          <div className="flex flex-1 items-center rounded bg-gray-850 py-1 px-2 text-xs text-gray-400 sm:text-sm gap-x-1 bg-gray-800">
            <Lock />
            <span className="text-gray-300">www.twitch.tv/linustech</span>
          </div>
        </div>
        <div className="flex flex-1" aria-hidden="true">
          <div className="relative aspect-video flex-1 bg-gray-950 w-full">
            <video
              preload="auto"
              loop
              autoPlay
              muted
              controls
              playsInline
              className="absolute top-0 h-full w-full object-cover"
              src="https://res.cloudinary.com/dltusgxea/video/fetch/q_auto,f_auto/https://utfs.io/f/41ecf7ad-452e-4138-883a-28b1cb4da4e5-yuxvco.mp4"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default FakeBrowser
