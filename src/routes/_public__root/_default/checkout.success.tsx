import React from 'react'
import { motion } from 'framer-motion'
import { buttonVariants } from '@/components/ui/button'
import {
  PageDescription,
  PageHeading
} from '@/routes/_public__root/-components/page-headers'
import { createFileRoute, Link } from '@tanstack/react-router'

const showCanvas = async (canvasElement: HTMLCanvasElement) => {
  // @ts-ignore
  const confetti = await import('canvas-confetti')
  const myConfetti = confetti.create(canvasElement, {
    resize: true,
    useWorker: true
  })

  myConfetti({
    particleCount: 100,
    spread: 160
  })
}

const RouteComponent = () => {
  const canvasRef = React.useRef<HTMLCanvasElement>(null)

  React.useEffect(() => {
    const canvas = canvasRef.current

    if (!canvas) {
      return
    }

    setTimeout(() => {
      showCanvas(canvas)
    }, 300)
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col gap-6 items-center pt-20"
    >
      <PageHeading>Félicitations !</PageHeading>
      <PageDescription>
        Merci pour ton soutien 🙏 <br />
        Ton achat est validé et ton compte a été mis à jour. Tu peux dès
        maintenant profiter de toutes tes fonctionnalités premium.
      </PageDescription>
      <Link
        className={buttonVariants({
          variant: 'defaultWithOutline',
          size: 'xl'
        })}
        to="/"
      >
        Retour à la page d&apos;accueil
      </Link>
      <canvas ref={canvasRef} className="fixed w-full h-full inset-0 -z-10" />
    </motion.div>
  )
}

export const Route = createFileRoute(
  '/_public__root/_default/checkout/success'
)({
  component: RouteComponent
})
