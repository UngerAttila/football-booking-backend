@echo off
chcp 65001 >nul

REM --- Állítsd be, ha máshová települt a MongoDB (csak a BIN mappa kell) ---
set "MONGO_BIN=C:\Program Files\MongoDB\Server\8.2\bin"

REM --- Demó adatbázis neve és JSON-ok helye ---
set "DB_NAME=footballBookingDB"
set "DATA_DIR=%~dp0"

echo === Import starting to %DB_NAME% on mongodb://localhost:27017 ===

"%MONGO_BIN%\mongoimport.exe" --uri="mongodb://localhost:27017" --db="%DB_NAME%" --collection="Pitch"   --drop --file="%DATA_DIR%pitches.json"  --jsonArray
"%MONGO_BIN%\mongoimport.exe" --uri="mongodb://localhost:27017" --db="%DB_NAME%" --collection="Referee" --drop --file="%DATA_DIR%referees.json" --jsonArray
"%MONGO_BIN%\mongoimport.exe" --uri="mongodb://localhost:27017" --db="%DB_NAME%" --collection="Booking" --drop --file="%DATA_DIR%bookings.json" --jsonArray

echo.
echo === DONE. Open MongoDB Compass and check database: %DB_NAME% ===
pause
