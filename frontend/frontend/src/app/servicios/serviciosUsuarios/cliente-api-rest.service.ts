import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Usuario } from '../../modelo/app.model';

@Injectable({
  providedIn: 'root'
})
export class ClienteApiRestService {
  idJuntos: String = "";
  
 private static readonly BASE_URI = 'http://localhost:8082/users/';
  //private static readonly BASE_URI = 'http://localhost:8000/api/users/';
  constructor(private http: HttpClient) { }

  //obtener todos los usuarios: obtengo un array
  getAllUsuarios(): Observable<HttpResponse<Usuario[]>> {
    let url = ClienteApiRestService.BASE_URI;
    return this.http.get<Usuario[]>(url, { observe: 'response' });
  }

  //obtengo un array y le paso los datos en la ruta
  identificacion(name:string,contrasena:string): Observable<HttpResponse<Usuario[]>> {
    let url = ClienteApiRestService.BASE_URI+"identificacion/"+name+"/"+contrasena;
    return this.http.get<Usuario[]>(url, { observe: 'response' });
  }


  //validacion del formulario para buscar nombre similar:obtengo un usuario similar
  buscarNombre(nombre:String): Observable<HttpResponse<Usuario>> {
    let url = ClienteApiRestService.BASE_URI+"buscarNombre/"+nombre;
    return this.http.get<Usuario>(url, { observe: 'response' });
  }

  //validacion del formulario para buscar email similar: obtengo un usuario similar
  buscarEmail(nombre:String): Observable<HttpResponse<Usuario>> {
    let url = ClienteApiRestService.BASE_URI+"buscarEmail/"+nombre;
    return this.http.get<Usuario>(url, { observe: 'response' });
  }


  //obtener los usuarios solo segun enabled: obtengo un array de usuario. paso el atributo ? como consulta
  getUsuariosEnabled(enabled:String): Observable<HttpResponse<Usuario[]>> {
    
    if(enabled==="true" ||enabled==="false"){//si solo true o false los filtras
      let url = ClienteApiRestService.BASE_URI+"tipo?enabled="+enabled;
    return this.http.get<Usuario[]>(url, { observe: 'response' });
    }else{//si no traes todos
      let url = ClienteApiRestService.BASE_URI;
    return this.http.get<Usuario[]>(url, { observe: 'response' });
    }

    
  }


  //crear usuario: obtengo cualquier respuesta en texto
  anadirUsuario(usuario:Usuario): Observable<HttpResponse<any>> {
    let url = ClienteApiRestService.BASE_URI;
    

    return this.http.post(url, usuario, { observe: 'response', responseType: 'text' });
}

//modificar los campos del usuario: obtengo cualquier respuesta en texto
modificarUsuario(id: String, usuario:Usuario): Observable<HttpResponse<any>> {

    let url = ClienteApiRestService.BASE_URI + id;
    return this.http.put(url, usuario, { observe: 'response', responseType: 'text' });
}


//eliminar el usuario:obtengo cualquier respuesta en texto
  borrarUsuario(id: String): Observable<HttpResponse<any>> {
    let url = ClienteApiRestService.BASE_URI + id;
    return this.http.delete(url, { observe: 'response', responseType: 'text' });
  }


  //activar el enabled de los usuarios: recibo array
  activarUsuarios(user_id: Number[]): Observable<HttpResponse<any>> {


    //juntamos los id que nos vienen para ponerlos en el url
    for (let id of user_id) {
      this.idJuntos = id + "," + this.idJuntos;
      //console.log(this.idJuntos);
    }

    this.idJuntos = this.idJuntos.substring(0, this.idJuntos.length - 1);

//hago la peticon con ? con los numeros
    let url = ClienteApiRestService.BASE_URI + "enabled?user_id=" + this.idJuntos;

    //console.log(url);
    this.idJuntos = "";//vaciamos para proxima peticion
    return this.http.put(url, null, { observe: 'response', responseType: 'text' });//recibo texto
  }

  //desactivar el enabled de los usuarios: recibo array de id
  desactivarUsuarios(user_id: Number[]): Observable<HttpResponse<any>> {
    //console.log(user_id);
    //juntamos los id que nos vienen para ponerlos en el url
    for (let id of user_id) {
      this.idJuntos = id + "," + this.idJuntos;
      console.log(this.idJuntos);
    }

    this.idJuntos = this.idJuntos.substring(0, this.idJuntos.length - 1);
    let url = ClienteApiRestService.BASE_URI + "disabled?user_id=" + this.idJuntos;//mando los id con ? juntos
    //console.log(url);
    this.idJuntos = "";//vaciamos para proxima peticion
    return this.http.put(url, null, { observe: 'response', responseType: 'text' });//recibo texto con el resultado
  }


  //obtener un usuario comcreto: recibo un usuario
  getUsuario(id: String): Observable<HttpResponse<Usuario>> {
    let url = ClienteApiRestService.BASE_URI + id;
    return this.http.get<Usuario>(url, { observe: 'response' });
}

 
}
