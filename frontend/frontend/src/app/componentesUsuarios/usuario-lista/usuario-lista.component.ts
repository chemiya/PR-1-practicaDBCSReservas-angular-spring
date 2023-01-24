import { Component, OnInit } from '@angular/core';
import { Usuario } from '../../modelo/app.model';
import { ClienteApiRestService } from '../../servicios/serviciosUsuarios/cliente-api-rest.service';
import { DataService } from '../../servicios/serviciosUsuarios/data.service';
import { TokenStorageService } from '../../servicios/serviciosIdentificacion/token-storage.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-usuario-lista',
  templateUrl: './usuario-lista.component.html',
  styleUrls: ['./usuario-lista.component.css']
})
export class UsuarioListaComponent implements OnInit {

  Usuarios!: Usuario[];//almacen con todos
  UsuariosActualizarTrue: Usuario[] = [];//usuarios para actualizar
  UsuariosActualizarFalse: Usuario[] = [];
  cambiadosParaTrue: Number[] = [];//almacen con ids
  cambiadosParaFalse: Number[] = [];
  botonGuardarCambios: boolean = true;//para si ha hecho algun cambio
  message!: string;//mensaje que comunica los componentes
  showMessage!: boolean;
  tipoFiltrado: String = "todos";
 

  username?: string;
  isLoggedIn = false;

//en el constructor llamo los servicios que necesito
  constructor(private clienteApiRest: ClienteApiRestService, private datos: DataService, private tokenStorageService: TokenStorageService,private router:Router) { }

  ngOnInit() {

    this.isLoggedIn = !!this.tokenStorageService.getToken();//primero lo convierte en tipo booleano y el segundo lo invierte
    //si es null lo pondra a false

    if (this.isLoggedIn) {//si esta true cojo el usuario
      const user = this.tokenStorageService.getUser();
    
      this.username = user.username;
    }

//me suscribo a la variable que comunica los componentes
    this.datos.currentMessage.subscribe(message => this.message = message);
    this.datos.showMessageActual.subscribe(showMessage => this.showMessage = showMessage);


    this.getUsuarios();//traigo lo usuarios
  }
  getUsuarios() {
    this.clienteApiRest.getAllUsuarios().subscribe(//le pregundo al servicio por los usuarios
      resp => {

        if (resp.status < 400) {//si la respuesta es correcta
          this.Usuarios = resp.body!;//lo guardo en el array
        } else {
          this.datos.changeMessage("error al acceder a los usuarios");//si no mensaje en que comunica
          this.datos.changeShowMessage(true);
        }
      },
      err => {
        console.log("Error al traer la lista: " + err.message);//si hay error
        throw err;
      }
    )
  }



  borrar(id: Number) {
    if (window.confirm("esta seguro de que quier borrar a este usuario?")) {//ventana para confirmar
      this.clienteApiRest.borrarUsuario(String(id)).subscribe(//le mando peticion al cliente y con el id
        resp => {
          if (resp.status < 400) {//respuesta correcta

            this.datos.changeMessage(resp.body);//mostramos que ya lo hemos eliminado
            this.datos.changeShowMessage(true);

            this.getUsuarios();//volvemos a cargar los nuevos usuarios
          } else {
            this.datos.changeMessage("error al eliminar el usuario");//mostramos error
            this.datos.changeShowMessage(true);
          }
        },
        err => {
          console.log("Error al borrar: " + err.message);
          throw err;
        }
      )
    }
  }

  


  cambioCheckbox( id: Number, enabled: boolean): void {
    



    if (enabled == true) {//si cambiamos a true
      this.cambiadosParaTrue = this.cambiadosParaTrue.filter(cambio => cambio != id);//buscamos si ya lo habia metido y me quedo solo los diferentes
      this.cambiadosParaTrue.push(id);//le guardamos para cambiar
      this.cambiadosParaFalse = this.cambiadosParaFalse.filter(cambio => cambio != id);//si esta en el contrario lo quitamos
    } else {
      this.cambiadosParaFalse = this.cambiadosParaFalse.filter(cambio => cambio != id);
      this.cambiadosParaFalse.push(id);
      this.cambiadosParaTrue = this.cambiadosParaTrue.filter(cambio => cambio != id);
    }


    //habilitamos el boton si hay algun cambio para hacer, sitien alguno guardado
    if (this.cambiadosParaFalse.length > 0 || this.cambiadosParaTrue.length > 0) {
      this.botonGuardarCambios = false;

    } else {
      this.botonGuardarCambios = true;

    }
  }

 
  onChangeDespegable(event: any) {//me llega evento
    this.tipoFiltrado = event;//cogemos la opcion seleccionada y buscamos en la base segun ella
    this.clienteApiRest.getUsuariosEnabled(this.tipoFiltrado).subscribe(
      resp => {//le pregundo al servicio con el atributo pasado

        if (resp.status < 400) {//si es correcto, lo guardo en usuarios
          this.Usuarios = resp.body!;
        } else {
          this.datos.changeMessage("error al filtrar");//si no muestro mensaje de error
            this.datos.changeShowMessage(true);
        }
      },
      err => {
        console.log("Error al traer la lista: " + err.message);
        throw err;
      }
    )



  }

  guardarEnabled() {
    

    if (this.cambiadosParaTrue.length > 0) {//si hay alguno de true lo guardamos
      this.clienteApiRest.activarUsuarios(this.cambiadosParaTrue).subscribe(
        resp => {//le digo al cliente que los guarde, paso el array
          if (resp.status < 400) { //correcto
            this.datos.changeMessage("cambios guardados con exito");//aviso que se ha guardado
            this.datos.changeShowMessage(true);
          } else {
            this.datos.changeMessage("error al actualizar los registros");
            this.datos.changeShowMessage(true);
          }
          
        },
        err => {
          console.log("Error al actualizar: " + err.message);
          throw err;
        }
      )

      this.cambiadosParaTrue = [];//vaciamos el array para la siguiente vez
    }


    if (this.cambiadosParaFalse.length > 0) {//si hay alguno de false lo guardamos
      this.clienteApiRest.desactivarUsuarios(this.cambiadosParaFalse).subscribe(
        resp => {//al cliente le paso el array
          if (resp.status < 400) { //si es correcto
            this.datos.changeMessage("cambios guardados con exito");
            this.datos.changeShowMessage(true);//muestro mensaje de aviso
          } else {
            this.datos.changeMessage("error al actualizar los registros");
            this.datos.changeShowMessage(true);
          }
         
        },
        err => {
          console.log("Error al actualizar: " + err.message);
          throw err;
        }
      )

      this.cambiadosParaFalse = [];//vaciamos el array
    }


  }

  logout(): void {//llamo al token
    this.tokenStorageService.signOut();
    this.router.navigate(['login']);//navego a ruta de login
  }

}
