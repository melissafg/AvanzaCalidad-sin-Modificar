import { Component, OnInit } from '@angular/core';
import "firebase/firestore";
import {Router} from '@angular/router';
import { DiagnosticosService } from '../../services/diagnosticos.service';
import { Diagnostico } from 'src/app/models/diagnostico.model';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DeleteModalComponent} from './../../shared/delete-modal/delete-modal.component';

@Component({
  selector: 'app-diagnosticos',
  templateUrl: './diagnosticos.component.html',
  styleUrls: ['./diagnosticos.component.scss']
})
export class DiagnosticosComponent implements OnInit {

  diagnosticos:Diagnostico[] = [];

  constructor(
    public router: Router,
    public diagnosticosService: DiagnosticosService,
    public modalService: NgbModal
  ) { }

  async ngOnInit() {
    this.diagnosticos = await this.diagnosticosService.obtenerDiagnosticos(); 
  }
 async EditarDiagnostico(id:any){
  this.router.navigate(["/form-diagnosticos"],{queryParams:{id}}); 
  }
  abrirModalEliminar(diagnostico:Diagnostico) {
    const modalRef = this.modalService.open(DeleteModalComponent);
    modalRef.componentInstance.type = 'Diagnostico';
    modalRef.componentInstance.mensaje = `¿Estás seguro que quieres eliminar a el diagnóstico ${diagnostico.diagnostico}?`;
    modalRef.componentInstance.delete.subscribe((confirm: boolean) => {
      if(confirm) {
        this.eliminarDiagnostico(diagnostico);
      }
    });
  }
  async eliminarDiagnostico(diagnostico:Diagnostico){
    await this.diagnosticosService.eliminarDiagnostico({...diagnostico});
    this.diagnosticos = await this.diagnosticosService.obtenerDiagnosticos();
    this.router.navigateByUrl('/lista-diagnosticos');
  }
}
