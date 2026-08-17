import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { GoogleMap, MapMarker } from '@angular/google-maps';
import { AdLocation } from '../../core/models/ad.model';
import { GeolocationService } from '../../core/services/geolocation.service';
import { GoogleMapsLoaderService } from '../../core/services/google-maps-loader.service';



const DEFAULT_CENTER: google.maps.LatLngLiteral = { lat: 31.7573, lng: 35.2175 }; // HOMEEE

@Component({
  selector: 'app-location-picker',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    GoogleMap,
    MapMarker,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
  ],
  templateUrl: './location-picker.component.html',
  styleUrl: './location-picker.component.scss',
})
export class LocationPickerComponent implements OnInit {

  @Input() initialLocation?: AdLocation;


  @Output() locationChange = new EventEmitter<AdLocation | undefined>();

  readonly mapsAvailable = signal(false);
  readonly mapsFailed = signal(false);
  readonly center = signal<google.maps.LatLngLiteral>(DEFAULT_CENTER);
  readonly marker = signal<google.maps.LatLngLiteral | null>(null);

  address = '';
  manualLat: number | null = null;
  manualLng: number | null = null;


  constructor(
    private readonly mapsLoader: GoogleMapsLoaderService,
    private readonly geolocation: GeolocationService,
  ) {}

  ngOnInit(): void {

    if (this.initialLocation) {
      this.center.set({ lat: this.initialLocation.lat, lng: this.initialLocation.lng });
      this.marker.set({ lat: this.initialLocation.lat, lng: this.initialLocation.lng });
      this.address = this.initialLocation.address ?? '';
      this.manualLat = this.initialLocation.lat;
      this.manualLng = this.initialLocation.lng;

    }

    this.mapsLoader
      .load()
      .then(() => this.mapsAvailable.set(true))
      .catch(() => this.mapsFailed.set(true));
  }

  onMapClick(event: google.maps.MapMouseEvent): void {

    const position = event.latLng;


    if (!position) {
      return;
    }

    const location: google.maps.LatLngLiteral = { lat: position.lat(), lng: position.lng() };

    this.marker.set(location);
    this.emitLocation(location);
  }

  async useCurrentLocation(): Promise<void> {
    try {

      const position = await this.geolocation.getCurrentPosition();

      this.center.set(position);
      this.marker.set(position);
      this.manualLat = position.lat;
      this.manualLng = position.lng;
      this.emitLocation(position);

    } catch {
      // TODO: Show error message to user
    }
  }

  onManualCoordsChange(): void {

    if (Number.isFinite(this.manualLat) && Number.isFinite(this.manualLng)) {
      const location = { lat: this.manualLat as number, lng: this.manualLng as number };

      this.marker.set(location);
      this.emitLocation(location);
    }
  }

  clearLocation(): void {

    this.marker.set(null);
    this.address = '';
    this.manualLat = null;
    this.manualLng = null;
    this.locationChange.emit(undefined);
  }

  private emitLocation(position: google.maps.LatLngLiteral): void {

    this.locationChange.emit({
      lat: position.lat,
      lng: position.lng,
      address: this.address || undefined,
    });
    
  }

  onAddressChange(): void {
    const current = this.marker();
    if (current) {
      this.emitLocation(current);
    }
  }
}
