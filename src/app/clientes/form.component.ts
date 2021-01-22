import { Component, OnInit } from '@angular/core';
import { Cliente } from './cliente';
import { ClienteService } from './cliente.service';
import { Router, ActivatedRoute } from '@angular/router';
import swal from 'sweetalert2';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html'
})
export class FormComponent implements OnInit {

public cliente: Cliente = new Cliente();
public titulo: string = "Crear Cliente";

  constructor(private clienteService: ClienteService,
    private router: Router,
    private activateroute: ActivatedRoute  ) { }

    public errors: string[];

  ngOnInit(): void {
    this.cargarCliente()
  }


//metodo que activara la clase ActivateRoute
  cargarCliente(): void {
    this.activateroute.params.subscribe(params => {
      let id = params['id']
      if(id){
        this.clienteService.getCliente(id).subscribe( (cliente) => this.cliente = cliente)
      }
    })
  }

  public create(){
    // console.log("Clicket");
    //console.log(this.cliente);

    this.clienteService.create(this.cliente)
    .subscribe(cliente => {
      this.router.navigate(['/clientes'])
      swal.fire('Nuevo cliente', `El cliente ${cliente.nombre} ha sido creado con exito`, 'success')
    },
    err => {
      this.errors = err.error.errors as string[];
      console.log('Codigo de error desde el backend: ' + err.status);
      console.log(err.error.errors);
    }
    )

  }

  update(): void {
    this.clienteService.update(this.cliente)
    .subscribe( json => {
      this.router.navigate(['/clientes'])
      swal.fire('Cliente actualizado', `${json.mensaje}: ${json.cliente.nombre} `, 'success')
    },
    err => {
      this.errors = err.error.errors as string[];
      console.log('Codigo de error desde el backend: ' + err.status);
      console.log(err.error.errors);
    }

    )
  }

}
