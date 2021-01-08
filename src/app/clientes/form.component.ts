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
      swal.fire('Nuevo cliente', `Cliente ${cliente.nombre} credo con exito`, 'success')
    }
    )

  }

  update(): void {
    this.clienteService.update(this.cliente)
    .subscribe( cliente => {
      this.router.navigate(['/clientes'])
      swal.fire('Cliente actualizado', `Cliente ${cliente.nombre} actualizado con exito `, 'success')
    }

    )
  }

}
