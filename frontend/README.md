# Frontend Setup

1. ensure node.js is installed

2. select frontend directory

```sh
cd frontend
```

3. install node modules

```sh
npm install
```

4. create a .env file

```sh
NUXT_PUBLIC_BACKEND_URL=http://<ip>:6969
NUXT_PUBLIC_REDIRECT=http://<ip>:3000
```

where `<ip>` is your local network IP address, which you can find somewhere probably. check ur wifi settings idk

5. run the development server on your network:

```sh
npm run dev -- --host <ip>
```

you can now open the link on your phone or whatever.

> \[!IMPORTANT\]
>
> the game board only has tocuh event listeners, so you cant use ur mouse to play unfortunately.
>
> if u still want to use ur mouse, open devtools with `ctrl + shift + i` and enable the mobile emulator that your browser hopefully has. idk about others but in chrome its in the top left of the devtools menu
