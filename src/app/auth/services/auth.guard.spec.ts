import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { AppUser } from '../models/app-user.model';

import { AuthGuard } from './auth.guard';
import { AuthService } from './auth.service';

describe('AuthGuard', () => {
  let guard: AuthGuard;
  // Mocks
  let activatedRouteSnapshot: ActivatedRouteSnapshot = {} as ActivatedRouteSnapshot;
  let routerStateSnapshot: RouterStateSnapshot = { url: '' } as RouterStateSnapshot;
  const mockUser: AppUser = {
    firstName: 'First',
    lastName: 'Last',
    token: 'abcd'
  };
  //Spys
  const authServiceSpy = jasmine.createSpyObj<AuthService>('AuthService', ['getLoggedInUser']);
  const routerSpy = jasmine.createSpyObj<Router>('Router', ['navigate']);

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [
        AuthGuard,
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy }
      ]
    });
    guard = TestBed.inject(AuthGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  describe('when user is logged out', () => {

    beforeEach(() => {
      authServiceSpy.getLoggedInUser.and.returnValue(null);
    });

    it('canActivate should return false when user is logged out', () => {
      let canActivate = guard.canActivate(activatedRouteSnapshot, routerStateSnapshot);
      expect(canActivate).toEqual(false);
    });

    it('canActivateChild should return false when user is logged out', () => {
      let canActivateChild = guard.canActivateChild(activatedRouteSnapshot, routerStateSnapshot);
      expect(canActivateChild).toEqual(false);
    });

    it('canActivate should navigate to /auth when user is logged out', () => {
      routerSpy.navigate.calls.reset();
      guard.canActivate(activatedRouteSnapshot, routerStateSnapshot);
      expect(routerSpy.navigate).toHaveBeenCalledOnceWith(['/auth']);
    });

    it('canActivateChild should navigate to /auth when user is logged out', () => {
      routerSpy.navigate.calls.reset();
      guard.canActivateChild(activatedRouteSnapshot, routerStateSnapshot);
      expect(routerSpy.navigate).toHaveBeenCalledOnceWith(['/auth']);
    });

  });

  describe('when user is logged in', () => {

    beforeEach(() => {
      authServiceSpy.getLoggedInUser.and.returnValue(mockUser);
    });

    it('canActivate should return true when user is logged in', () => {
      let canActivate = guard.canActivate(activatedRouteSnapshot, routerStateSnapshot);
      expect(canActivate).toEqual(true);
    });

    it('canActivateChild should return true when user is logged in', () => {
      let canActivateChild = guard.canActivateChild(activatedRouteSnapshot, routerStateSnapshot);
      expect(canActivateChild).toEqual(true);
    });

    it('canActivate should not navigate to /auth when user is logged in', () => {
      routerSpy.navigate.calls.reset();
      guard.canActivate(activatedRouteSnapshot, routerStateSnapshot);
      expect(routerSpy.navigate).not.toHaveBeenCalled();
    });

    it('canActivateChild should not navigate to /auth when user is logged in', () => {
      routerSpy.navigate.calls.reset();
      guard.canActivateChild(activatedRouteSnapshot, routerStateSnapshot);
      expect(routerSpy.navigate).not.toHaveBeenCalled();
    });

  });

});
