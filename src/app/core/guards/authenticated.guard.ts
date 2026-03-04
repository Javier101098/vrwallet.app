import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { TokenService } from '../../feature/auth/services/token.service';

export const authenticatedGuard: CanActivateFn = (route, state) => {
  const tokenService = inject(TokenService);
  const router = inject(Router);

  if (tokenService.IsValid()) {
    return true;
  }

  router.navigate(['/auth/sign-in']).then();
  return false;
};
