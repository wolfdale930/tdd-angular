import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { ApiResponse } from 'src/app/shared/models/api-response.model';
import { environment } from 'src/environments/environment.development';
import { AppUser } from '../models/app-user.model';

const LOCAL_STORAGE_KEY: string = 'APP_USER';

@Injectable({
  providedIn: 'root'
})
export class AuthService {


  constructor(private http: HttpClient) { }

  async login(form: AppUser): Promise<ApiResponse<AppUser>> {
    const response: ApiResponse<AppUser> = {
      status: 200
    };
    let res = await firstValueFrom(this.http.post<{ token: string }>(`${environment.API_URL}/api/login`, form)).catch(error => {
      response.status = 400;
      response.message = 'Error while login'
    });
    if (res) {
      response.data = {
        firstName: form.firstName,
        lastName: form.lastName,
        token: res.token
      };
    }
    return response;
  }

  saveLoggedInUser(user: AppUser) {
    if (user) {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(user));
    }
  }

  getLoggedInUser(): AppUser | null {
    let data = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (data && JSON.parse(data)) {
      return JSON.parse(data);
    }
    return null;
  }

  removeLoggedInUser() {
    localStorage.removeItem(LOCAL_STORAGE_KEY);
  }
}
