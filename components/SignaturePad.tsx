 'use client'
 
 import { useEffect, useMemo, useRef, useState } from 'react'
 
 type Point = { x: number; y: number }
 
 export default function SignaturePad({
   value,
   onChange,
   height = 160,
   className = '',
 }: {
   value: string
   onChange: (dataUrl: string) => void
   height?: number
   className?: string
 }) {
   const wrapRef = useRef<HTMLDivElement | null>(null)
   const canvasRef = useRef<HTMLCanvasElement | null>(null)
   const drawingRef = useRef(false)
   const lastRef = useRef<Point | null>(null)
   const [ready, setReady] = useState(false)
 
   const dpr = useMemo(() => (typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1), [])
 
   const getCtx = () => {
     const canvas = canvasRef.current
     if (!canvas) return null
     const ctx = canvas.getContext('2d')
     if (!ctx) return null
     return ctx
   }
 
   const resize = () => {
     const canvas = canvasRef.current
     const wrap = wrapRef.current
     if (!canvas || !wrap) return
 
     const rect = wrap.getBoundingClientRect()
     const cssW = Math.max(1, Math.floor(rect.width))
     const cssH = Math.max(1, Math.floor(height))
 
     // preserve existing drawing by snapshotting to dataURL before resize
     const prevUrl = canvas.toDataURL('image/png')
 
     canvas.style.width = `${cssW}px`
     canvas.style.height = `${cssH}px`
     canvas.width = Math.floor(cssW * dpr)
     canvas.height = Math.floor(cssH * dpr)
 
     const ctx = getCtx()
     if (!ctx) return
     ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
     ctx.lineCap = 'round'
     ctx.lineJoin = 'round'
     ctx.lineWidth = 2.2
     ctx.strokeStyle = '#0f172a'
     ctx.fillStyle = '#ffffff'
     ctx.fillRect(0, 0, cssW, cssH)
 
     // redraw previous snapshot
     if (prevUrl && prevUrl !== 'data:,') {
       const img = new Image()
       img.onload = () => {
         ctx.drawImage(img, 0, 0, cssW, cssH)
       }
       img.src = prevUrl
     }
   }
 
   const isBlank = () => {
     const canvas = canvasRef.current
     if (!canvas) return true
     const ctx = canvas.getContext('2d')
     if (!ctx) return true
     const { width, height } = canvas
     const img = ctx.getImageData(0, 0, width, height).data
     // sample alpha channel sparsely
     for (let i = 3; i < img.length; i += 4 * 32) {
       if (img[i] !== 255) return false // background is opaque white; any non-white alpha shouldn't happen
     }
     // check for any non-white pixel (RGB not all 255)
     for (let i = 0; i < img.length; i += 4 * 32) {
       const r = img[i]
       const g = img[i + 1]
       const b = img[i + 2]
       if (r !== 255 || g !== 255 || b !== 255) return false
     }
     return true
   }
 
   const commit = () => {
     const canvas = canvasRef.current
     if (!canvas) return
     const url = canvas.toDataURL('image/png')
     // treat blank as empty string
     if (isBlank()) {
       onChange('')
     } else {
       onChange(url)
     }
   }
 
   const getPos = (e: PointerEvent) => {
     const canvas = canvasRef.current
     if (!canvas) return null
     const rect = canvas.getBoundingClientRect()
     const x = e.clientX - rect.left
     const y = e.clientY - rect.top
     return { x, y }
   }
 
   const drawLine = (from: Point, to: Point) => {
     const ctx = getCtx()
     if (!ctx) return
     ctx.beginPath()
     ctx.moveTo(from.x, from.y)
     ctx.lineTo(to.x, to.y)
     ctx.stroke()
   }
 
   useEffect(() => {
     resize()
     setReady(true)
 
     const wrap = wrapRef.current
     if (!wrap) return
     const ro = new ResizeObserver(() => resize())
     ro.observe(wrap)
     return () => ro.disconnect()
     // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [])
 
   // sync external value -> canvas
   useEffect(() => {
     if (!ready) return
     const canvas = canvasRef.current
     const ctx = getCtx()
     if (!canvas || !ctx) return
     const rect = canvas.getBoundingClientRect()
     const cssW = Math.max(1, Math.floor(rect.width))
     const cssH = Math.max(1, Math.floor(rect.height))
 
     // clear to white
     ctx.fillStyle = '#ffffff'
     ctx.fillRect(0, 0, cssW, cssH)
 
     if (!value) return
     const img = new Image()
     img.onload = () => {
       ctx.drawImage(img, 0, 0, cssW, cssH)
     }
     img.src = value
   }, [value, ready])
 
   useEffect(() => {
     const canvas = canvasRef.current
     if (!canvas) return
 
     const onDown = (e: PointerEvent) => {
       // allow mouse/touch/pen
       if (e.button !== undefined && e.button !== 0) return
       const p = getPos(e)
       if (!p) return
       drawingRef.current = true
       lastRef.current = p
       canvas.setPointerCapture?.(e.pointerId)
       e.preventDefault()
     }
 
     const onMove = (e: PointerEvent) => {
       if (!drawingRef.current) return
       const p = getPos(e)
       const last = lastRef.current
       if (!p || !last) return
       drawLine(last, p)
       lastRef.current = p
       e.preventDefault()
     }
 
     const onUp = (e: PointerEvent) => {
       if (!drawingRef.current) return
       drawingRef.current = false
       lastRef.current = null
       e.preventDefault()
       commit()
     }
 
     canvas.addEventListener('pointerdown', onDown, { passive: false })
     canvas.addEventListener('pointermove', onMove, { passive: false })
     canvas.addEventListener('pointerup', onUp, { passive: false })
     canvas.addEventListener('pointercancel', onUp, { passive: false })
     return () => {
       canvas.removeEventListener('pointerdown', onDown as any)
       canvas.removeEventListener('pointermove', onMove as any)
       canvas.removeEventListener('pointerup', onUp as any)
       canvas.removeEventListener('pointercancel', onUp as any)
     }
     // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [])
 
   return (
     <div ref={wrapRef} className={className}>
       <canvas
         ref={canvasRef}
         className="w-full rounded-lg border border-gray-300 bg-white"
         style={{
           height,
           touchAction: 'none',
           cursor: 'crosshair',
         }}
       />
     </div>
   )
 }

