import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { AuthGuard } from './auth-guard.guard'; // Ensure this matches the export
import { AuthService } from '../auth.service';

describe('AuthGuard', () => {
  let authGuard: AuthGuard;
  let router: Router;

  const mockRouteSnapshot: any = {
    snapshot: {}
  };
  const mockRouterStateSnapshot: any = {
    snapshot: {},
    url: '/test'
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [
        AuthGuard,
        {
          provide: AuthService, useValue: {
            isLoggedIn: () => true // Mock your AuthService as needed
          }
        }
      ]
    });

    authGuard = TestBed.inject(AuthGuard);
    router = TestBed.inject(Router);
  });

  it('should be created', () => {
    expect(authGuard).toBeTruthy();
  });

  it('should allow the authenticated user to access the route', () => {
    expect(authGuard.canActivate(new ActivatedRouteSnapshot(), mockRouterStateSnapshot)).toBe(true);
  });

  it('should redirect an unauthenticated user to the login route', () => {
    TestBed.overrideProvider(AuthService, { useValue: { isLoggedIn: () => false } });
    expect(authGuard.canActivate(new ActivatedRouteSnapshot(), mockRouterStateSnapshot)).toBe(false);
  });
});
