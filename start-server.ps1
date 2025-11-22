# DentalWorks Server Launcher
Write-Host "========================================" -ForegroundColor Green
Write-Host "   DentalWorks - Запуск сервера" -ForegroundColor Yellow
Write-Host "========================================" -ForegroundColor Green
Write-Host ""

# Проверка Node.js
try {
    $nodeVersion = node --version
    Write-Host "✓ Node.js установлен: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "✗ ОШИБКА: Node.js не установлен!" -ForegroundColor Red
    Write-Host "Установите Node.js с https://nodejs.org" -ForegroundColor Yellow
    Read-Host "Нажмите Enter для выхода"
    exit
}

# Проверка папки node_modules
if (-not (Test-Path "node_modules")) {
    Write-Host "Установка зависимостей..." -ForegroundColor Yellow
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "✗ Ошибка установки зависимостей" -ForegroundColor Red
        Read-Host "Нажмите Enter для выхода"
        exit
    }
}

Write-Host ""
Write-Host "Запуск сервера разработки..." -ForegroundColor Cyan
Write-Host "Приложение будет доступно по адресу:" -ForegroundColor White
Write-Host "http://localhost:3000" -ForegroundColor White
Write-Host ""
Write-Host "Для остановки сервера нажмите Ctrl+C" -ForegroundColor Yellow
Write-Host "========================================" -ForegroundColor Green
Write-Host ""

# Запуск сервера
npm run dev