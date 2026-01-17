@echo off
echo Building Next.js project for IIS deployment...
echo.

REM Install dependencies
echo Installing dependencies...
call npm install
if %errorlevel% neq 0 (
    echo Failed to install dependencies
    exit /b %errorlevel%
)

REM Generate Prisma Client
echo Generating Prisma Client...
call npx prisma generate
if %errorlevel% neq 0 (
    echo Failed to generate Prisma Client
    exit /b %errorlevel%
)

REM Build the Next.js application
echo Building Next.js application...
call npm run build
if %errorlevel% neq 0 (
    echo Failed to build Next.js application
    exit /b %errorlevel%
)

echo.
echo Build completed successfully!
echo.
echo Next steps for IIS deployment:
echo 1. Install iisnode on your IIS server
echo 2. Copy the entire project folder to your IIS server
echo 3. Create a new website in IIS pointing to this folder
echo 4. Ensure Node.js is installed on the server
echo 5. Set up your .env file with production values
echo 6. Run database migrations: npx prisma migrate deploy
echo 7. Restart the IIS application pool
echo.
pause
