'use client'
import { useRef } from 'react'
import Image, { StaticImageData } from 'next/image'

export default function DetailCard({
  imgSrc,
  textContent,
  titleContent,
}: {
  imgSrc: StaticImageData
  textContent: string
  titleContent: string
}) {
  const tiltRef = useRef<HTMLDivElement>(null)
  const maxRotation = 15

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const tiltElement = tiltRef.current
    if (!tiltElement) return

    const rect = e.currentTarget.getBoundingClientRect()

    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    const halfWidth = rect.width / 2
    const halfHeight = rect.height / 2
    const percentX = (x - halfWidth) / halfWidth
    const percentY = (y - halfHeight) / halfHeight

    const rotateY = percentX * maxRotation
    const rotateX = -percentY * maxRotation

    tiltElement.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`
  }

  const handleMouseLeave = () => {
    if (tiltRef.current) {
      tiltRef.current.style.transform = 'rotateX(0deg) rotateY(0deg)'
    }
  }

  return (
    <aside
      className='
        relative 
        [perspective:1000px] 
        max-w-xl
        mt-2
        p-2
        mx-auto
      '
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div
        ref={tiltRef}
        className='
          flex
          flex-col
          items-center
          gap-2
          rounded-lg
          bg-green-100
          transition-transform 
          duration-300 
          ease-out 
          [transform-style:preserve-3d]
          p-2
          md:flex-row
        '
      >
        <Image
          src={imgSrc}
          height={120}
          width={120}
          alt=''
          className='border-r-green-500 rounded-lg'
        />
        <div className='text-black'>
          <h2>{titleContent}</h2>
          <p>{textContent}</p>
        </div>
      </div>
    </aside>
  )
}
