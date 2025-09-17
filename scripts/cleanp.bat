@echo off
setlocal

@REM 'Move this file in root directory'
set "rootDirectory=%cd%"

echo Root directory: %rootDirectory%
echo Searching and deleting node_modules and subdirectory .git folders...

for /d /r "%rootDirectory%" %%d in (*) do (
    rem Delete all node_modules
    if /i "%%~nxd"=="node_modules" (
        echo Deleting "%%d"
        rd /s /q "%%d"
    )

    rem Delete .git only if not in the root directory
    if /i "%%~nxd"==".git" (
        if /i not "%%d"=="%rootDirectory%\.git" (
            echo Deleting "%%d"
            rd /s /q "%%d"
        )
    )
)

echo Cleanup completed.
pause
