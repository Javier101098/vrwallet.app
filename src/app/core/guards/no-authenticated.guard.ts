import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { TokenService } from '../../feature/auth/services/token.service';

export const noAuthenticatedGuard: CanActivateFn = () => {
  const tokenService = inject(TokenService);
  const router = inject(Router);

  if (!tokenService.IsValid()) {
    return true;
  }

  router.navigate(['/']).then();
  return false;
};
