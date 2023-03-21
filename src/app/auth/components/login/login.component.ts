import { Component } from '@angular/core';
import { FormControl, FormGroup, UntypedFormGroup } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.less']
})
export class LoginComponent {

  loginForm = new FormGroup({
    email: new FormControl(''),
    passowrd: new FormControl('')
  });

  constructor(private authService: AuthService) {
  }

  login() {

  }


}
