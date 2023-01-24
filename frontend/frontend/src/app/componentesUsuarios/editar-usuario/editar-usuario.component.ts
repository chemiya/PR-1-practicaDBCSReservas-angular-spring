import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Usuario } from '../../modelo/app.model';
import { ClienteApiRestService } from '../../servicios/serviciosUsuarios/cliente-api-rest.service';
import { DataService } from '../../servicios/serviciosUsuarios/data.service';

@Component({
  selector: 'app-editar-usuario',
  templateUrl: './editar-usuario.component.html',
  styleUrls: ['./editar-usuario.component.css']
})
export class EditarUsuarioComponent implements OnInit {

  usuarioVacio = {//creo un usuario vacio 
    firstName: "",
    lastName: "",
    name: "",
    email: "",
    password: "",
    enabled: true,
    role: "HOST",
    createdAt: new Date("2010-01-01"),
    updatedAt: new Date("2010-01-01"),
    id: 0
  };

  emailValido!: string;//para la validacion
  nombreValido!: String;
  usuario = this.usuarioVacio as Usuario;//el usuario vacio

  nombreOriginal!: String;//para la validacion de que sea el mismo
  emailOriginal!: String;
  revisarDiferencia: boolean = true;
  revisarDiferenciaEmail: boolean = true;

  id!: String;//para coger parametros de la ruta
  operacion!: String;
  

  //creo los servicios
  constructor(private ruta: ActivatedRoute, private router: Router, private clienteApiRest: ClienteApiRestService, private datos: DataService) { }


  ngOnInit() {

    // Operacion: va en el ultimo string (parte) de la URL
    this.operacion = this.ruta.snapshot.url[this.ruta.snapshot.url.length - 1].path;
    if (this.operacion == "editar") {


      this.ruta.paramMap.subscribe( // Capturamos el id de la URL
        params => {
          this.id = params.get('id')!;

        },
        err => console.log("Error al leer id para editar: " + err)
      )

      //buscamos el usuario: hacemos peticion pasando el id
      this.clienteApiRest.getUsuario(this.id).subscribe(
        resp => {
          if (resp.body == null) {//si no se encuentra el usuario
            this.router.navigate(['usuarios']);//navegamos a usuarios y mostramos error
            this.datos.changeMessage("usuario no encontrado");
            this.datos.changeShowMessage(true);
          } else {//si no lo guardamos para mostrarlo
            this.usuario = resp.body!;
            this.nombreOriginal = this.usuario.name;//guardamos valores originales
            this.emailOriginal = this.usuario.email;
          }


        },
        err => {
          console.log("Error al traer el vino: " + err.message);
          throw err;
        }
      )
    }
  }

  valueChangeName(entrada: string) {//cuando cambia el campo name
    if (this.id) {//si estamos editando
      if (entrada == this.nombreOriginal) {//si la nueva entrada es como la original
        this.nombreValido = ("este era su usuario inicial");//en la variable ponemos aviso
        this.revisarDiferencia = false;//no hay que buscar si existe uno igual porque es este

      } else {
        this.revisarDiferencia = true;
      }
    }


    if (entrada.length > 0 && this.revisarDiferencia == true) {// buscamos un nombre similar en la base de datos
      this.clienteApiRest.buscarNombre(entrada).subscribe(//al cliente le decimos que busque unos similar
        resp => {
          if (resp.status < 400) {
            if (resp.body == null) {//si nos devuelve null
              this.nombreValido = ("nombre de usuario permitido")//si no encuentra nadie igual
            } else {
              //si encuentra alguien igual
              this.nombreValido = ("nombre de usuario repetido, por favor elija otro")
            }


          }

        },
        err => {
          console.log("Error al editar: " + err.message);
          throw err;
        }
      )
    }


  }

  valueChangeEmail(entrada: any) {//cuando cambia el email

    if (this.id) {//si estamos editando
      if (entrada == this.emailOriginal) {//si la entrada es la misma que la inicial
        this.emailValido = ("este era su email inicial");//avisamos
        this.revisarDiferenciaEmail = false;// no hay que revisar si hay alguien igual

      } else {
        this.revisarDiferenciaEmail = true;
      }
    }


    if (entrada.length > 0 && this.revisarDiferenciaEmail == true) {//buscamos alguien con mismo email
      this.clienteApiRest.buscarEmail(entrada).subscribe(//al cliente le pedimos que busque similar
        resp => {
          if (resp.status < 400) {
            if (resp.body == null) {//si null, no hay similar
              this.emailValido = ("email permitido")//si no lo hay
            } else {

              this.emailValido = ("email repetido, por favor elija otro")//si lo hay no se puede repetir
            }


          }

        },
        err => {
          console.log("Error al editar: " + err.message);
          throw err;
        }
      )
    }

  }


  //envio del formulario
  onSubmit() {




    if (this.id) { //si estamos editando


      const fechaActual = new Date();
      this.usuario.updatedAt = fechaActual;//actualizamos la fecha de edicion

//al cliente le decimos que modifique y le pasamos el id y el usuario nuevo
      this.clienteApiRest.modificarUsuario(String(this.usuario.id), this.usuario).subscribe(
        resp => {
          if (resp.status < 400) {//modificacion correcta
            this.datos.changeMessage(resp.body);//ponemos lo que nos manda en el mensaje
            this.datos.changeShowMessage(true);//avisamos de que se ha actualizado


          } else {

            this.datos.changeMessage("error al modificar");
            this.datos.changeShowMessage(true);
          }
          this.router.navigate(['usuarios']); // Volvemos a la pantalla principal
        },
        err => {
          console.log("Error al editar: " + err.message);
          throw err;
        }
      )
    } else { //crear nuevo
      //si el nombre y el email no estan repetidos se puede guardar si no no
      if (this.nombreValido != "nombre de usuario repetido, por favor elija otro" && this.emailValido != "email repetido, por favor elija otro") {
        const fechaActual = new Date();
        this.usuario.createdAt = fechaActual;
        this.usuario.updatedAt = fechaActual;//ponemos fecha actuales
       
//al cliente le decimos que lo guarde
        this.clienteApiRest.anadirUsuario(this.usuario).subscribe(
          resp => {
            if (resp.status < 400) {//si correcto, mostramos mensaje
              this.datos.changeMessage(resp.body);
              this.datos.changeShowMessage(true);
             
            } else {
              this.datos.changeMessage("error al anadir");
              this.datos.changeShowMessage(true);
             
            }
            this.router.navigate(['usuarios']);//volvemos a la pantalla principal
          },
          err => {
            console.log("Error al editar: " + err.message);
            throw err;
          }
        )
      }

    }



  }

}
