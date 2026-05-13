# ft_pong

A browser-based Pong game built with TypeScript, Fastify, and the HTML5 Canvas API. Two players, one keyboard, classic gameplay.

## Features

- Local two-player gameplay on a single keyboard
- Responsive canvas that adapts to portrait and landscape layouts
- Progressive ball speed-up on each paddle hit
- First player to 5 points wins
- Fastify-based static server, fully containerized with Docker

## Controls

| Player    | Up  | Down |
|-----------|-----|------|
| Player 1  | `W` | `S`  |
| Player 2  | `↑` | `↓`  |

## Quick start (Docker)

> [!TIP]
> Docker is the recommended way to run the project — no Node setup required.

Build the image:

```bash
docker build -t pong . --progress=plain --no-cache
```

Run the container:

```bash
docker run -d -p 3000:3000 --name pong pong
```

Open [http://localhost:3000](http://localhost:3000) and hit **Start**.

Stop and remove:

```bash
docker stop pong
docker rm pong
```

## Local development

All source lives in the `conf/` directory.

### Prerequisites

- Node.js 22+
- npm

### Setup

```bash
cd conf
npm install
npm install -D typescript @types/node
npm install -g nodemon
```

### Run

```bash
npm run start
```

The server hot-reloads on changes via `nodemon` and listens on port `3000`.

### Build

```bash
npm run build          # backend + frontend
npm run build:backend  # backend only
npm run build:frontend # frontend only
npm run clean          # remove build artifacts
```

## Project structure

```
.
├── Dockerfile
└── conf/
    ├── package.json
    ├── tsconfig.json
    ├── tsconfig.backend.json
    ├── tsconfig.frontend.json
    ├── nodemon.json
    └── src/
        ├── server.ts          # Fastify static server
        ├── script/pong.ts     # Game logic (canvas)
        └── public/
            ├── index.html
            └── style/style.css
```

## Tech stack

- **TypeScript** — typed game logic and server
- **Fastify** + `@fastify/static` — lightweight HTTP server
- **HTML5 Canvas** — rendering
- **Docker** — reproducible runtime
- **nodemon** — dev hot-reload
