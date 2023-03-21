import { TestBed, waitForAsync } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing'
import { of } from 'rxjs';
import { AppUser } from '../models/app-user.model';

import { AuthService } from './auth.service';
import { environment } from 'src/environments/environment.development';
import { ApiResponse } from 'src/app/shared/models/api-response.model';

describe('AuthService', () => {
  const LOCAL_STORAGE_KEY: string = 'APP_USER';
  const mockUser: AppUser = {
    firstName: 'First',
    lastName: 'Last',
    token: ''
  };
  let service: AuthService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule
      ],
      providers: [
        AuthService
      ]
    });
    service = TestBed.inject(AuthService);
    http = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should save user', () => {
    service.saveLoggedInUser(mockUser);
    let storage = localStorage.getItem(LOCAL_STORAGE_KEY);
    expect(storage).toBe(JSON.stringify(mockUser));
  });

  it('should get correct loggedInUser', () => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(mockUser));
    const user: AppUser | null = service.getLoggedInUser();
    expect(JSON.stringify(user)).toBe(JSON.stringify(mockUser));
  });

  it('should get null', () => {
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    const user: AppUser | null = service.getLoggedInUser();
    expect(user).toBe(null);
  });

  it('should remove loggedInUser', () => {
    service.removeLoggedInUser();
    let storage = localStorage.getItem(LOCAL_STORAGE_KEY);
    expect(storage).toEqual(null);
  });

  it('should return token for successful login', waitForAsync(() => {
    let apiResponse: ApiResponse<AppUser> = {
      status: 200,
      data: { ...mockUser, token: 'abcd' }
    };
    service.login(mockUser).then(response => {
      expect(response).toEqual(apiResponse);
    });
    const req = http.expectOne(`${environment.API_URL}/api/login`);
    req.flush({ token: 'abcd' });
  }));

  it('should return undefined for unsuccessful login', waitForAsync(() => {
    http.verify();
    let apiResponse: ApiResponse<AppUser> = {
      status: 400,
      message: 'Error while login'
    };
    service.login(mockUser).then(response => {
      expect(response).toEqual(apiResponse);
    });
    const req = http.expectOne(`${environment.API_URL}/api/login`);
    req.flush(null, { status: 400, statusText: 'message' });
  }));


});
