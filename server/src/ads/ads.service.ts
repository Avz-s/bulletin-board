import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { promises as fs } from 'fs';
import { join } from 'path';
import { haversineDistanceKm } from '../common/geo';
import { CreateAdDto } from './dto/create-ad.dto';
import { QueryAdsDto } from './dto/query-ads.dto';
import { UpdateAdDto } from './dto/update-ad.dto';
import { Ad } from './entities/ad.entity';
import { JsonStorageService } from './json-storage.service';

@Injectable()
export class AdsService {
  constructor(private readonly storage: JsonStorageService) {}

  findAll(query: QueryAdsDto): Ad[] {
    let ads = this.storage.findAll();

    if (query.search) {

      const term = query.search.toLowerCase();

      ads = ads.filter(
        (ad) =>
          ad.title.toLowerCase().includes(term) ||
          ad.description.toLowerCase().includes(term),
      );
    }
    if (query.category) {
      ads = ads.filter((ad) => ad.category === query.category);
    }

    if (query.lat !== undefined && query.lng !== undefined && query.radiusKm !== undefined) {
      const origin = { lat: query.lat, lng: query.lng };
      ads = ads.filter(
        (ad) =>
          !!ad.location &&
          haversineDistanceKm(origin, ad.location) <= query.radiusKm!,
      );
    }

    return [...ads].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }

  findOne(id: string): Ad {
    const ad = this.storage.findOne(id);
    if (!ad) {
      throw new NotFoundException(`Ad ${id} not found`);
    }
    return ad;
  }

  async create(dto: CreateAdDto, user: string): Promise<Ad> {
    const now = new Date().toISOString();
    const ad: Ad = {
      id: randomUUID(),
      title: dto.title,
      description: dto.description,
      category: dto.category,
      price: dto.price,
      location: dto.location,
      imageUrl: dto.imageUrl,
      createdBy: user,
      createdAt: now,
      updatedAt: now,
    };
    return this.storage.create(ad);
  }

  async update(id: string, dto: UpdateAdDto, user: string): Promise<Ad> {
    const ad = this.findOne(id);
    this.assertOwner(ad, user);

    const previousImageUrl = ad.imageUrl;

    const updated = await this.storage.update(id, {
      ...dto,
      updatedAt: new Date().toISOString(),
    });

    if (
      dto.imageUrl !== undefined &&
      previousImageUrl &&
      previousImageUrl !== dto.imageUrl
    ) {
      await this.deleteImageFile(previousImageUrl);
    }

    return updated!;
  }

  async remove(id: string, user: string): Promise<void> {
    const ad = this.findOne(id);
    this.assertOwner(ad, user);
    await this.storage.remove(id);

    if (ad.imageUrl) {
      await this.deleteImageFile(ad.imageUrl);
    }
  }

  private assertOwner(ad: Ad, user: string): void {
    if (ad.createdBy !== user) {
      throw new ForbiddenException('You can only modify ads you created');
    }
  }

  private async deleteImageFile(imageUrl: string): Promise<void> {
    const filename = imageUrl.replace(/^\/uploads\//, '');
    const filePath = join(process.cwd(), 'data', 'uploads', filename);
    try {
      await fs.unlink(filePath);
    } catch {
      // File may already be gone — nothing to clean up.
    }
  }
}
