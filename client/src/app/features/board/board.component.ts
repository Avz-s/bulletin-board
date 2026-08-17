import { Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatToolbarModule } from '@angular/material/toolbar';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';
import { AD_CATEGORIES, AD_CATEGORY_LABELS, Ad, AdCategory } from '../../core/models/ad.model';
import { AdsService } from '../../core/services/ads.service';
import { GeolocationService } from '../../core/services/geolocation.service';
import { UserService } from '../../core/services/user.service';
import { AdCardComponent } from '../ad-card/ad-card.component';
import { AdFormDialogComponent, AdFormDialogData } from '../ad-form-dialog/ad-form-dialog.component';

@Component({
  selector: 'app-board',
  standalone: true,
  imports: [
    FormsModule,
    AdCardComponent,
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    MatToolbarModule,
  ],
  templateUrl: './board.component.html',
  styleUrl: './board.component.scss',
})
export class BoardComponent implements OnInit {
  readonly categories = AD_CATEGORIES;
  readonly categoryLabels = AD_CATEGORY_LABELS;

  readonly ads = signal<Ad[]>([]);
  readonly loading = signal(false);

  readonly nearMeActive = signal(false);

  search = '';
  selectedCategory: AdCategory | null = null;


  private readonly searchChanged = new Subject<string>();

  private nearMeCoords: { lat: number; lng: number } | null = null;

  private readonly nearMeRadiusKm = 25;

  constructor(
    private readonly adsService: AdsService,
    private readonly geolocation: GeolocationService,
    private readonly dialog: MatDialog,
    private readonly snackBar: MatSnackBar,
    readonly userService: UserService,
  ) {
    this.searchChanged
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe(() => this.load());
  }

  ngOnInit(): void {
    this.load();
  }

  onSearchChange(): void {
    this.searchChanged.next(this.search);
  }

  onCategoryChange(): void {
    this.load();
  }

  async toggleNearMe(): Promise<void> {
    if (this.nearMeActive()) {
      this.nearMeActive.set(false);
      this.nearMeCoords = null;

      this.load();
      return;
    }

    try {
      this.nearMeCoords = await this.geolocation.getCurrentPosition();


      this.nearMeActive.set(true);
      this.load();
    } catch {

      this.snackBar.open("Couldn't get your current location", 'Dismiss', { duration: 4000 });
    }
  }

  load(): void {

    this.loading.set(true);

    this.adsService
      .findAll({
        search: this.search || undefined,
        category: this.selectedCategory ?? undefined,
        lat: this.nearMeCoords?.lat,
        lng: this.nearMeCoords?.lng,
        radiusKm: this.nearMeCoords ? this.nearMeRadiusKm : undefined,
      })
      .subscribe({

        next: (ads) => {
          this.ads.set(ads);
          this.loading.set(false);
        },
        error: () => {
          this.loading.set(false);
          this.snackBar.open('Failed to load ads', 'Dismiss', { duration: 4000 });
        },

      });
  }

  isOwner(ad: Ad): boolean {
    return ad.createdBy === this.userService.username();
  }

  openCreateDialog(): void {
    this.openFormDialog({});
  }

  openEditDialog(ad: Ad): void {
    this.openFormDialog({ ad });
  }

  private openFormDialog(data: AdFormDialogData): void {

    const ref = this.dialog.open(AdFormDialogComponent, { data, width: '600px' });

    ref.afterClosed().subscribe((result) => {
      if (!result) {
        return;
      }

      const request = data.ad
        ? this.adsService.update(data.ad.id, result)
        : this.adsService.create(result);

      request.subscribe({

        next: () => {
          this.snackBar.open(data.ad ? 'Ad updated' : 'Ad posted', 'Dismiss', { duration: 3000 });
          this.load();
        },
        error: () => {
          this.snackBar.open('Something went wrong, please try again', 'Dismiss', { duration: 4000 });
        },
      });
    });
  }

  deleteAd(ad: Ad): void {
    if (!confirm(`Delete "${ad.title}"? This can't be undone.`)) {
      return;
    }

    this.adsService.remove(ad.id).subscribe({
      next: () => {
        
        this.snackBar.open('Ad deleted', 'Dismiss', { duration: 3000 });
        this.load();
      },
      error: () => {
        this.snackBar.open('Failed to delete ad', 'Dismiss', { duration: 4000 });
      },
    });
  }
}
