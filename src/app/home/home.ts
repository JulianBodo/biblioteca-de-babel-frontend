import { Component, inject, computed } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, MatIconModule],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  readonly isAdmin = this.authService.isAdmin;
  readonly isReader = computed(() => this.authService.role() === 'READER');

  logout(): void {
    this.authService.logout();
  }
}