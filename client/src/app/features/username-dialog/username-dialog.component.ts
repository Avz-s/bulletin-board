import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-username-dialog',
  standalone: true,
  imports: [FormsModule, MatButtonModule, MatDialogModule, MatFormFieldModule, MatInputModule],
  templateUrl: './username-dialog.component.html',
})
export class UsernameDialogComponent {
  username = '';

  constructor(private readonly dialogRef: MatDialogRef<UsernameDialogComponent, string>) {}

  
  submit(): void {
    if (!this.username.trim()) {
      return;
    }
    this.dialogRef.close(this.username.trim());
  }
}
