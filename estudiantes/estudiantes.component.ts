import { Component, OnInit } from '@angular/core';
import "firebase/firestore";
import { Router } from '@angular/router';
import { EstudiantesService } from '../../services/estudiantes.service';
import { DiagnosticosService } from '../../services/diagnosticos.service';
import { EstadosService } from '../../services/estados.service';
import { Estudiante } from 'src/app/models/estudiante.model';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DeleteModalComponent } from './../../shared/delete-modal/delete-modal.component';
import { FiltrosService } from 'src/app/services/filtros.service';
import * as moment from 'moment';

@Component({
  selector: 'app-estudiantes',
  templateUrl: './estudiantes.component.html',
  styleUrls: ['./estudiantes.component.scss']
})
export class EstudiantesComponent implements OnInit {

  estudiantes: Estudiante[] = [];
  nombreEstudiantesBuscados: any = [];
  nombreFiltrado = "";
  diagnosticos: any = [];
  estados: any = [];
  filtro: any = {};

  constructor(
    public router: Router,
    public modalService: NgbModal,
    public estudiantesService: EstudiantesService,
    public diagnosticosService: DiagnosticosService,
    public estadosService: EstadosService,
    public filtrosService: FiltrosService
  ) { }

  async ngOnInit() {
    this.filtro = this.filtrosService.filtroEstudiantes;

    await Promise.all([
      this.obtenerEstudiantes(),
      this.obtenerDiagnosticos(),
      this.obtenerEstados()
    ]);
    this.estudiantes = await this.estudiantesService.obtenerEstudiantes();
    this.nombreEstudiantesBuscados = this.estudiantes;
    this.ordenarEstudiantes(this.nombreEstudiantesBuscados);
    this.filtrarNombre();
    

  
  }

  abrirEstudiante(estudiante: Estudiante) {
    this.router.navigateByUrl(`detalles-estudiante/${estudiante.id}`);
  }
  
  async eliminarEstudiante(estudiante: Estudiante) {
    await this.estudiantesService.eliminarEstudiante({ ...estudiante });
    this.estudiantes = await this.estudiantesService.obtenerEstudiantes();
    this.nombreEstudiantesBuscados = this.estudiantes;
  }
  async editarEstudiante(id: any) {
    this.router.navigate(["/form-estudiantes"], { queryParams: { id } });

  }
  abrirModalEliminar(estudiante: Estudiante) {
    const modalRef = this.modalService.open(DeleteModalComponent);
    modalRef.componentInstance.type = 'Estudiante';
    modalRef.componentInstance.mensaje = `¿Estás seguro que quieres eliminar al estudiante ${estudiante.nombres} ${estudiante.apellidos}?`;
    modalRef.componentInstance.delete.subscribe((confirm: boolean) => {
      if (confirm) {
        this.eliminarEstudiante(estudiante);
      }
    });
  }

  filtrarNombre(event: any = '') {
    this.nombreEstudiantesBuscados = this.estudiantes.filter((estudiante: Estudiante) => {
      this.ordenarEstudiantes(this.nombreEstudiantesBuscados)
      return (
        (!this.filtro.sexo || estudiante.sexo === this.filtro.sexo)
        && (!this.filtro.diagnostico || estudiante.diagnosticos.some(d => d.diagnostico === this.filtro.diagnostico ))
        && (!this.filtro.estado || estudiante.estados.some(e => e.estado === this.filtro.estado ))
        &&(!this.filtro.mes || estudiante.mes === String(this.filtro.mes))
        &&(!this.filtro.anio || estudiante.anio === this.filtro.anio)
        &&(!this.filtro.numHistorico || estudiante.numHistorico === this.filtro.numHistorico)
        &&(!this.filtro.numGestion || estudiante.numGestion === this.filtro.numGestion)
        &&(!this.filtro.gestionRegistro || estudiante.gestionRegistro === this.filtro.gestionRegistro)

      )
    });

    if (event) {
      this.buscar(event);
    }
  }

  mostrarBienLaFecha(fecha: string){
    return moment(fecha).format('DD/MM/YYYY');
  }

  buscar(parametro: string) {
    const words: string[] = parametro.toString().trim().split(' ');
    this.nombreEstudiantesBuscados = this.nombreEstudiantesBuscados.filter(
      (estudiante: Estudiante) => {
        let encontrado = false;
        words.forEach(word => {
          if (estudiante.nombres.toLowerCase().includes(word) || estudiante.nombres.toUpperCase().includes(word) || estudiante.nombres.includes(word) ||
            estudiante.apellidos.toLowerCase().includes(word) || estudiante.apellidos.toUpperCase().includes(word) || estudiante.apellidos.includes(word)) {
            encontrado = true;
          }
        });
        return encontrado;
      }
    );
  }

  async obtenerEstudiantes() {
    this.estudiantes = await this.estudiantesService.obtenerEstudiantes();
    this.nombreEstudiantesBuscados = this.estudiantes;
  }

  async obtenerDiagnosticos() {
    this.diagnosticos = await this.diagnosticosService.obtenerDiagnosticos();
  }

  async obtenerEstados() {
    this.estados = await this.estadosService.obtenerEstados();
  }

  ordenarEstudiantes(lista:any){
    lista.sort((a:any, b:any) => {
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
}


