import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Disponibilidad, Reserva } from '../../modelo/app.model';

@Injectable({
  providedIn: 'root'
})
export class ReservasService {

  private static readonly BASE_URI = 'http://localhost:8083/book/';

  //private static readonly BASE_URI = 'http://localhost:8000/api/book/';
  
  constructor(private http: HttpClient) { }

  //obtener toda las reservas: obtengo un array
  getAllReservas(): Observable<HttpResponse<Reserva[]>> {
    let url = ReservasService.BASE_URI;
    return this.http.get<Reserva[]>(url, { observe: 'response' });
  }


  //obtener 1 reserva: obtengo una reserva solo
  getReserva(id: String): Observable<HttpResponse<Reserva>> {
    let url = ReservasService.BASE_URI + id;
    return this.http.get<Reserva>(url, { observe: 'response' });
}


//obtener disponibilidades: obtengo un array
getDisponibilidades(): Observable<HttpResponse<Disponibilidad[]>> {
  let url = ReservasService.BASE_URI+"availability/";
  return this.http.get<Disponibilidad[]>(url, { observe: 'response' });
}


//modificar una reserva: obtengo un texto de cualquier tipo
modificarReserva(id: String, reserva:Reserva): Observable<HttpResponse<any>> {

  let url = ReservasService.BASE_URI + id;
  return this.http.put(url, reserva, { observe: 'response', responseType: 'text' });
}



//crear reserva: obtengo un texto de cualquier tipo
anadirReserva(reserva:Reserva): Observable<HttpResponse<any>> {
  let url = ReservasService.BASE_URI;
  

  return this.http.post(url, reserva, { observe: 'response', responseType: 'text' });
}
}
