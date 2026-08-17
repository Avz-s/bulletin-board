# Bulletin Board — Client

Angular + Angular Material SPA for the bulletin board app: search/filter ads, post new ones with an optional image and map location, and edit or delete the ones you created.

## Running

```bash
npm install
ng serve   # http://localhost:4200
```

Requires the [server](../server) to be running at `http://localhost:3000` (see `apiUrl` in `src/environments/environment.ts`).

### Google Maps

To use the map location picker and "near me" filtering, add your own [Google Maps JavaScript API key](https://console.cloud.google.com/google/maps-apis) to `googleMapsApiKey` in `src/environments/environment.ts`. Without a key, ad creation/editing falls back to manual latitude/longitude fields — everything else works as normal.
