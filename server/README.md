# Bulletin Board — Server

Built and tested with **Node v18.20.8** / **npm 10.8.2**.

## Running

```bash
npm install
npm run start:dev   # watch mode, http://localhost:3000
```

Other scripts: `npm run start` (no watch), `npm run start:prod` (run compiled `dist/`), `npm run build`.

### Config

`CLIENT_ORIGIN` (default `http://localhost:4200`) and `PORT` (default `3000`) can be overridden with environment variables.

## Routes

All ad-mutating routes (`POST`/`PATCH`/`DELETE`) require an `x-user` header identifying the caller; `PATCH`/`DELETE` are rejected with `403` if it doesn't match the ad's creator.

| Method | Path         | Description                                                              |
| ------ | ------------ | -------------------------------------------------------------------------- |
| GET    | `/ads`       | List ads. Query params: `search`, `category`, `lat`+`lng`+`radiusKm`       |
| GET    | `/ads/:id`   | Get a single ad                                                            |
| POST   | `/ads`       | Create an ad (requires `x-user`)                                          |
| PATCH  | `/ads/:id`   | Update an ad you created (requires matching `x-user`)                     |
| DELETE | `/ads/:id`   | Delete an ad you created (requires matching `x-user`)                     |
| POST   | `/uploads`   | Upload an image (`multipart/form-data`, field `file`); returns `{ url }` used as an ad's `imageUrl` |