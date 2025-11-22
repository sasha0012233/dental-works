// src/app/patients/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import Navigation from '../../components/Navigation'
import AddPatientModal from '../../components/AddPatientModal'
import EditPatientModal from '../../components/EditPatientModal'

interface Patient {
  id: string
  first_name: string
  last_name: string
  phone: string
  email: string | null
  birth_date: string | null
  medical_notes: string | null
}

export default function PatientsPage() {
  const [patients, setPatients] = useState<Patient[]>([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    fetchPatients()
  }, [])

  const fetchPatients = async () => {
    const { data, error } = await supabase
      .from('patients')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching patients:', error)
    } else {
      setPatients(data || [])
    }
    setLoading(false)
  }

  const handlePatientAdded = () => {
    fetchPatients()
  }

  const handleEditClick = (patient: Patient) => {
    setSelectedPatient(patient)
    setIsEditModalOpen(true)
  }

  const handlePatientUpdated = () => {
    fetchPatients()
    setIsEditModalOpen(false)
    setSelectedPatient(null)
  }

  // Функция для фильтрации пациентов по поисковому запросу
  const filteredPatients = patients.filter(patient => {
    const searchLower = searchTerm.toLowerCase()
    
    const firstNameMatch = patient.first_name.toLowerCase().includes(searchLower)
    const lastNameMatch = patient.last_name.toLowerCase().includes(searchLower)
    const phoneMatch = patient.phone.includes(searchTerm)
    const emailMatch = patient.email ? patient.email.toLowerCase().includes(searchLower) : false
    
    return firstNameMatch || lastNameMatch || phoneMatch || emailMatch
  })

  if (loading) {
    return (
      <div>
        <Navigation />
        <div className="safe-area-top safe-area-bottom">
          <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
            <div className="animate-pulse space-y-4">
              {/* Скелетон для заголовка */}
              <div className="h-8 bg-gray-200 rounded w-1/3"></div>
              {/* Скелетон для поиска */}
              <div className="h-12 bg-gray-200 rounded"></div>
              {/* Скелетоны для списка пациентов */}
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-16 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      {/* Основной контент с safe areas для iOS */}
      <div className="safe-area-top safe-area-bottom">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
          
          {/* Заголовок и кнопка добавления */}
          <div className="mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <h1 className="text-2xl font-bold text-gray-900">Пациенты</h1>
              <button 
                onClick={() => setIsModalOpen(true)}
                className="w-full sm:w-auto bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 active:bg-blue-800 transition-colors touch-manipulation min-h-[44px] flex items-center justify-center"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Добавить пациента
              </button>
            </div>
          </div>

          {/* Поиск с мобильной оптимизацией */}
          <div className="mb-6">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Поиск пациентов..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base bg-white"
                style={{ WebkitAppearance: 'none' }} // Убираем стили Safari
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center min-h-[44px] min-w-[44px] justify-center"
                >
                  <svg className="h-5 w-5 text-gray-400 hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
            
            {/* Информация о результатах поиска */}
            {searchTerm && (
              <div className="mt-2 text-sm text-gray-600 px-1">
                Найдено: {filteredPatients.length}
                {filteredPatients.length !== patients.length && (
                  <span> из {patients.length}</span>
                )}
              </div>
            )}
          </div>

          {/* Список пациентов - адаптивный дизайн */}
          <div className="bg-white rounded-lg shadow-sm border">
            {filteredPatients.length === 0 ? (
              <div className="px-4 py-12 text-center">
                {searchTerm ? (
                  <div className="space-y-4">
                    <svg className="mx-auto h-16 w-16 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-2">Пациенты не найдены</h3>
                      <p className="text-gray-500 mb-4">
                        По запросу "{searchTerm}" ничего не найдено.
                      </p>
                      <button
                        onClick={() => setSearchTerm('')}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 active:bg-blue-300 min-h-[44px]"
                      >
                        Очистить поиск
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <svg className="mx-auto h-16 w-16 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                    </svg>
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-2">Нет пациентов</h3>
                      <p className="text-gray-500 mb-4">
                        Начните с добавления первого пациента.
                      </p>
                      <button
                        onClick={() => setIsModalOpen(true)}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 min-h-[44px]"
                      >
                        Добавить пациента
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {filteredPatients.map((patient) => (
                  <div 
                    key={patient.id} 
                    className="p-4 hover:bg-gray-50 active:bg-gray-100 transition-colors touch-manipulation"
                    onClick={() => handleEditClick(patient)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        {/* Основная информация - всегда видна */}
                        <div className="flex items-center space-x-3 mb-2">
                          <div className="flex-shrink-0 bg-blue-100 rounded-full p-2">
                            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-base font-semibold text-gray-900 truncate">
                              {patient.first_name} {patient.last_name}
                            </p>
                            <p className="text-sm text-gray-500 mt-1 flex items-center">
                              <svg className="flex-shrink-0 mr-2 h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                              </svg>
                              {patient.phone}
                            </p>
                          </div>
                        </div>

                        {/* Дополнительная информация - скрыта на мобильных по умолчанию */}
                        <div className="ml-11 space-y-1">
                          {patient.email && (
                            <p className="text-sm text-gray-600 flex items-center">
                              <svg className="flex-shrink-0 mr-2 h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                              </svg>
                              {patient.email}
                            </p>
                          )}
                          {patient.birth_date && (
                            <p className="text-sm text-gray-600 flex items-center">
                              <svg className="flex-shrink-0 mr-2 h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                              {new Date(patient.birth_date).toLocaleDateString('ru-RU')}
                            </p>
                          )}
                        </div>
                      </div>
                      
                      {/* Кнопка редактирования - скрыта на мобильных, т.к. используется тап по всей карточке */}
                      <button 
                        onClick={(e) => {
                          e.stopPropagation()
                          handleEditClick(patient)
                        }}
                        className="ml-4 flex-shrink-0 hidden sm:flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 min-h-[44px] min-w-[44px]"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        <span className="ml-1 hidden lg:inline">Изменить</span>
                      </button>
                    </div>

                    {/* Индикатор тапа на мобильных */}
                    <div className="mt-2 flex items-center text-xs text-gray-400 sm:hidden">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
                      </svg>
                      Нажмите для редактирования
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Информация о загрузке на мобильных */}
          {filteredPatients.length > 0 && (
            <div className="mt-4 text-center">
              <p className="text-sm text-gray-500">
                Показано {filteredPatients.length} пациентов
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Модальные окна */}
      <AddPatientModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onPatientAdded={handlePatientAdded}
      />

      <EditPatientModal 
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false)
          setSelectedPatient(null)
        }}
        onPatientUpdated={handlePatientUpdated}
        patient={selectedPatient}
      />

      {/* Мобильный FAB для добавления пациента */}
      <div className="sm:hidden fixed bottom-6 right-6 z-40">
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 active:bg-blue-800 transition-colors touch-manipulation min-h-[60px] min-w-[60px] flex items-center justify-center"
          style={{
            boxShadow: '0 4px 14px 0 rgba(0, 118, 255, 0.39)'
          }}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </button>
      </div>
    </div>
  )
}