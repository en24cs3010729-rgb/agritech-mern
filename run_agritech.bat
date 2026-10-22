@echo off
echo ========================================================
echo   🌾 Starting AgriTech Smart Farming MERN Platform...
echo ========================================================

echo [1/2] Launching Backend Server on port 5000...
start cmd /k "cd backend && npm start"

timeout /t 3 /nobreak >nul

echo [2/2] Launching Frontend Client on port 3000...
start cmd /k "cd frontend && npm run dev"

echo.
echo ========================================================
echo   Both servers launched!
echo   Open your browser at: http://localhost:3000
echo ========================================================
pause
