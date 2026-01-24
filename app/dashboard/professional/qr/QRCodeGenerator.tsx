'use client'

import { useRef, useState } from 'react'
import { QRCodeSVG } from 'qrcode.react'

type QRCodeGeneratorProps = {
  registrationUrl: string
  professionalName: string
}

export default function QRCodeGenerator({
  registrationUrl,
  professionalName,
}: QRCodeGeneratorProps) {
  const qrRef = useRef<HTMLDivElement>(null)
  const [copied, setCopied] = useState(false)

  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(registrationUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error('Error copying to clipboard:', error)
      alert('Error al copiar el link')
    }
  }

  const handleDownloadQR = () => {
    if (!qrRef.current) return

    try {
      const svg = qrRef.current.querySelector('svg')
      if (!svg) return

      // Convertir SVG a canvas
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      if (!ctx) return

      // Tamaño del QR
      const size = 512
      canvas.width = size
      canvas.height = size

      // Fondo blanco
      ctx.fillStyle = 'white'
      ctx.fillRect(0, 0, size, size)

      // Convertir SVG a imagen
      const svgData = new XMLSerializer().serializeToString(svg)
      const img = new Image()
      const svgBlob = new Blob([svgData], {
        type: 'image/svg+xml;charset=utf-8',
      })
      const url = URL.createObjectURL(svgBlob)

      img.onload = () => {
        ctx.drawImage(img, 0, 0, size, size)
        URL.revokeObjectURL(url)

        // Descargar
        canvas.toBlob((blob) => {
          if (!blob) return
          const downloadUrl = URL.createObjectURL(blob)
          const link = document.createElement('a')
          link.href = downloadUrl
          link.download = `qr-${professionalName.toLowerCase().replace(/\s+/g, '-')}.png`
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link)
          URL.revokeObjectURL(downloadUrl)
        })
      }

      img.src = url
    } catch (error) {
      console.error('Error downloading QR:', error)
      alert('Error al descargar el QR')
    }
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Registro - ${professionalName}`,
          text: `Registrate como paciente de ${professionalName}`,
          url: registrationUrl,
        })
      } catch (error) {
        console.error('Error sharing:', error)
      }
    } else {
      // Fallback: copiar al portapapeles
      handleCopyUrl()
    }
  }

  return (
    <div className="bg-white rounded-lg shadow">
      {/* QR Code */}
      <div className="p-8 border-b border-gray-200">
        <div className="flex flex-col md:flex-row items-center gap-8">
          {/* QR */}
          <div
            ref={qrRef}
            className="flex-shrink-0 p-6 bg-white border-4 border-gray-200 rounded-lg"
          >
            <QRCodeSVG
              value={registrationUrl}
              size={256}
              level="H"
              includeMargin={false}
            />
          </div>

          {/* Información */}
          <div className="flex-1 space-y-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {professionalName}
              </h2>
              <p className="text-gray-600">
                Los pacientes que escaneen este QR serán dirigidos a tu página de registro
              </p>
            </div>

            {/* URL */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Link de registro:
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={registrationUrl}
                  readOnly
                  className="flex-1 px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg text-sm"
                />
                <button
                  onClick={handleCopyUrl}
                  className="px-4 py-2 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors"
                >
                  {copied ? '✓ Copiado' : 'Copiar'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Acciones */}
      <div className="p-6 bg-gray-50">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={handleDownloadQR}
            className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
              />
            </svg>
            Descargar QR
          </button>

          <button
            onClick={handleCopyUrl}
            className="px-6 py-3 bg-gray-600 text-white font-medium rounded-lg hover:bg-gray-700 transition-colors flex items-center justify-center gap-2"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
              />
            </svg>
            {copied ? 'Link Copiado' : 'Copiar Link'}
          </button>

          <button
            onClick={handleShare}
            className="px-6 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
              />
            </svg>
            Compartir
          </button>
        </div>
      </div>

      {/* Sugerencias de uso */}
      <div className="p-6 border-t border-gray-200">
        <h3 className="font-semibold text-gray-900 mb-3">
          Ideas para compartir tu QR:
        </h3>
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-gray-700">
          <li className="flex items-start gap-2">
            <span className="text-blue-600">📱</span>
            <span>Compartir por WhatsApp a tus pacientes actuales</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-600">📧</span>
            <span>Incluir en tu firma de email</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-600">🖼️</span>
            <span>Imprimir y pegar en la recepción de tu consultorio</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-600">📱</span>
            <span>Publicar en tus redes sociales (Instagram, Facebook)</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-600">📄</span>
            <span>Incluir en tarjetas personales</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-600">🌐</span>
            <span>Agregar a tu página web</span>
          </li>
        </ul>
      </div>
    </div>
  )
}
