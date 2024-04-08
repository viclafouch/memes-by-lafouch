import React from 'react'
import dynamic from 'next/dynamic'

const ThemeSwitcher = dynamic(
  () => {
    return import('@/components/ThemeSwitcher')
  },
  { ssr: false }
)

const Footer = () => {
  return (
    <footer className="flex w-full flex-col">
      <div className="w-full px-6 py-8 md:flex md:items-center md:justify-between lg:px-8 bg-gray-900 text-white">
        <div className="flex flex-col items-center justify-center gap-2 md:order-2 md:items-end">
          <ThemeSwitcher />
        </div>
        <div className="mt-4 md:order-1 md:mt-0">
          <div className="flex items-center justify-center gap-3 md:justify-start">
            <div className="flex items-center">Viclafouch memes</div>
          </div>
          <p className="text-center text-tiny text-default-400 md:text-start">
            &copy; {new Date().getFullYear()} Victor de la Fouchardière. Tous
            droits réservés.
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
