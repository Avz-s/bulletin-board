import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { BoardComponent } from './features/board/board.component';
import { UsernameDialogComponent } from './features/username-dialog/username-dialog.component';
import { UserService } from './core/services/user.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [BoardComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  constructor(
    private readonly dialog: MatDialog,
    private readonly userService: UserService,
    
  ) {}


  ngOnInit(): void {
    // TODO: Check if username is valid 
    if (!this.userService.username()) {
      const ref = this.dialog.open(UsernameDialogComponent, { disableClose: true });

      ref.afterClosed().subscribe((username: string | undefined) => {

        if (username) {
          this.userService.setUsername(username);
        }
      });
    }
  }
}
