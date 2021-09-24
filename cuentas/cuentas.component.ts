import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../../services/authentication.service';
import { Router, ActivatedRoute } from '@angular/router';
import { UsuariosService } from '../../services/usuarios.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SuccessModalComponent } from '../../shared/success-modal/success-modal.component';

@Component({
  selector: 'app-cuentas',
  templateUrl: './cuentas.component.html',
  styleUrls: ['./cuentas.component.scss']
})
export class CuentasComponent implements OnInit {

  email = '';
  password = '';
  validEmail: boolean = true;
  validPassword: boolean = true;

  constructor(
    public authenticationService: AuthenticationService,
    public router: Router,
    public route: ActivatedRoute,
    public usuariosService: UsuariosService,
    public modalService: NgbModal,

  ) { }

  ngOnInit(): void {
  }

  async createAccount() {
    this.validPassword = this.password != "" && (/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/).test(this.password);
    this.email = this.email.replace(/\s/g, '');
    this.validEmail = this.email != "" && (/^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i).test(this.email);
    if (this.validPassword && this.validEmail) {
      await this.authenticationService.crearCuenta(this.email, this.password);
      this.guardarUsuario();
      this.abrirModalExito();
      this.router.navigate(["/"]);
    }
  }

  async guardarUsuario() {
    await this.usuariosService.guardarUsuario(this.email);
  }
  async delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async abrirModalExito() {
    const modalRef = this.modalService.open(SuccessModalComponent);
    modalRef.componentInstance.mensaje = "Cuenta creada exitosamente";
    await this.delay(2000)
    modalRef.close();
  }
}
