import { Injectable } from '@angular/core';
import { formatDate, DatePipe } from '@angular/common';
import { CLIENTES } from './clientes.json';
import { Cliente } from './cliente';
import { of, Observable, throwError } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, catchError} from 'rxjs/operators';
import  swal  from 'sweetalert2';

import { Router } from '@angular/router';


@Injectable()
export class ClienteService {

private urlEndPoint: string = 'http://localhost:9999/api/clientes';

private httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json'})

//inyectar una vraible HttpClient
//ademas la variable queda como variable de clase
  constructor(private http: HttpClient, private router: Router ) { }

  getClientes(): Observable<Cliente[]> {
    //return of(CLIENTES);
    // se hace un cast a un Observable en esta forma
    // forma de convertir el any JSon a un cleinte[]es
    //return this.http.get<Cliente[]>(this.urlEndPoint);
    // otra forma de convertir JSon
    return this.http.get(this.urlEndPoint).pipe(
      map( response => {
        let clientes = response as Cliente[];
        return clientes.map(cliente => {
          cliente.nombre = cliente.nombre.toUpperCase();
          //formatear fecha Angular importar formatDate
            //cliente.createAt = formatDate(cliente.createAt, 'dd-MM-yyyy', 'en-US'); // una forma
          //otra forma de dar formato a la fecha es con DatePipe dentro de common
          let datePipe = new DatePipe('en-US');
          cliente.createAt = datePipe.transform(cliente.createAt, 'dd/MM/yyyy');
          return cliente;
        })
       }
      )
    );
  }

  /* captura de error
    otro metodo para convertir un parametro del json a un cliente es co map()
    caturar el status del error con e.stauts==400
  */

  create(cliente: Cliente): Observable<Cliente> {
    return this.http.post(this.urlEndPoint, cliente, {headers: this.httpHeaders} ).pipe(
      map((json:any) => json.cliente as Cliente),
      catchError(e => {

        //capturar status errores
        if(e.status==400){
            return throwError(e);
        }

        console.log('mensaje de error');
        console.log(e.error.mensaje);
        swal.fire('Error al crear cliente ', e.error.Mensaje, 'error');
        return throwError(e);
      })
    );
  }

/** implementacion manejo de errores operadar catchError
      uso de metodo pipe
      uso de swal para mostrar el error sweetalert2
      debemos retornar el error en un tipo Observable, import throwError
      redirigimos al listado
 */
  getCliente(id): Observable<Cliente>{
    return this.http.get<Cliente>(`${this.urlEndPoint}/${id}`).pipe(
      catchError(e => {

        //capturar status errores
        if(e.status==400){
            return throwError(e);
        }

        this.router.navigate(['/clientes']);
        console.log(e.error.mensaje);
        swal.fire('Error al editar ', e.error.Mensaje, 'error');
        return throwError(e);
      })
    );
  }

  //captura de error
  //para corregir que ya no muestra el cliente al insertar volvemos any xq requesamos un json con mensaje y el objeto
  update(cliente: Cliente): Observable<any>{
    return this.http.put<any>(`${this.urlEndPoint}/${cliente.id}`, cliente, {headers: this.httpHeaders}).pipe(
      catchError(e => {
        console.log('mensaje de error');
        console.log(e.error.mensaje);
        swal.fire('Error al actualiar cliente ', e.error.Mensaje, 'error');
        return throwError(e);
      })
    );
  }

  //captura de error
  delete(id: number): Observable<Cliente> {
    return this.http.delete<Cliente>(`${this.urlEndPoint}/${id}`, {headers: this.httpHeaders}).pipe(
      catchError(e => {
        console.log(e.error.mensaje);
        swal.fire('Error al eliminar cliente', e.error.Mensaje, 'error');
        return throwError(e);
      })
    );
  }

}
