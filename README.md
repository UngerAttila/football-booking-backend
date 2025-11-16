Amatőr focipálya és játékvezető foglaló rendszer

Node.js LTS + npm
– Ajánlott: Node 18/20 LTS (npm együtt jön).
– Ellenőrzés: node -v, npm -v.

MongoDB Community 8.x (helyi szerver)
– Telepítés Windows/Mac/Linuxra a hivatalos telepítővel.
– Fontos: Prisma miatt replika-szett módban kell futnia!
– Hasznos: MongoDB Compass (GUI) a gyors ellenőrzéshez.

mongosh (MongoDB Shell)
– Újabban külön csomag, Compassból is megnyitható beépítve.

Első indítás – lépésről lépésre
0) Repo klónozás
git clone https://github.com/UngerAttila/football-booking-backend.git
cd football-booking-backend

1) Környezeti változók

Hozzon létre .env fájlt a projekt gyökerébe (a te beállításoddal kompatibilis):

DATABASE_URL="mongodb://127.0.0.1:27017/footballBookingDB?replicaSet=rs0"


Ha más host/port, itt módosítja.

2) MongoDB indítása replikaszettként (első alkalom)
Windows (PowerShell, rendszergazda):
# adatkönyvtár
mkdir C:\data\db -ea 0

# mongod indítása RS módban – az ablak maradjon nyitva!
& "C:\Program Files\MongoDB\Server\8.2\bin\mongod.exe" --dbpath C:\data\db --replSet rs0 --bind_ip 127.0.0.1 --port 27017


Nyiss másik (admin) PowerShellt és inicializáld a replikasettet (mongosh vagy Compass beépített shell):

# ha van külön mongosh:
& "C:\Program Files\MongoDB\mongosh\bin\mongosh.exe" --host 127.0.0.1 --port 27017
# shellben:
rs.initiate({ _id: "rs0", members: [ { _id: 0, host: "127.0.0.1:27017" } ] })
rs.status()

macOS / Linux (példa)
mkdir -p ~/data/db
mongod --dbpath ~/data/db --replSet rs0 --bind_ip 127.0.0.1 --port 27017
# új terminál:
mongosh --host 127.0.0.1 --port 27017
rs.initiate({ _id: "rs0", members: [ { _id: 0, host: "127.0.0.1:27017" } ] })


Sikeres, ha rs.status() PRIMARY-t mutat.

3) Függőségek + Prisma
npm install
npx prisma db push
npx prisma generate

4) (Opcionális) Tesztadatok betöltése

A repóban lévő data/ mappát adtad—ha ott van a pitches.json / referees.json / bookings.json és a mongo-football.bat, akkor Windows-on elég:

npm run seed:local


Vagy kézzel (mongoimport):

mongoimport --uri="mongodb://127.0.0.1:27017" --db="footballBookingDB" --collection="Pitch"   --drop --file="data/pitches.json"   --jsonArray
mongoimport --uri="mongodb://127.0.0.1:27017" --db="footballBookingDB" --collection="Referee" --drop --file="data/referees.json" --jsonArray
mongoimport --uri="mongodb://127.0.0.1:27017" --db="footballBookingDB" --collection="Booking" --drop --file="data/bookings.json" --jsonArray

5) Backend indítása
npm run dev


Várt kimenet: pl. http://localhost:3001

Gyors teszt (Postman / böngésző)

Pitches
GET http://localhost:3001/api/pitches
POST http://localhost:3001/api/pitches (Body JSON)
DELETE http://localhost:3001/api/pitches?id=<id>

Referees
GET http://localhost:3001/api/referees
POST http://localhost:3001/api/referees
DELETE http://localhost:3001/api/referees?id=<id>

Bookings
GET http://localhost:3001/api/bookings
POST http://localhost:3001/api/bookings
DELETE http://localhost:3001/api/bookings?id=<id>

POST-nál Content-Type: application/json, a mintákat már összeraktuk.

Hasznos megjegyzések

Replika-szett kötelező (különben Prisma írásnál hibázik/timeoutol).

Compass: ha RS init előtt akarna csatlakozni, hasznos a mongodb://127.0.0.1:27017/?directConnection=true. RS után elhagyható.

Portok: backend 3001, Mongo 27017 (lokál).

CORS: a backend route-okban engedélyezve a http://localhost:8080 (frontend). Ha más porton fut a front, állítsa át a CORS headereket.

.env gitignore: .env ne kerüljön fel (repóban legyen .gitignore).

Node verzió: ha bármi furcsa, egyeztesse a Node LTS verziót (18/20), törölje a node_modules + package-lock.json és npm install.

Gyors hibaelhárítás

POST 500 + „transactions/replica set” → nincs RS: indítsa --replSet rs0-val és futtassa rs.initiate(...).

Server selection timeout → a mongod nem fut / nem 127.0.0.1/27017 / tűzfal blokkol.

Invalid featureCompatibilityVersion → régi adatkönyvtár; törölje/ürítse a C:\data\db-t (devben), indítsa újra és rs.initiate.
