
   // src/app/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../lib/supabase'
import Navigation from '../components/Navigation'
import WeeklyCalendar from '../components/WeeklyCalendar'
import LoginForm from '../components/LoginForm'

interface Appointment {
  id: string
  patient_id: string
  scheduled_date: string
  duration: number
  status: string
  treatment_type: string | null
  patient: {
    first_name: string
    last_name: string
    phone: string
  }
}

export default function Home() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    patientsCount: 0,
    appointmentsToday: 0,
    upcomingAppointments: 0
  })
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null)
  const router = useRouter()

  // Проверка авторизации
  useEffect(() => {
    console.log('🔍 Начало проверки авторизации...')
    
    const checkAuth = async () => {
      try {
        console.log('🔄 Получение сессии...')
        const { data: { session }, error } = await supabase.auth.getSession()
        
        if (error) {
          console.error('❌ Ошибка получения сессии:', error)
          return
        }
        
        console.log('📋 Сессия:', session)
        console.log('👤 Пользователь из сессии:', session?.user)
        
        if (session) {
          setUser(session.user)
          console.log('✅ Пользователь установлен:', session.user.email)
        } else {
          console.log('❌ Сессия не найдена')
          setUser(null)
        }
      } catch (error) {
        console.error('💥 Критическая ошибка проверки авторизации:', error)
      } finally {
        setLoading(false)
        console.log('🏁 Загрузка завершена')
      }
    }
    checkAuth()
    

    

    // Слушаем изменения авторизации
    const cancelLogout = () => {
    setShowLogoutConfirm(false)
  }
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        
          if (session) {
            setUser(session.user)
            await fetchStats()
          } else {
            setUser(null)
            setLoading(false)
          }
        
      }
    )

    return () => {
      
      subscription.unsubscribe()
    }
  }, [])
  

  const fetchStats = async () => {
    try {
      // Количество пациентов
      const { count: patientsCount } = await supabase
        .from('patients')
        .select('*', { count: 'exact', head: true })

      // Записи на сегодня
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      const tomorrow = new Date(today)
      tomorrow.setDate(tomorrow.getDate() + 1)

      const { count: appointmentsToday } = await supabase
        .from('appointments')
        .select('*', { count: 'exact', head: true })
        .gte('scheduled_date', today.toISOString())
        .lt('scheduled_date', tomorrow.toISOString())

      // Предстоящие записи (следующие 7 дней)
      const nextWeek = new Date(today)
      nextWeek.setDate(nextWeek.getDate() + 7)

      

      const { count: upcomingAppointments } = await supabase
        .from('appointments')
        .select('*', { count: 'exact', head: true })
        .gte('scheduled_date', tomorrow.toISOString())
        .lt('scheduled_date', nextWeek.toISOString())
      

      setStats({
        patientsCount: patientsCount || 0,
        appointmentsToday: appointmentsToday || 0,
        upcomingAppointments: upcomingAppointments || 0
      })
    } catch (error) {
      console.error('Ошибка загрузки статистики:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAppointmentClick = (appointment: Appointment) => {
    setSelectedAppointment(appointment)
    console.log('Выбрана запись:', appointment)
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    // Принудительно обновляем страницу после выхода
    window.location.href = '/'
  }

  // Показываем загрузку
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-xl">Загрузка...</div>
      </div>
    )
  }

  // Если пользователь не авторизован, показываем форму входа
  if (!user) {
    return <LoginForm />
  }
  {/* Модальное окно подтверждения выхода */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex items-center mb-4">
              <div className="flex-shrink-0">
                <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-lg font-medium text-gray-900">Подтверждение выхода</h3>
              </div>
            </div>
            
            
             
                
          </div>
        </div>
      )}

  // Остальной код главной страницы остается без изменений...
  return (
    <div>
      <Navigation onLogout={handleLogout} user={user} />
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Приветствие */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">
              Добро пожаловать, {user.email}!
            </h1>
            <p className="text-gray-600">DentalWorks - система управления стоматологической клиникой</p>
          </div>

          {/* Статистика */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <div className="text-sm font-medium text-gray-500 truncate">
                  Всего пациентов
                </div>
                <div className="mt-1 text-3xl font-semibold text-gray-900">
                  {stats.patientsCount}
                </div>
              </div>
            </div>
            
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <div className="text-sm font-medium text-gray-500 truncate">
                  Записи на сегодня
                </div>
                <div className="mt-1 text-3xl font-semibold text-gray-900">
                  {stats.appointmentsToday}
                </div>
              </div>
            </div>
            
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <div className="text-sm font-medium text-gray-500 truncate">
                  Записи на неделю
                </div>
                <div className="mt-1 text-3xl font-semibold text-gray-900">
                  {stats.upcomingAppointments}
                </div>
              </div>
            </div>
          </div>

          {/* Календарь и боковая панель */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Календарь - занимает 2/3 ширины */}
            <div className="lg:col-span-2">
              <WeeklyCalendar onAppointmentClick={handleAppointmentClick} />
            </div>

            {/* Боковая панель с быстрыми действиями */}
            <div className="space-y-6">
              {/* Быстрые действия */}
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Быстрые действия
                </h3>
                <div className="space-y-3">
                  <a
                    href="/patients"
                    className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                    </svg>
                    Управление пациентами
                  </a>
                  <a
                    href="/schedule"
                    className="w-full bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    Расписание записей
                  </a>
                </div>
              </div>

              {/* Быстрая статистика */}
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Быстрый обзор
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Пациентов сегодня:</span>
                    <span className="text-sm font-medium text-gray-900">
                      {Math.min(stats.appointmentsToday, stats.patientsCount)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Свободных окон:</span>
                    <span className="text-sm font-medium text-green-600">8</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Активных записей:</span>
                    <span className="text-sm font-medium text-blue-600">
                      {stats.upcomingAppointments}
                    </span>
                  </div>
                </div>
              </div>

              {/* Выбранная запись (если есть) */}
              {selectedAppointment && (
                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    Выбранная запись
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="font-medium">Пациент:</span>{' '}
                      {selectedAppointment.patient.first_name} {selectedAppointment.patient.last_name}
                    </div>
                    <div>
                      <span className="font-medium">Время:</span>{' '}
                      {new Date(selectedAppointment.scheduled_date).toLocaleString('ru-RU')}
                    </div>
                    <div>
                      <span className="font-medium">Тип:</span>{' '}
                      {selectedAppointment.treatment_type || 'Консультация'}
                    </div>
                    <div>
                      <span className="font-medium">Статус:</span>{' '}
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        selectedAppointment.status === 'scheduled' ? 'bg-blue-100 text-blue-800' :
                        selectedAppointment.status === 'completed' ? 'bg-green-100 text-green-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {selectedAppointment.status === 'scheduled' ? 'Запланирована' :
                         selectedAppointment.status === 'completed' ? 'Завершена' : 'Отменена'}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}