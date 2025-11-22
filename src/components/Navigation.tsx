// src/components/Navigation.tsx
'use client'
interface NavigationProps {
  user: any
  onLogout: () => void
}
import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'



const navigation = [
  { name: 'Главная', href: '/', icon: '🏠' },
  { name: 'Пациенты', href: '/patients', icon: '👥' },
  { name: 'Расписание', href: '/schedule', icon: '📅' },
]

export default function Navigation({ user, onLogout }: NavigationProps) {
  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Логотип и название */}
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <svg className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <h1 className="ml-2 text-xl font-bold text-gray-900">DentalWorks</h1>
            </div>
            
            {/* Навигационные ссылки */}
            <div className="hidden md:ml-6 md:flex md:space-x-4">
              <a
                href="/patients"
                className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Пациенты
              </a>
              <a
                href="/schedule"
                className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Расписание
              </a>
              <a
                href="/appointments"
                className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Записи
              </a>
            </div>
          </div>

          {/* Правая часть - пользователь и выход */}
          <div className="flex items-center space-x-4">
            <div className="flex flex-col items-end">
              <span className="text-sm font-medium text-gray-900">
                {user?.email?.split('@')[0]} {/* Показываем только имя до @ */}
              </span>
              <span className="text-xs text-gray-500">
                {user?.email}
              </span>
            </div>
            
            <div className="relative group">
              <button
                onClick={onLogout}
                className="flex items-center space-x-2 bg-red-50 text-red-700 hover:bg-red-100 px-4 py-2 rounded-lg border border-red-200 transition-colors group-hover:border-red-300"
                title="Выйти из системы"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                <span className="hidden sm:block">Выйти</span>
              </button>
              
              {/* Подсказка при наведении */}
              <div className="absolute right-0 top-full mt-2 hidden group-hover:block bg-gray-900 text-white text-xs rounded py-1 px-2 whitespace-nowrap">
                Выйти из системы
              </div>
            </div>
          </div>
        </div>

        {/* Мобильное меню */}
        <div className="md:hidden border-t border-gray-200 mt-2 pt-2">
          <div className="flex space-x-4">
            <a
              href="/patients"
              className="text-gray-700 hover:text-blue-600 px-2 py-1 rounded text-sm font-medium"
            >
              Пациенты
            </a>
            <a
              href="/schedule"
              className="text-gray-700 hover:text-blue-600 px-2 py-1 rounded text-sm font-medium"
            >
              Расписание
            </a>
            <a
              href="/appointments"
              className="text-gray-700 hover:text-blue-600 px-2 py-1 rounded text-sm font-medium"
            >
              Записи
            </a>
          </div>
        </div>
      </div>
    </nav>
  )
}