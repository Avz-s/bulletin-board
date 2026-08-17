import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DatePipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { environment } from '../../../environments/environment';
import { AD_CATEGORY_LABELS, Ad } from '../../core/models/ad.model';

@Component({
  selector: 'app-ad-card',
  standalone: true,
  imports: [DatePipe, MatButtonModule, MatCardModule, MatChipsModule, MatIconModule],
  templateUrl: './ad-card.component.html',
  styleUrl: './ad-card.component.scss',
})
export class AdCardComponent {

  @Input({ required: true }) ad!: Ad;
  @Input() isOwner = false;


  @Output() edit = new EventEmitter<void>();
  @Output() delete = new EventEmitter<void>();

  readonly categoryLabels = AD_CATEGORY_LABELS;

  get imageSrc(): string | null {
    
    return this.ad.imageUrl ? `${environment.apiUrl}${this.ad.imageUrl}` : null;
  }
}
