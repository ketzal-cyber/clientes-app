import { Component, OnInit, Input } from '@angular/core';
import { Cliente } from '../cliente';
import { ClienteService } from '../cliente.service';
import { ModalService } from  './modal.service';
import { HttpEventType } from '@angular/common/http';

import swal from 'sweetalert2';

@Component({
  selector: 'detalle-cliente',
  templateUrl: './detalle.component.html',
  styleUrls: ['./detalle.component.css']
})
export class DetalleComponent implements OnInit {

  @Input()cliente: Cliente;

  titulo: string  = "Detalle del cliente";
  public fotoSeleccionada: File;
  progreso: number = 0;

  constructor(private clienteService: ClienteService,
    public modalService:  ModalService,) { }

  ngOnInit(): void {

    /*
        import -> import { ActivatedRoute } from '@angular/router';
    ya no va porque se inyecta el cleinte con el decorador Input
    this.activatedRoute.paramMap.subscribe(params => {
      let id: number = +params.get('id');
      if(id){
        this.clienteService.getCliente(id).subscribe(cliente => {
          this.cliente = cliente;
        });
      }
    }); */
  }


  seleccionarFoto(event){
    this.fotoSeleccionada = event.target.files[0];
    //reiniciar el progreso para cuando cargamos nueva imagen
    this.progreso = 0;
    console.log(this.fotoSeleccionada);
    if(this.fotoSeleccionada.type.indexOf('image') < 0){
      swal.fire('Error Seleccionar imagen: ', 'el archivo debe ser del tipo imagen', 'error');
      this.fotoSeleccionada = null;
    }
  }

  subirFoto(){

    if(!this.fotoSeleccionada){
      swal.fire('Error Upload: ', 'Debe seleccionar una foto', 'error');
    } else {
      this.clienteService.subirFoto(this.fotoSeleccionada, this.cliente.id)
      // ya no maneja un cliente si no un event en el argunmento del subcribe
      .subscribe(event => {
        //this.cliente = cliente;
        // swal.fire('La foto se ha subido completamente', `La foto se ha subido con exito ${this.cliente.foto}`, "success");
        if(event.type === HttpEventType.UploadProgress){
          this.progreso = Math.round((event.loaded/event.total)*100);
        } else if(event.type === HttpEventType.Response){
            let response: any = event.body;
            this.cliente = response.cliente as Cliente;
            swal.fire('La foto se ha subido completamente', `response.mensaje`, "success");
          }

      });
     }
    }

    cerrarModal(){
      this.modalService.cerrarModal();
      this.fotoSeleccionada = null;
      this.progreso = 0;
    }
}
