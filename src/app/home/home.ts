import { Component, inject } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  logout(): void {
    if (typeof this.authService.logout === 'function') {
      this.authService.logout();
    } else {
      localStorage.clear(); // O sessionStorage.clear() si guardas el token allí
    }
    this.router.navigate(['/login']);
  }
}
