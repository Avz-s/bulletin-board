import { Injectable } from '@angular/core';

export interface Coordinates {
  lat: number;
  lng: number;
}

@Injectable({ providedIn: 'root' })
export class GeolocationService {
  getCurrentPosition(): Promise<Coordinates> {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        // TODO: Check the reason
        reject(new Error('Geolocation is not supported by this browser'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) =>
          resolve({
            lat: position.coords.latitude,

            lng: position.coords.longitude,

          }),
        (error) => reject(error),
        {
           enableHighAccuracy: true, 
           timeout: 10000 
          },
      );
    });
  }




// return new Promise((resolve, reject) => {
//     // 1. Check browser support
//     if (!navigator.geolocation) {
//       return reject(new Error("Geolocation is not supported by this browser."));
//     }

//     function success(position) {
//       resolve({
//         lat: position.coords.latitude,
//         lng: position.coords.longitude,
//         accuracy: position.coords.accuracy // Bonus: track accuracy in meters
//       });
//     }

//     function error(err) {
//       // 2. Fallback if high accuracy times out
//       if (err.code === err.TIMEOUT && options.enableHighAccuracy) {
//         console.warn("High accuracy timed out. Falling back to low accuracy...");
//         options.enableHighAccuracy = false;
//         options.timeout = 5000; // Give fallback 5 seconds
//         navigator.geolocation.getCurrentPosition(success, reject, options);
//       } else {
//         reject(err);
//       }
//     }

//     navigator.geolocation.getCurrentPosition(success, error, options);
//   });

}
