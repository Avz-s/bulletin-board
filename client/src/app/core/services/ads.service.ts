import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Ad, AdFilters, CreateAdInput, UpdateAdInput } from '../models/ad.model';

@Injectable({ providedIn: 'root' })
export class AdsService {

  // TODO: Mocve these URLs to environment variables or a config file
  private readonly baseUrl = `${environment.apiUrl}/ads`;
  private readonly uploadUrl = `${environment.apiUrl}/uploads`;


  constructor(private readonly http: HttpClient) {}

  uploadImage(file: File): Observable<{ url: string }> {

    const formData = new FormData();

    formData.append('file', file);
    return this.http.post<{ url: string }>(this.uploadUrl, formData);

  }

  findAll(filters: AdFilters): Observable<Ad[]> {

    let params = new HttpParams();

    if (filters.search) {
      params = params.set('search', filters.search);
    }


    if (filters.lat !== undefined && filters.lng !== undefined && filters.radiusKm !== undefined) {
      params = params
        .set('lat', filters.lat)
        .set('lng', filters.lng)
        .set('radiusKm', filters.radiusKm);
    }

    if (filters.category) {
      params = params.set('category', filters.category);
    }

    return this.http.get<Ad[]>(this.baseUrl, { params });

  }

  create(input: CreateAdInput): Observable<Ad> {
    return this.http.post<Ad>(this.baseUrl, input);
  }


  update(id: string, input: UpdateAdInput): Observable<Ad> {
    return this.http.patch<Ad>(`${this.baseUrl}/${id}`, input);
  }

  

  remove(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
