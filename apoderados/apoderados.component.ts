import { Component, OnInit } from '@angular/core';
import "firebase/firestore";
import {Router} from '@angular/router';
import { ApoderadosService } from '../../services/apoderados.service';
import { Apoderado } from 'src/app/models/apoderado.model';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DeleteModalComponent} from './../../shared/delete-modal/delete-modal.component';
import { FiltrosService } from 'src/app/services/filtros.service';

@Component({
  selector: 'app-apoderados',
  templateUrl: './apoderados.component.html',
  styleUrls: ['./apoderados.component.scss']
})
export class ApoderadosComponent implements OnInit {

  apoderados: Apoderado[] = [];
  filtro:any = {}
  nombreApoderadosBuscados: any = [];
  correosElectronicosBuscados: any = [];
  nombreApoderadoFiltrado = "";

  constructor(
    public router: Router,
    public apoderadosService: ApoderadosService,
    public modalService: NgbModal,
    public filtrosService: FiltrosService
  ) { }


  async ngOnInit() {
    this.filtro = this.filtrosService.filtroApoderados;
    this.filtrarNombreApoderado();
    this.apoderados = await  this.apoderadosService.obtenerApoderados(); 
    this.nombreApoderadosBuscados = this.apoderados;

    this.apoderados.sort((a, b) => {
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
  abrirModalEliminar(apoderado:Apoderado) {
    const modalRef = this.modalService.open(DeleteModalComponent);
    modalRef.componentInstance.type = 'Apoderado';
    modalRef.componentInstance.mensaje = `¿Estás seguro que quieres eliminar a el apoderado ${apoderado.nombres} ${apoderado.apellidos}?`;
    modalRef.componentInstance.delete.subscribe((confirm: boolean) => {
      if(confirm) {
        this.eliminarApoderado(apoderado);
      }
    });
  }
  async eliminarApoderado(apoderado:Apoderado){
    await  this.apoderadosService.eliminarApoderado({...apoderado});
    this.apoderados = await  this.apoderadosService.obtenerApoderados();
    this.router.navigateByUrl('/lista-apoderados');

  }
   async editarApoderado(id:any){
  this.router.navigate(["/form-apoderados"],{queryParams:{id}}); 

  }
  openApoderado(apoderado: Apoderado) {
    this.router.navigateByUrl(`detalles-apoderado/${apoderado.id}`);
  }
  filtrarNombreApoderado(event: any = '') {

    this.nombreApoderadosBuscados = this.apoderados.filter((apoderado: Apoderado) => {

      return (true);
      });

    if (event) {
      this.buscar(event);
    }
  }

  buscar(parametro: string) {
    const words: string[] = parametro.toString().trim().split(' ');
    this.nombreApoderadosBuscados = this.nombreApoderadosBuscados.filter(
      (apoderado: Apoderado) => {
        let encontrado = false;
        words.forEach(word => {
          if (  apoderado.nombres.toLowerCase().includes(word) || apoderado.nombres.toUpperCase().includes(word) || apoderado.nombres.includes(word) ||
                apoderado.apellidos.toLowerCase().includes(word) || apoderado.apellidos.toUpperCase().includes(word) || apoderado.apellidos.includes(word) ||
                apoderado.correoElectronico.toLowerCase().includes(word) || apoderado.correoElectronico.toUpperCase().includes(word) || apoderado.correoElectronico.includes(word) ||
                String(apoderado.celular).includes(word)
                
            ) {
            encontrado = true;
          }
        });
        
        return encontrado;
      }
    );
    
  }
}
