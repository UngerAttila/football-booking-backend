# Football Booking – Backend (Next.js + Prisma + MongoDB)

REST-szerű API amatőr focipálya- és játékvezető-foglalásokhoz.  
Tech: **Next.js App Router**, **Prisma (MongoDB adapter)**, **MongoDB (replica set)**.

---

## ✅ Előfeltételek

- **Node.js LTS** (18 vagy 20) + npm  
  Ellenőrzés: `node -v` és `npm -v`
- **MongoDB Community 8.x** (helyi szerver)
- **mongosh** (MongoDB Shell) – vagy használhatod a **MongoDB Compass** beépített shelljét

> Prisma íráshoz **replika szett** szükséges!

---

## 🚀 Gyors indítás (lokálisan)

# 1) Repo klónozás
git clone https://github.com/UngerAttila/football-booking-backend.git
cd football-booking-backend

# 2) Környezeti változók
#   Hozz létre .env fájlt a projekt gyökerébe a következő tartalommal:
#   (replicaSet=rs0 KÖTELEZŐ!)
# ---------------------------------
# .env
# DATABASE_URL="mongodb://127.0.0.1:27017/footballBookingDB?replicaSet=rs0"
# ---------------------------------

# 3) MongoDB indítása REPLICA SET módban és inicializálás
#   Válaszd az OS-edet (lentebb részletes leírás).

# 4) Függőségek + Prisma
npm install
npx prisma db push
npx prisma generate

# 5) (Opcionális) tesztadatok betöltése
#   lásd: "🧪 Seed (tesztadatok)" szekció

# 6) Szerver indítása
npm run dev
# → http://localhost:3001


API alap adatok

Alap URL: http://localhost:3001

Pályák (pitches):

GET /api/pitches

POST /api/pitches (JSON body)

DELETE /api/pitches?id=<id>

Játékvezetők (referees):

GET /api/referees

POST /api/referees

DELETE /api/referees?id=<id>

Foglalások (bookings):

GET /api/bookings

POST /api/bookings

DELETE /api/bookings?id=<id>


Minták (POST body):
// POST /api/pitches
{
  "name": "Buda 5v5",
  "location": "Budapest, Példa utca 10.",
  "surfaceType": "műfű",
  "pricePerHour": 9000,
  "hasLights": true,
  "isIndoor": false,
  "size": "5v5",
  "description": "Jó világítás, jó parkolás."
}
// POST /api/referees
{
  "name": "Kiss Péter",
  "experience": "Megyei szintű játékvezető",
  "pricePerGame": 10000,
  "phone": "+36 30 123 4567",
  "email": "kiss.peter@pelda.hu"
}
// POST /api/bookings  (refereeId lehet null)
{
  "pitchId": "<PITCH_ID>",
  "refereeId": null,
  "date": "2025-01-01",
  "startTime": "18:00",
  "endTime": "19:30",
  "teamName": "FC Teszt",
  "contact": "teszt@example.com"
}
MongoDB – Replica Set indítás

Ha a MongoDB még nem fut RS módban, egyszer inicializálni kell.
# 1) Adatkönyvtár
mkdir C:\data\db -ea 0

# 2) mongod indítása REPLICA SET módban (hagyd nyitva ezt az ablakot!)
& "C:\Program Files\MongoDB\Server\8.2\bin\mongod.exe" --dbpath C:\data\db --replSet rs0 --bind_ip 127.0.0.1 --port 27017

# 3) Replika init (külön ablakban)
# Használhatsz külön mongosh-t vagy a MongoDB Compass beépített shelljét.

# 3/A) mongosh (ha telepítve van)
& "C:\Program Files\MongoDB\mongosh\bin\mongosh.exe" --host 127.0.0.1 --port 27017

# 3/B) Compass: csatlakozz "mongodb://127.0.0.1:27017/?directConnection=true"
#   → jobb felső sarok: Open MongoDB Shell

# a shellben:
rs.initiate({ _id: "rs0", members: [ { _id: 0, host: "127.0.0.1:27017" } ] })
rs.status()  // pár másodperc és PRIMARY lesz
