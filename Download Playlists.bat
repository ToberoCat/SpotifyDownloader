@echo off
set /p url=Enter Spotify Playlist, Track or Album Url:
set /p out=Output folder:

cd src
node index.js --url %url% --output %out% --workers 5 --limit 50 --skip 0
pause