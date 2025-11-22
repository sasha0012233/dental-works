// components/LoginForm.tsx
'use client'

import { useState } from 'react'
import { supabase } from '../lib/supabase'

export default function LoginForm() {
  const [email, setEmail] = useState('test@example.com')
  const [password, setPassword] = useState('test123456')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    console.log('🔐 Попытка входа с:', { email, password })

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      })

      console.log('📋 Ответ от Supabase:', { data, error })

      if (error) {
        setMessage(`Ошибка входа: ${error.message}`)
        console.error('❌ Детали ошибки:', error)
      } else {
        setMessage('✅ Успешный вход! Перенаправление...')
        console.log('✅ Данные пользователя:', data.user)
        console.log('✅ Сессия:', data.session)
        
        // Даем время для обработки сессии
        setTimeout(() => {
          window.location.reload()
        }, 1000)
      }
    } catch (error: any) {
      setMessage(`💥 Неожиданная ошибка: ${error.message}`)
      console.error('💥 Полная ошибка:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    try {
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
      })

      if (error) {
        setMessage(`Ошибка регистрации: ${error.message}`)
      } else if (data.user) {
        setMessage('Регистрация успешна! Проверьте вашу почту для подтверждения.')
      }
    } catch (error: any) {
      setMessage(`Неожиданная ошибка при регистрации: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Вход в DentalWorks
          </h2>
        </div>
        
        <div className="mt-8 space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="mt-1 relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Email адрес"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Пароль
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className="mt-1 relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Пароль"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="flex gap-4">
            <button
              onClick={handleLogin}
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              {loading ? 'Вход...' : 'Войти'}
            </button>
            <button
              onClick={handleSignUp}
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-indigo-600 bg-white border-indigo-600 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              Регистрация
            </button>
          </div>

          {message && (
            <div className={`p-3 rounded text-center ${
              message.includes('Ошибка') || message.includes('ошибка') 
                ? 'bg-red-100 text-red-700 border border-red-300' 
                : 'bg-green-100 text-green-700 border border-green-300'
            }`}>
              {message}
            </div>
          )}

          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <h3 className="text-sm font-medium text-blue-800 mb-2">Тестовые данные:</h3>
            <p className="text-sm text-blue-700">
              <strong>Email:</strong> test@example.com<br/>
              <strong>Пароль:</strong> test123456
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}