import React from 'react'
import { motion } from 'framer-motion'
import { ChevronRight } from 'lucide-react'
import type { MemeWithBoomarked } from '@/@types/meme'
import { MemesList } from '@/components/Meme/memes-list'
import { Button } from '@/components/ui/button'
import { Link } from '@tanstack/react-router'

export const Demo = ({ memes }: { memes: MemeWithBoomarked[] }) => {
  return (
    <div className="container">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.6 }}
        className="flex flex-col gap-y-4 mt-12 container"
      >
        <div className="flex flex-col gap-1">
          <div className="flex items-center justify-between">
            <div className="text-left text-base font-medium">
              Uploadé par les utilisateurs
            </div>
            <Link
              className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-100 focus:text-gray-100"
              to="/library"
            >
              <span>Tout parcourir</span>
              <ChevronRight size={16} />
            </Link>
          </div>
          <p className="text-sm text-gray-500">
            Explore what the community is building with v0.
          </p>
        </div>
        <section className="flex flex-col items-center gap-y-12">
          <MemesList layoutContext="index" memes={memes} />
          <Button asChild variant="outline" size="lg">
            <Link to="/library">Voir tous les mèmes</Link>
          </Button>
        </section>
      </motion.div>
    </div>
  )
}
