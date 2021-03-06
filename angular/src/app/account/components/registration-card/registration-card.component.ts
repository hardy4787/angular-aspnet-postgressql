import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormValidators, ValidationConstants } from 'src/app/shared';
import { SignupRequest } from '../../models/signup-request.model';
import { IdentityService } from '../../services/identity.service';
import { tap } from 'rxjs';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  templateUrl: './registration-card.component.html',
  styleUrls: ['./registration-card.component.scss'],
})
export class RegistrationCardComponent {
  readonly validationConstants = ValidationConstants;
  emailTextLimit = 50;
  firstNameTextLimit = 50;
  lastNameTextLimit = 50;
  passwordTextLimit = 50;
  form: FormGroup;

  constructor(
    private readonly fromBuilder: FormBuilder,
    private readonly identityService: IdentityService,
    private readonly router: Router,
    private readonly notify: MatSnackBar
  ) {
    this.createForm();
  }

  createForm(): void {
    this.form = this.fromBuilder.group(
      {
        firstName: ['', Validators.maxLength(this.firstNameTextLimit)],
        lastName: ['', Validators.maxLength(this.lastNameTextLimit)],
        email: [
          '',
          [Validators.required, Validators.maxLength(this.emailTextLimit)],
        ],
        password: [
          '',
          [Validators.required, Validators.maxLength(this.passwordTextLimit)],
        ],
        confirmPassword: ['', Validators.required],
      },
      { validators: FormValidators.match('password', 'confirmPassword') }
    );
  }

  onSave(): void {
    const signupRequest = {
      ...this.form.value,
    } as SignupRequest;
    this.identityService
      .signup$(signupRequest)
      .pipe(
        tap((response) => {
          // sessionStorage.setItem('token', response.token);
          this.notify.open('Registration succeed.');
          this.router.navigate(['']);
        })
      )
      .subscribe();
  }
}
