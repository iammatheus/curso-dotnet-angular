import { AccountService } from './../../../services/account.service';
import { Component, OnInit } from '@angular/core';
import { AbstractControlOptions, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ValidatorField } from '@app/helpers/ValidatorField';
import { User } from '@app/models/Identity/User';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss']
})
export class RegistrationComponent implements OnInit {

  user = {} as User;
  form!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private accountService: AccountService,
    private router: Router,
    private toastr: ToastrService
    ) { }

  ngOnInit(): void {
    this.validation();
  }

  get controls(): any {
    return this.form.controls;
  }

  public validation(): void {

    const formOptions: AbstractControlOptions = {
      validators: ValidatorField.MustMatch('password', 'confirmarPassword')
    };

    this.form = this.fb.group({
      primeiroNome: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(60)]],
      ultimoNome: [''],
      email: ['', [Validators.required, Validators.email]],
      userName: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(20)]],
      password: ['', [Validators.required, Validators.minLength(4)]],
      confirmarPassword: ['', Validators.required],
    }, formOptions)
  }

  register(): void {
    this.user = { ...this.form.value };
    this.accountService.register(this.user).subscribe(
      () => this.router.navigateByUrl('/dashboard'),
      () => this.toastr.error('Erro ao registrar usuário!'),
    )
  }
}
