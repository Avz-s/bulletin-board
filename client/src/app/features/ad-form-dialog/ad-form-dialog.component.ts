import { Component, Inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { environment } from '../../../environments/environment';
import { AD_CATEGORIES, AD_CATEGORY_LABELS, Ad, AdLocation, CreateAdInput } from '../../core/models/ad.model';
import { AdsService } from '../../core/services/ads.service';
import { LocationPickerComponent } from '../location-picker/location-picker.component';

export interface AdFormDialogData {
  ad?: Ad;
}

@Component({
  selector: 'app-ad-form-dialog',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    LocationPickerComponent,
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatSelectModule,
  ],
  templateUrl: './ad-form-dialog.component.html',
  styleUrl: './ad-form-dialog.component.scss',
})
export class AdFormDialogComponent {
  readonly categories = AD_CATEGORIES;
  readonly categoryLabels = AD_CATEGORY_LABELS;

  readonly isEdit: boolean;

  readonly uploading = signal(false);
  readonly uploadError = signal<string | null>(null);

  

  private location?: AdLocation;

  readonly imageUrl = signal<string | null>(null);

  readonly form = new FormGroup({
    title: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(3), Validators.maxLength(120)],
    }),
    description: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(3), Validators.maxLength(2000)],
    }),
    category: new FormControl<(typeof AD_CATEGORIES)[number]>(AD_CATEGORIES[0], {
      nonNullable: true,
      validators: [Validators.required],
    }),
    price: new FormControl<number | null>(null),
  });

  constructor(
    private readonly dialogRef: MatDialogRef<AdFormDialogComponent, CreateAdInput>,

    private readonly adsService: AdsService,
    @Inject(MAT_DIALOG_DATA) public data: AdFormDialogData,
  ) {
    this.isEdit = !!data.ad;
    if (data.ad) {
      this.form.patchValue({
        title: data.ad.title,
        description: data.ad.description,
        category: data.ad.category,
        price: data.ad.price ?? null,
      });

      this.location = data.ad.location;
      this.imageUrl.set(data.ad.imageUrl ?? null);
    }
  }

  get initialLocation(): AdLocation | undefined {
    return this.data.ad?.location;
  }

  get imagePreviewSrc(): string | null {
    const url = this.imageUrl();

    return url ? `${environment.apiUrl}${url}` : null;
  }

  onLocationChange(location: AdLocation | undefined): void {
    this.location = location;

  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    input.value = '';

    if (!file) {
      return;
    }

    this.uploadError.set(null);

    this.uploading.set(true);

    this.adsService.uploadImage(file).subscribe({
      next: ({ url }) => {
        this.imageUrl.set(url);
        this.uploading.set(false);
        
      },
      error: () => {
        this.uploadError.set('Failed to upload image. Please try a different file.');
        this.uploading.set(false);
      },
    });
  }

  removeImage(): void {
    this.imageUrl.set(null);
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const value = this.form.getRawValue();
    
    this.dialogRef.close({
      title: value.title!.trim(),
      description: value.description!.trim(),
      category: value.category!,
      price: value.price ?? undefined,
      location: this.location,
      imageUrl: this.imageUrl(),
    });
  }

  cancel(): void {
    this.dialogRef.close();

  }
}
