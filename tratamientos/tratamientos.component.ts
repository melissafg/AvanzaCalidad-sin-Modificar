import { Component, OnInit } from '@angular/core';
import "firebase/firestore";
import { Router } from '@angular/router';
import { TratamientosService } from '../../services/tratamientos.service';
import { Tratamiento } from 'src/app/models/tratamiento.model';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DeleteModalComponent } from './../../shared/delete-modal/delete-modal.component';

@Component({
  selector: 'app-tratamientos',
  templateUrl: './tratamientos.component.html',
  styleUrls: ['./tratamientos.component.scss']
})
export class TratamientosComponent implements OnInit {

  tratamientos: Tratamiento[] = [];
  constructor(
    public router: Router,
    public tratamientosService: TratamientosService,
    public modalService: NgbModal
  ) { }

  async ngOnInit() {
    this.tratamientos = await this.tratamientosService.obtenerTratamientos();
  }
  abrirModalEliminar(tratamiento: Tratamiento) {
    const modalRef = this.modalService.open(DeleteModalComponent);
    modalRef.componentInstance.type = 'Tratamiento';
    modalRef.componentInstance.mensaje = `¿Estás seguro que quieres eliminar el tratamiento ${tratamiento.tratamiento} ?`;
    modalRef.componentInstance.delete.subscribe((confirm: boolean) => {
      if (confirm) {
        this.eliminarTratamiento(tratamiento);
      }
    });
  }
  async eliminarTratamiento(tratamiento: Tratamiento) {
    await this.tratamientosService.eliminarTratamiento({ ...tratamiento });
    this.tratamientos = await this.tratamientosService.obtenerTratamientos();
    this.router.navigateByUrl('/lista-tratamientos');

  }
  async editarTratamiento(id: any) {
    this.router.navigate(["/form-tratamientos"], { queryParams: { id } });
  }
}
