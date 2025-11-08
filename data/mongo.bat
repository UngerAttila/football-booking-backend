chcp 65001
"c:\Program Files\MongoDB\Server\8.2\bin\mongoimport.exe" --uri="mongodb://localhost:27017" --db=ingatlan --collection=kategoriak --drop --file=kategoriak.json --jsonArray
"c:\Program Files\MongoDB\Server\8.2\bin\mongoimport.exe" --uri="mongodb://localhost:27017" --db=ingatlan --collection=ingatlanok --drop --file=ingatlanok.json --jsonArray
echo PLEASE KILL AND RESTART YOUR BACKEND SERVER DEV TASK IF RUNNING!
pause