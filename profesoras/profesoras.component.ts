import { Component, OnInit } from '@angular/core';
import "firebase/firestore";
import { Router } from '@angular/router';
import { ProfesorasService } from '../../services/profesoras.service';
import { Profesora } from 'src/app/models/profesora.model';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DeleteModalComponent } from './../../shared/delete-modal/delete-modal.component';

@Component({
  selector: 'app-profesoras',
  templateUrl: './profesoras.component.html',
  styleUrls: ['./profesoras.component.scss']
})
export class ProfesorasComponent implements OnInit {

  profesoras: Profesora[] = [];
  constructor(
    public router: Router,
    public modalService: NgbModal,
    public profesorasService: ProfesorasService
  ) { }

  async ngOnInit() {
    this.profesoras = await this.profesorasService.obtenerProfesoras();
    this.profesoras.sort((a, b) => {
      let fa = a.nombres.toLowerCase() + a.apellidos.toLowerCase(),
        fb = b.nombres.toLowerCase() + b.apellidos.toLowerCase();
      if (fa < fb) {
        return -1;
      }
      if (fa > fb) {
        return 1;
      }
      return 0;
    });
  }

  abrirModalEliminar(profesora: Profesora) {
    const modalRef = this.modalService.open(DeleteModalComponent);
    modalRef.componentInstance.type = 'Profesora';
    modalRef.componentInstance.mensaje = `¿Estás seguro que quieres eliminar a la profesora ${profesora.nombres} ${profesora.apellidos}?`;
    modalRef.componentInstance.delete.subscribe((confirm: boolean) => {
      if (confirm) {
        this.eliminarProfesora(profesora);
      }
    });
  }

  abrirProfesora(profesora: Profesora) {
    this.router.navigateByUrl(`detalles-profesora/${profesora.id}`);
  }

  async eliminarProfesora(profesora: Profesora) {
    await this.profesorasService.eliminarProfesora({ ...profesora });
    this.profesoras = await this.profesorasService.obtenerProfesoras();
    this.router.navigateByUrl('/lista-profesoras');
  }
  async editarProfesora(id: any) {
    this.router.navigate(["/form-profesoras"], { queryParams: { id } });

  }
}
