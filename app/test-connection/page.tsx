'use client'

import { supabase } from '@/lib/supabase'
import { useEffect, useState } from 'react'

export default function TestConnection() {
  const [status, setStatus] = useState('🔄 Probando conexión...')
  const [professionals, setProfessionals] = useState<any[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    testConnection()
  }, [])

  async function testConnection() {
    try {
      // Probar conexión básica
      const { data, error } = await supabase
        .from('professionals')
        .select('*')
        .limit(5)

      if (error) {
        setStatus('❌ Error de conexión')
        setError(error.message)
        console.error('Supabase error:', error)
      } else {
        setStatus('✅ Conexión exitosa con Supabase')
        setProfessionals(data || [])
        setError(null)
      }
    } catch (err) {
      setStatus('❌ Error al conectar')
      setError(String(err))
      console.error('Connection error:', err)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 text-gray-900">
            🔌 Test de Conexión Supabase
          </h1>
          <p className="text-gray-600">
            Verificando la conexión con la base de datos...
          </p>
        </div>

        {/* Estado de conexión */}
        <div className="card mb-6">
          <div className="flex items-center gap-4">
            <div className="text-4xl">
              {status.includes('✅') ? '✅' : status.includes('❌') ? '❌' : '🔄'}
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-semibold mb-1">Estado de Conexión</h2>
              <p className="text-lg">{status}</p>
            </div>
          </div>
        </div>

        {/* Error details */}
        {error && (
          <div className="card mb-6 bg-red-50 border-2 border-red-200">
            <h2 className="text-xl font-semibold mb-2 text-red-700">
              Detalles del Error:
            </h2>
            <pre className="bg-red-100 p-4 rounded text-sm overflow-auto text-red-800">
              {error}
            </pre>
            <div className="mt-4 text-sm text-red-700">
              <p className="font-semibold mb-2">Posibles soluciones:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Verificá que las credenciales en .env.local sean correctas</li>
                <li>Asegurate que el proyecto de Supabase esté activo</li>
                <li>Verificá que las tablas se hayan creado correctamente</li>
              </ul>
            </div>
          </div>
        )}

        {/* Profesionales encontrados */}
        {professionals.length > 0 && (
          <div className="card mb-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-900">
              📊 Profesionales encontrados: {professionals.length}
            </h2>
            <div className="space-y-4">
              {professionals.map((prof, index) => (
                <div
                  key={prof.id || index}
                  className="bg-gray-50 p-4 rounded-lg border border-gray-200"
                >
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="font-semibold text-gray-700">Nombre:</span>
                      <p className="text-gray-900">{prof.name}</p>
                    </div>
                    <div>
                      <span className="font-semibold text-gray-700">Email:</span>
                      <p className="text-gray-900">{prof.email}</p>
                    </div>
                    <div>
                      <span className="font-semibold text-gray-700">Especialidad:</span>
                      <p className="text-gray-900">{prof.specialty}</p>
                    </div>
                    <div>
                      <span className="font-semibold text-gray-700">Slug:</span>
                      <p className="text-gray-900">{prof.slug}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Base de datos vacía pero conectada */}
        {professionals.length === 0 && status.includes('✅') && (
          <div className="card bg-blue-50 border-2 border-blue-200">
            <div className="flex items-start gap-3">
              <span className="text-3xl">ℹ️</span>
              <div>
                <h3 className="font-semibold text-blue-900 mb-2">
                  Base de datos vacía
                </h3>
                <p className="text-blue-800 mb-4">
                  La conexión con Supabase funciona correctamente, pero no hay
                  profesionales registrados todavía.
                </p>
                <div className="bg-white p-4 rounded border border-blue-200">
                  <p className="text-sm text-gray-700 mb-2 font-semibold">
                    Para insertar un profesional de prueba:
                  </p>
                  <ol className="list-decimal list-inside text-sm text-gray-700 space-y-1">
                    <li>Ve a Supabase → SQL Editor</li>
                    <li>Ejecuta el INSERT de ejemplo del PASO 8 de la guía</li>
                    <li>Recarga esta página</li>
                  </ol>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Información de configuración */}
        <div className="card mt-6 bg-gray-50">
          <h3 className="font-semibold text-gray-900 mb-3">
            📋 Información de Configuración
          </h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-semibold text-gray-700">Supabase URL:</span>
              <p className="text-gray-600 break-all">
                {process.env.NEXT_PUBLIC_SUPABASE_URL || '❌ No configurada'}
              </p>
            </div>
            <div>
              <span className="font-semibold text-gray-700">Anon Key:</span>
              <p className="text-gray-600">
                {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
                  ? '✅ Configurada'
                  : '❌ No configurada'}
              </p>
            </div>
          </div>
        </div>

        {/* Botón para volver al home */}
        <div className="mt-8 text-center">
          <a
            href="/"
            className="btn-primary inline-block"
          >
            ← Volver al inicio
          </a>
        </div>
      </div>
    </div>
  )
}
