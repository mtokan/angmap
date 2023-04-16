import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';

export const authGuard = () => {
    const authenticationService = inject(AuthenticationService);
    const router = inject(Router);
    const user = authenticationService.userValue;

    if(user) return true;
    return router.navigate(['/login']);
}