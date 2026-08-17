import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { promises as fs } from 'fs';
import * as path from 'path';
import { Ad } from './entities/ad.entity';

@Injectable()
export class JsonStorageService implements OnModuleInit {
  private readonly logger = new Logger(JsonStorageService.name);

  private readonly filePath = path.join(process.cwd(), 'data', 'ads.json');

  private ads: Ad[] = [];
  private writeQueue: Promise<unknown> = Promise.resolve();

  async onModuleInit(): Promise<void> {
    await fs.mkdir(path.dirname(this.filePath), { recursive: true });

    try {
      const raw = await fs.readFile(this.filePath, 'utf-8');

      this.ads = JSON.parse(raw) as Ad[];

    } catch (err) {
      // TODO: Handle the case where the file does not exist (ENOENT) by initializing an empty array
      if ((err as NodeJS.ErrnoException).code === 'ENOENT') {
        this.ads = [];

        await this.persist();
      } else {

        this.logger.error('Failed to read ads.json, starting empty', err as Error);
        this.ads = [];
      }
    }
  }

  findAll(): Ad[] {
    return this.ads;
  }

  findOne(id: string): Ad | undefined {
    return this.ads.find((ad) => ad.id === id);
  }

  async create(ad: Ad): Promise<Ad> {
    this.ads.push(ad);
    await this.persist();

    return ad;
  }

  async update(id: string, patch: Partial<Ad>): Promise<Ad | undefined> {
    const ad = this.findOne(id);

    if (!ad) {
      return undefined;
    }


    Object.assign(ad, patch);
    await this.persist();
    return ad;
  }

  async remove(id: string): Promise<boolean> {
    const index = this.ads.findIndex((ad) => ad.id === id);

    if (index === -1) {
      return false;
    }


    this.ads.splice(index, 1);
    await this.persist();


    return true;
  }

  private persist(): Promise<void> {
    
    this.writeQueue = this.writeQueue.then(() =>
      fs.writeFile(
        this.filePath, JSON.stringify(this.ads, null, 2),
         'utf-8'),
    );
    return this.writeQueue as Promise<void>;
  }
}
