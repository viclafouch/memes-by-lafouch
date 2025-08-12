import React from 'react'

export const AnimatedBanner = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <style>{`
        :root {
          --fd-banner-height: 3rem;
        }

        @keyframes fd-moving-banner {
          from { background-position: 0% 0; }
          to { background-position: 100% 0; }
        }
      `}</style>
      <div
        className="sticky top-0 z-40 flex flex-row items-center justify-center px-4 text-center text-sm font-medium bg-fd-background"
        style={{ height: '3rem' }}
      >
        <div
          className="absolute inset-0 z-[-1]"
          style={
            {
              maskImage:
                'linear-gradient(white, transparent), radial-gradient(circle at center top, white, transparent)',
              maskComposite: 'intersect',
              animation:
                '16s linear 0s infinite reverse none running fd-moving-banner',
              '--start': 'rgba(0,87,255,0.5)',
              '--mid': 'rgba(255,0,166,0.77)',
              '--end': 'rgba(255,77,0,0.4)',
              '--via': 'rgba(164,255,68,0.4)',
              backgroundImage:
                'repeating-linear-gradient(60deg, var(--end), var(--start) 2%, var(--start) 5%, transparent 8%, transparent 14%, var(--via) 18%, var(--via) 22%, var(--mid) 28%, var(--mid) 30%, var(--via) 34%, var(--via) 36%, transparent, var(--end) calc(50% - 12px))',
              backgroundSize: '200% 100%',
              mixBlendMode: 'difference'
            } as React.CSSProperties
          }
        />

        <div
          className="absolute inset-0 z-[-1]"
          style={
            {
              maskImage:
                'linear-gradient(white, transparent), radial-gradient(circle at center top, white, transparent)',
              maskComposite: 'intersect',
              animation:
                '20s linear 0s infinite normal none running fd-moving-banner',
              '--start': 'rgba(255,120,120,0.5)',
              '--mid': 'rgba(36,188,255,0.4)',
              '--end': 'rgba(64,0,255,0.51)',
              '--via': 'rgba(255,89,0,0.56)',
              backgroundImage:
                'repeating-linear-gradient(45deg, var(--end), var(--start) 4%, var(--start) 8%, transparent 9%, transparent 14%, var(--mid) 16%, var(--mid) 20%, transparent, var(--via) 36%, var(--via) 40%, transparent 42%, var(--end) 46%, var(--end) calc(50% - 16.8px))',
              backgroundSize: '200% 100%',
              mixBlendMode: 'color-dodge'
            } as React.CSSProperties
          }
        />
        {children}
      </div>
    </>
  )
}
