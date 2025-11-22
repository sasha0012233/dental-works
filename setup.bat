@echo off
chcp 65001 > nul
title DentalWorks - Установка
echo ========================================
echo    DentalWorks - Начальная установка
echo ========================================
echo.

:: Проверка Node.js
echo Проверка Node.js...
node --version >nul 2>&1
if errorlevel 1 (
    echo ✗ Node.js не установлен
    echo.
    echo Пожалуйста, установите Node.js:
    echo 1. Перейдите на https://nodejs.org
    echo 2. Скачайте LTS версию
    echo 3. Установите с настройками по умолчанию
    echo 4. Перезапустите компьютер
    echo 5. Запустите этот файл снова
    echo.
    pause
    exit /b 1
)

echo ✓ Node.js установлен

:: Установка зависимостей
echo.
echo Установка зависимостей проекта...
call npm install

if errorlevel 1 (
    echo ✗ Ошибка установки зависимостей
    pause
    exit /b 1
)

echo ✓ Зависимости установлены

:: Создание ярлыков
echo.
echo Создание ярлыков...
if exist "create-shortcut.vbs" (
    cscript //nologo create-shortcut.vbs
)

echo.
echo ========================================
echo    Установка завершена успешно!
echo ========================================
echo.
echo Для запуска приложения:
echo 1. Используйте ярлык DentalWorks на рабочем столе
echo 2. Или запустите start-server.bat
echo.
echo Приложение откроется в браузере по адресу:
echo http://localhost:3000
echo.
pause