import { Component, OnInit } from '@angular/core';
import firebase from 'firebase/app';
import "firebase/auth";
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SuccessModalComponent } from 'src/app/shared/success-modal/success-modal.component';
import { FailureModalComponent } from 'src/app/shared/failure-modal/failure-modal.component';

@Component({
  selector: 'app-cambiar-clave',
  templateUrl: './cambiar-clave.component.html',
  styleUrls: ['./cambiar-clave.component.scss']
})
export class CambiarClaveComponent implements OnInit {

  constructor(

    public router: Router,
    public modalService: NgbModal,

  ) { }
  password: string = "";
  url: string = "";
  code: string = "";
  validPassword: boolean = true;

  async ngOnInit() {

    this.obtenerCodigoDeURL();



  }
  obtenerCodigoDeURL() {
    this.url = window.location.href
    this.code = this.url.substring(this.url.length, this.url.indexOf("oobCode="));
    this.code = this.code.substring(0, this.url.indexOf("&") + 1);
    this.code = this.code.substring(8);
    this.code = this.code.substring(0, this.code.length - 2);

  }

  async cambiarClave(): Promise<void> {

    this.validPassword = this.password != "" && (/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/).test(this.password);

    if (this.validPassword) {

      await firebase.auth().confirmPasswordReset(this.code, this.password)
        .then(() => {
          this.abrirModalExito();
          this.router.navigateByUrl('');
        })
        .catch(() => {
          this.abrirModalError()
          this.router.navigateByUrl('');
        })
    }
  }
  async delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  async abrirModalExito() {
    const modalRef = this.modalService.open(SuccessModalComponent);
    modalRef.componentInstance.mensaje = "Cambio de contraseña exitoso";
    await this.delay(2000)
    modalRef.close();
  }
  async abrirModalError() {
    const modalRef = this.modalService.open(FailureModalComponent);
    modalRef.componentInstance.mensaje = "Cambio de contraseña fallido. Inténtalo de nuevo";
    await this.delay(2500)
    modalRef.close();
  }
}
