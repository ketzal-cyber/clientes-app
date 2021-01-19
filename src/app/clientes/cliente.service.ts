import { Injectable } from '@angular/core';
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
//ademas la variable queda como vvariable de clase
  constructor(private http: HttpClient, private router: Router ) { }

  getClientes(): Observable<Cliente[]> {
    //return of(CLIENTES);
    // se hace un cast a un Observable en esta forma
    return this.http.get<Cliente[]>(this.urlEndPoint);
    //otra forma de convertir el any JSon a un cleinte[]es
    /*return this.http.get(this.urlEndPoint).pipe(
      map( (response) => response as Cliente[] )
    );*/
  }

  create(cliente: Cliente): Observable<Cliente> {
    return this.http.post<Cliente>(this.urlEndPoint, cliente, {headers: this.httpHeaders} )
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
        this.router.navigate(['/clientes']);
        console.log(e.error.mensaje);
        swal.fire('Error al editar', e.error.mensaje, 'error');
        return throwError(e);
      })
    );
  }

  update(cliente: Cliente): Observable<Cliente>{
    return this.http.put<Cliente>(`${this.urlEndPoint}/${cliente.id}`, cliente, {headers: this.httpHeaders})
  }

  delete(id: number): Observable<Cliente> {
    return this.http.delete<Cliente>(`${this.urlEndPoint}/${id}`, {headers: this.httpHeaders})
  }

}
