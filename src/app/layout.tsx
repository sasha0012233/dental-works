
// src/app/layout.tsx
import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'


const inter = Inter({ subsets: ['latin', 'cyrillic'] })

// Метаданные для SEO и PWA
export const metadata: Metadata = {
  title: 'DentalWorks - Управление клиникой',
  description: 'Система управления стоматологической клиникой для врачей',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'DentalWorks',
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: 'website',
    siteName: 'DentalWorks',
    title: 'DentalWorks - Управление клиникой',
    description: 'Система управления стоматологической клиникой для врачей',
  },
  twitter: {
    card: 'summary',
    title: 'DentalWorks - Управление клиникой',
    description: 'Система управления стоматологической клиникой для врачей',
  },
}

// Viewport настройки для мобильных устройств
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#2563eb',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ru" className="h-full">
      <head>
        {/* iOS метатеги */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="DentalWorks" />
        
        {/* Иконки для iOS */}
        <link rel="apple-touch-icon" href="/icons/icon-152x152.png" />
        <link rel="apple-touch-startup-image" href="/icons/icon-512x512.png" />
        
        {/* Предзагрузка шрифтов */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      </head>
      <body className={`${inter.className} h-full bg-gray-50`}>
        <div className="min-h-screen">
          {children}
        </div>
        
        {/* Компонент для установки PWA */}
        <PWAInstallPrompt />
      </body>
    </html>
  )
}

// Компонент предложения установки PWA
function PWAInstallPrompt() {
  return (
    <div id="pwa-install-prompt" className="hidden fixed bottom-4 left-4 right-4 bg-white p-4 rounded-lg shadow-lg border z-50">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <img src="/icons/icon-72x72.png" alt="DentalWorks" className="w-10 h-10" />
          <div>
            <p className="font-semibold text-gray-900">Установить DentalWorks</p>
            <p className="text-sm text-gray-600">Для быстрого доступа</p>
          </div>
        </div>
        <div className="flex space-x-2">
          <button 
            id="pwa-install-cancel"
            className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800"
          >
            Позже
          </button>
          <button 
            id="pwa-install-confirm"
            className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Установить
          </button>
        </div>
      </div>
    </div>
  )
}