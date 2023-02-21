# Spotify Downloader
> **Spotify Downloader** is a console tool that allows you to download tracks, entire playlist and albums.

## Features
- Download a single track from Spotify
- Download all tracks from an album from Spotify
- Download all tracks from a playlist from Spotify
- Limit the amount of tracks

## Pre requirements
You need to have a spotify account and nodejs installed on your computer.

## Installation
Clone this repository and open the config file. 
In your file you now have to set your client id and client secret.
You can get it on the official [spotify developer website](https://developer.spotify.com/documentation/general/guides/authorization/app-settings/)

## How to use
After you've set up the config file correctly, you are able to use the tool.
You can execute the `Download Playlist.bat`. It will download all dependencies automatically. After that's done, it will ask you to enter a 
valid spotify url and an output folder where the tracks will be stored.

After you have entered everything required, it will download the tracks and display the progress.
Once the program has finished, you have to press a key to close it.

### Customize the downloading process

If you want to customize your download process, you can edit the batch file directly.
The line you should edit is the one containing node index.js (Line 6).

### What do the parameters do

- `--url` This parameter is the url of your spotify track, playlist or album.
- `--output` This is the folder where the tracks will be stored.
- `--workers` This is the number of tracks that are getting downloaded at the same time
- `--limit` This is how many tracks will be grabbed from spotify at once. If the number is too low, it might cause issues with spotify limiting your api calls
- `--skip` This is the offset in your playlist or album. It will ignore the amount of tracks
