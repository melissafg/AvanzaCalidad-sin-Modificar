import { Component, OnInit } from '@angular/core'
import "firebase/firestore";
import {Router} from '@angular/router';
import { EstadosService } from '../../services/estados.service';
import { Estado } from 'src/app/models/estado.model';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DeleteModalComponent} from './../../shared/delete-modal/delete-modal.component';

@Component({
  selector: 'app-estados',
  templateUrl: './estados.component.html',
  styleUrls: ['./estados.component.scss']
})
export class EstadosComponent implements OnInit {

  estados:Estado[] = [];

  constructor(
    public router: Router,
    public modalService: NgbModal,
   public estadosService: EstadosService
  ) { }

  async ngOnInit() {
    this.estados = await this.estadosService.obtenerEstados(); 
    this.ordenarTabla()
  }
  
  abrirModalEliminar(estado:Estado) {
    const modalRef = this.modalService.open(DeleteModalComponent);
    modalRef.componentInstance.type = 'Estado';
    modalRef.componentInstance.mensaje = `¿Estás seguro que quieres eliminar el estado ${estado.estado}?`;
    modalRef.componentInstance.delete.subscribe((confirm: boolean) => {
      if(confirm) {
        this.eliminarEstado(estado);
      }
    });
  }

  async eliminarEstado(estado:Estado){
    await this.estadosService.eliminarEstado({...estado});
    this.estados = await this.estadosService.obtenerEstados();
    this.ordenarTabla()
 }
 
  async editarEstado(id:any){
    this.router.navigate(["/form-estados"],{queryParams:{id}}); 
  }

  async ordenarTabla(){
    this.estados.sort((a, b) => {
      return parseInt(a.numEstado) - parseInt(b.numEstado);
  });
  }
}
