import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {

 //mensaje de comunicacion entre componentes

  //creo el mensaje
  private messageSource = new BehaviorSubject<string>("mensaje en behaviuor");
  currentMessage = this.messageSource.asObservable();


  //creo atributo para si lo muestra o no
  private showMessage = new BehaviorSubject<boolean>(false);
  showMessageActual = this.showMessage.asObservable();


  constructor() { }
  //cambio texto del mensaje
  changeMessage(mensaje: string) {
    this.messageSource.next(mensaje);
  }

  //cambio atributo si lo muestro
  changeShowMessage(bool: boolean) {
    this.showMessage.next(bool);
  }
}
