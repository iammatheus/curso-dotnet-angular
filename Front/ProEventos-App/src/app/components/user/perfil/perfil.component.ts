import { UserUpdate } from './../../../models/Identity/UserUpdate';
import { AccountService } from '@app/services/account.service';
import { Component, OnInit } from '@angular/core';
import { AbstractControlOptions, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ValidatorField } from '@app/helpers/ValidatorField';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.scss']
})
export class PerfilComponent implements OnInit {
  form!: FormGroup;
  userUpdate = {} as UserUpdate;

  constructor(
    private fb: FormBuilder,
    private accountService: AccountService,
    private router: Router,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService
  ) { }

  get controls(): any {
    return this.form.controls;
  }

  ngOnInit(): void {
    this.validation();
    this.carregarUsuario();
  }

  onSubmit(): void {
    this.atualizarUsuario();
  }

  public atualizarUsuario() {
    this.userUpdate = { ...this.form.value }
    this.spinner.show();

    this.accountService.updateUser(this.userUpdate).subscribe(
      () =>  this.toastr.success('Usuário atualizado!', 'success'),
      (error) => {
        this.toastr.error('Erro ao atualizar usuário!', 'error');;
        console.error(error);
      },
      () => this.spinner.hide(),
    )
  }

  private carregarUsuario(): void {
    this.spinner.show();
    this.accountService.getUser().subscribe(
      (userReturn: UserUpdate) => {
        this.userUpdate = userReturn;
        this.form.patchValue(this.userUpdate);
        this.toastr.success('Usuário carregado.', 'sucsess')
      },
      (error) => {
        console.error(error);
        this.toastr.error('Usuário não carregado', 'error');
        this.router.navigate(['/dashboard']);
      },
      () => this.spinner.hide(),
    )
  }



  public validation(): void {
    const formOptions: AbstractControlOptions = {
      validators: ValidatorField.MustMatch('password', 'confirmarPassword')
    };

    this.form = this.fb.group({
      userName: [''],
      titulo: ['NaoInformado', Validators.required],
      primeiroNome: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(60)]],
      ultimoNome: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(60)]],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', Validators.required],
      descricao: ['', Validators.required],
      funcao: ['NaoInformado', Validators.required],
      password: ['', [Validators.required, Validators.minLength(4)]],
      confirmarPassword: ['', [Validators.required, Validators.minLength(4)]],
    }, formOptions)
  }

}
