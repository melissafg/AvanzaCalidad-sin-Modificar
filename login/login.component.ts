import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../../services/authentication.service'
import { Router, ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ResetPasswordModalComponent } from './../../shared/reset-password-modal/reset-password-modal.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  email = '';
  password = '';
  isLogged = true;

  constructor(
    public authenticationService: AuthenticationService,
    public router: Router,
    public route: ActivatedRoute,
    public modalService: NgbModal,
  ) { }

  async ngOnInit() {

  }

  async login() {
    this.email = this.email.replace(/\s/g, '');
    await this.authenticationService.login(this.email, this.password);
    this.isLogged = await this.authenticationService.isLoggedIn();

    if (this.isLogged) {
      this.irInicio();
    }
  }

  irInicio() {
    this.router.navigate(["/home"]);
  }

  abrirModalCambioClave() {
    const modalRef = this.modalService.open(ResetPasswordModalComponent);
  }
}
