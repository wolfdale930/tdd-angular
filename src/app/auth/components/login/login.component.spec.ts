import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

import { LoginComponent } from './login.component';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let routerSpy = jasmine.createSpyObj<Router>('Router', ['navigate']);
  let authServiceSpy = jasmine.createSpyObj<Router>('Router', ['navigate']);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LoginComponent],
      providers: [
        { provide: Router, useValue: routerSpy },
        { provide: AuthService, useValue: authServiceSpy }
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to / for successful login', () => {
    const base: HTMLElement = fixture.nativeElement;
    const emailInput: HTMLInputElement = base.querySelector('#emailInput')!;
    const passwordInput: HTMLInputElement = base.querySelector('#passwordInput')!;
    const submitButton: HTMLButtonElement = base.querySelector('#submitButton')!;
    emailInput.value = 'eve.holt@reqres.in';
    emailInput.dispatchEvent(new Event('input'));
    passwordInput.value = 'cityslicka';
    passwordInput.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    submitButton.click();
    expect(routerSpy.navigate).toHaveBeenCalledOnceWith(['/']);
  });

});
