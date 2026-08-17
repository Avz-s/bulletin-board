# Bulletin Board

A classifieds-style bulletin board SPA: a NestJS REST API backed by a local JSON file, and an Angular + Angular Material client that lists, searches, filters, and manages ads — including an optional Google Maps location on each ad and "near me" distance filtering.

## Structure

- [`server/`](server) — NestJS REST API. Ads are persisted to `server/data/ads.json`.
- [`client/`](client) — Angular SPA (standalone components, Angular Material).

## Running locally

### 1. Server

```bash
cd server
npm install
npm run start:dev
```

Runs on `http://localhost:3000`. CORS is open to `http://localhost:4200` by default (override with the `CLIENT_ORIGIN` env var).

### 2. Client

```bash
cd client
npm install
ng serve
```

Runs on `http://localhost:4200`.

To enable the Google Maps location picker and "near me" search, put a
[Google Maps JavaScript API key](https://console.cloud.google.com/google/maps-apis) in
`client/src/environments/environment.ts` (`googleMapsApiKey`). Without a key, ad creation/editing
falls back to manual latitude/longitude fields, and the rest of the app works normally.

## How it works

- **Ownership**: on first load, the client asks for a username (stored in `localStorage`) and
  attaches it to every request via an `x-user` header. The server stamps new ads with that user
  and rejects edits/deletes of ads created by someone else (`403`). This isn't real
  authentication — anyone can pick a new username — but it satisfies "ads that I created" without
  a login flow.
- **Search / filters**: `GET /ads` supports `search` (title/description substring), `category`,
  and `lat`/`lng`/`radiusKm` (Haversine distance) query params.
- **Storage**: the API keeps all ads in `server/data/ads.json`, read into memory on boot and
  rewritten on every create/update/delete.

## API summary

| Method | Path        | Notes                                    |
| ------ | ----------- | ----------------------------------------- |
| GET    | `/ads`      | `search`, `category`, `lat`, `lng`, `radiusKm` query params |
| GET    | `/ads/:id`  |                                            |
| POST   | `/ads`      | requires `x-user` header                  |
| PATCH  | `/ads/:id`  | requires `x-user` header matching creator |
| DELETE | `/ads/:id`  | requires `x-user` header matching creator |
