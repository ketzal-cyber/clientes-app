import { Component } from '@angular/core';

@Component({
  selector: 'app-directiva',
  templateUrl: './directiva.component.html',
  styleUrls: ['./directiva.component.css']
})
export class DirectivaComponent  {

  listaTecnologias: string[] = ['Java', 'Python', 'Angular', 'JavaScript', 'TypeScript', 'MySQL', 'PostgreSQL', 'OracleDB', 'MongoDB', 'WebLogic', 'WildFly(JBoss)', 'Docker', 'Kubernet']
  habilitado: boolean = true;
  constructor() { }


  setHabilitar(): void {
    this.habilitado = (this.habilitado == true)? false : true;
  }

}
