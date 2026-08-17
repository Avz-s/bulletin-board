import { Injectable, signal } from '@angular/core';

const STORAGE_KEY = 'bulletin-board.username';

@Injectable({ providedIn: 'root' })
export class UserService {
  readonly username = signal<string | null>(localStorage.getItem(STORAGE_KEY));

  setUsername(username: string): void {
    const trimmed = username.trim();
    if (!trimmed) {
      return;
    }

    localStorage.setItem(STORAGE_KEY, trimmed);
    
    this.username.set(trimmed);
  }
}
