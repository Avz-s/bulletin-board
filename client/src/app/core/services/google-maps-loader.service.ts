import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

declare global {
  interface Window {
    google?: typeof google;
  }
}

@Injectable({ providedIn: 'root' })
export class GoogleMapsLoaderService {


  private loadPromise: Promise<void> | null = null;

  load(): Promise<void> {
    if (!environment.googleMapsApiKey) {
      return Promise.reject(
        new Error('Missing googleMapsApiKey in environment configuration'),
      );
    }


    if (window.google?.maps) {
      return Promise.resolve();
    }

    

    if (!this.loadPromise) {
      this.loadPromise = new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=${environment.googleMapsApiKey}`;
        script.async = true;
        script.onload = () => resolve();
        script.onerror = () => reject(new Error('Failed to load Google Maps script'));
        document.head.appendChild(script);
      });
    }

    return this.loadPromise;
  }
}
