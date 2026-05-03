# DV1483 project (SWErdl): a swedish wordl-esque game

This project is created to finish my grade for DV1483 at BTH.

## Running it

Build the docker image: `$ docker build -t swerdl .`

Run the image (with a source mount): `$ docker run --rm -d -v $(pwd):/app/ -p 8080:8080 --name swerdl swerdl`

## The setup

I decided to build a Vue based application and after having worked with laravel recently, I thought vite would be a nice tool for building assets and serving the dev environment.

I put all of this inside of a docker image based on the node 19 + alpine 3.17 image. Which has most of the tools I wanted and needed, pre-installed.

## Inspiration

- [Game play](https://www.nytimes.com/games/wordle/index.html)
- [Keyboard](https://codepen.io/DDunc/pen/ONOWdo)
- [Toast](https://frontend-hero.com/how-to-create-toast-notification)
- [Word list](https://www.ordsom.se/ord-med-5-bokstaver)
