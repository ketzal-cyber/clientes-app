import { Injectable } from '@angular/core';
import { CLIENTES } from './clientes.json';
import { Cliente } from './cliente';
import { of, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';


@Injectable()
export class ClienteService {

private urlEndPoint: string = 'http://localhost:9999/api/clientes';
//inyectar una vraible HttpClient
//ademas la variable queda como vvariable de clase
  constructor(private http: HttpClient ) { }

  getClientes(): Observable<Cliente[]> {
    //return of(CLIENTES);
    // se hace un cast a un Observable en esta forma
    return this.http.get<Cliente[]>(this.urlEndPoint);
    //otra forma de convertir el any JSon a un cleinte[]es
    /*return this.http.get(this.urlEndPoint).pipe(
      map( (response) => response as Cliente[] )
    );*/
  }
}
