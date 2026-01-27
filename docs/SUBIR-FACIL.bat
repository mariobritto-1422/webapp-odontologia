@echo off
echo ================================================
echo   SUBIR PRESENTACION A INTERNET - AUTOMATICO
echo ================================================
echo.
echo Este script va a:
echo 1. Crear un repositorio en GitHub
echo 2. Subir tu presentacion
echo 3. Darte la URL publica
echo.
echo Presiona cualquier tecla para continuar...
pause > nul

cd "%~dp0presentacion-deploy"

echo.
echo Inicializando Git...
git init

echo.
echo Agregando archivos...
git add .

echo.
echo Creando commit...
git commit -m "Presentacion de ventas - Sistema Odontologico"

echo.
echo ================================================
echo   IMPORTANTE: Sigue estos pasos
echo ================================================
echo.
echo 1. Ve a: https://github.com/new
echo 2. Nombre del repo: presentacion-odonto
echo 3. Public (dejar marcado)
echo 4. NO marques "Initialize with README"
echo 5. Click en "Create repository"
echo.
echo 6. Copia SOLO la linea que dice:
echo    git remote add origin https://github.com/TU-USUARIO/presentacion-odonto.git
echo.
echo 7. Pegala aqui y presiona Enter:
echo.

set /p remote="Pega el comando aqui: "

echo.
echo Ejecutando: %remote%
%remote%

echo.
echo Subiendo archivos a GitHub...
git branch -M main
git push -u origin main

echo.
echo ================================================
echo   CASI LISTO!
echo ================================================
echo.
echo Ultimo paso:
echo 1. Ve a tu repositorio en GitHub
echo 2. Click en "Settings"
echo 3. En el menu izquierdo: "Pages"
echo 4. En "Source": selecciona "main" y carpeta "/ (root)"
echo 5. Click en "Save"
echo.
echo Espera 1 minuto y tu URL sera:
echo https://TU-USUARIO.github.io/presentacion-odonto
echo.
echo ================================================
echo Presiona cualquier tecla para salir...
pause > nul
