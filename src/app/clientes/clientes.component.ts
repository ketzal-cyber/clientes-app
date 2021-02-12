import { Component, OnInit } from '@angular/core';
import { Cliente } from './cliente';
import { ClienteService } from './cliente.service';
import swal from 'sweetalert2';
import { tap } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html',
  styleUrls: ['./clientes.component.css']
})
export class ClientesComponent implements OnInit {

  clientes: Cliente[];
  paginador: any;
  clienteSeleccionado: Cliente;

  constructor( private clienteService: ClienteService,
  private activatedRoute: ActivatedRoute) { }
;

  /*Importar tap se podria utiliar en el getClientes() .pipe(),tap()
  */
  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe( params => {
      let page:number = +params.get('page');

      if(!page){
        page = 0;
      }
      this.clienteService.getClientes(page)
      .pipe(
        tap(response => {
          console.log('ClienteComponent: tap3');
          (response.content as Cliente[]).forEach(cliente => {
            console.log(cliente.nombre);
          });
        })
        // .subscribe( clientes => this.clientes = clientes );
      ).subscribe( response => {
        this.clientes = response.content as Cliente[];
        this.paginador = response;
      } );
    }
    );
  }

  delete(cliente: Cliente): void {

    const swalWithBootstrapButtons = swal.mixin({
  customClass: {
    confirmButton: 'btn btn-success',
    cancelButton: 'btn btn-danger'
  },
  buttonsStyling: false
})

swalWithBootstrapButtons.fire({
  title: '¿Estas seguro?',
  text: `¿Estas seguro de eliminar al cliente ${cliente.nombre} ${cliente.apellido}?`,
  icon: 'warning',
  showCancelButton: true,
  confirmButtonText: 'Sí, eliminar',
  cancelButtonText: 'No, cancelar',
  reverseButtons: true
}).then((result) => {
  if (result.isConfirmed) {
      this.clienteService.delete(cliente.id).subscribe(
        response => {
          this.clientes = this.clientes.filter(cli => cli !== cliente)
          swalWithBootstrapButtons.fire(
            'Cliente eliminado',
            `Cliente ${cliente.nombre} eliminado con exito`,
            'success'
          )
        }
      )


  }
})

  }

  //metodo para arir modal de detalle
  abrirModal(cliente: Cliente){
    this.clienteSeleccionado = cliente;
  }

}
