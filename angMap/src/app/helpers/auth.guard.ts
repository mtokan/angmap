import { inject } from '@angular/core';
import { Router, RouterStateSnapshot  } from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';

export const authGuard = (state: RouterStateSnapshot) => {
    const authenticationService = inject(AuthenticationService);
    const router = inject(Router);

    if(authenticationService.isLoggedIn()) return true
    
    return router.navigate(['/login']);
}