
import { Reserva } from '../../modelo/app.model';
import { TokenStorageService } from '../../servicios/serviciosIdentificacion/token-storage.service';


import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ReservasService } from '../../servicios/serviciosReservas/reservas.service';
import { DataService } from '../../servicios/serviciosUsuarios/data.service';


@Component({
  selector: 'app-editar-reserva',
  templateUrl: './editar-reserva.component.html',
  styleUrls: ['./editar-reserva.component.css']
})
export class EditarReservaComponent {
  currentUser: any;//usuario donde almaceno datos del token
  reservaVacia = {//creo una reserva con los campos vacios
    guestName: "",
    guestEmail: "",
    price: 0,
    units: 0,
    numGuest: 0,
    status: "Pending",
    dateIn: new Date("2010-01-01"),
    dateOut: new Date("2010-01-01"),
    createdAt: new Date("2010-01-01"),
    updatedAt: new Date("2010-01-01"),
    id: 0

  }

  id!: String;
  operacion!: String;
  reserva = this.reservaVacia as Reserva;//reserva vacia
  falloHuespedes!: string;//para avisar de fallos
  falloFecha!: string;

  corregirErrores!: boolean;
  entradaFechaComprobacion!: Date;
  salidaFechaComprobacion!: Date;
  fechaActual!: Date;
  fechaActualMes!: Date;

//creo servicios
  constructor(private router: Router, private token: TokenStorageService, private datos: DataService, private ruta: ActivatedRoute, private servicioReserva: ReservasService) { }

  ngOnInit(): void {

    //coge los datos del storage, coge el token y lo pone en el atributo
    this.currentUser = this.token.getUser();


    //cargo fechas
    this.fechaActual = new Date();
    this.fechaActualMes = new Date();
    this.fechaActualMes.setDate(this.fechaActual.getDate() + 31);

    //sin errores
    this.corregirErrores = false;

    //operacion en la url
    this.operacion = this.ruta.snapshot.url[this.ruta.snapshot.url.length - 1].path;



    //editar
    if (this.operacion == "editar") {//si en el url viene editar


      this.ruta.paramMap.subscribe( // Capturamos el id de la URL
        params => {
          this.id = params.get('id')!;

        },
        err => console.log("Error al leer id para editar: " + err)
      )

      //buscamos la reserva pasando el id
      this.servicioReserva.getReserva(this.id).subscribe(
        resp => {
          if (resp.body == null) {//si no se encuentra la reserva
            this.router.navigate(['book']);//volvemos a reservas
            this.datos.changeMessage("reserva no encontrado");
            this.datos.changeShowMessage(true);
          } else {//si no lo guardamos para mostrarlo
            this.reserva = resp.body!;

          }


        },
        err => {
          console.log("Error al traer el vino: " + err.message);
          throw err;
        }
      )
    }



  }


  //formulario envio
  onSubmit() {


    //edicion si tenemos id
    if (this.id) {

      //sin errores porque en las variables no hay nada
      if (this.falloFecha == "" && this.falloHuespedes == "") {
        const fechaActual = new Date();
        this.reserva.updatedAt = fechaActual;//actualizamos la fecha de edicion




//calculamos precio, cogiendo las fechas
        var inicio = new Date(this.reserva.dateIn).getTime();
        var final = new Date(this.reserva.dateOut).getTime();
        let resta = final - inicio;
        resta = resta / (1000 * 60 * 60 * 24);

        this.reserva.price = 40 * resta * this.reserva.units;



//modificamos reserva, pasamos el id y la nueva reserva
        this.servicioReserva.modificarReserva(String(this.reserva.id), this.reserva).subscribe(
          resp => {
            if (resp.status < 400) {//si esta correcto
              this.datos.changeMessage(resp.body);
              this.datos.changeShowMessage(true);//avisamos de que se ha actualizado


            } else {

              this.datos.changeMessage("error al modificar");
              this.datos.changeShowMessage(true);
            }
            this.router.navigate(['book']); // Volvemos a la pantalla principal
          },
          err => {
            console.log("Error al editar: " + err.message);
            throw err;
          }
        )
      }
    } 
    
    //crear nueva
    else { 


      //sin fallos porque no hay nada en las variables
      if (this.falloFecha == "" && this.falloHuespedes == "") {

        const fechaActual = new Date();
        this.reserva.createdAt = fechaActual;
        this.reserva.updatedAt = fechaActual;//ponemos fecha actuales


        //calculamos precio con las fechas
        var inicio = new Date(this.reserva.dateIn).getTime();
        var final = new Date(this.reserva.dateOut).getTime();
        let resta = final - inicio;
        resta = resta / (1000 * 60 * 60 * 24);

        this.reserva.price = 40 * resta * this.reserva.units;


        //nombres los cogemos del valor del token
        this.reserva.guestName = this.currentUser.username;
        this.reserva.guestEmail = this.currentUser.email;



        //guardamos la reserva pasando la reserva
        this.servicioReserva.anadirReserva(this.reserva).subscribe(
          resp => {
            if (resp.status < 400) {//si es correcto, mostramos mensaje que nos de
              this.datos.changeMessage(resp.body);
              this.datos.changeShowMessage(true);

            } else {
              this.datos.changeMessage("error al anadir");
              this.datos.changeShowMessage(true);

            }
            this.router.navigate(['book']);//volvemos a la pantalla principal
          },
          err => {
            console.log("Error al editar: " + err.message);
            throw err;
          }
        )
      }


    }


  }

  valueChangeUnits(entrada: any) {//cuando se cambien las unidades
    var maximo = this.reserva.units * 3;//calculamos maximo
    if (this.reserva.numGuest > maximo) {//mostramos error
      this.falloHuespedes = "excede el numero maximo de huespedes: maximo 3 por habitacion."
    } else {
      this.falloHuespedes = "";//guardamos las fechas para hacer comprobacion
      this.salidaFechaComprobacion = new Date(this.reserva.dateOut);
      this.entradaFechaComprobacion = new Date(this.reserva.dateIn);
      this.actualizarPrecio();//actualizamos precio
    }
  }


  valueChangeHuespedes(entrada: any) {//cuando se cambien los huespedes
    var maximo = this.reserva.units * 3;
    if (entrada > maximo) {//calculamos el maximo y ponemos error si se excede
      this.falloHuespedes = "excede el numero maximo de huespedes: maximo 3 por habitacion."
      this.corregirErrores = true;
    } else {
      this.falloHuespedes = "";
      this.corregirErrores = false;//guardamos fechas para hacer comprobaciones
      this.salidaFechaComprobacion = new Date(this.reserva.dateOut);
      this.entradaFechaComprobacion = new Date(this.reserva.dateIn);

      this.actualizarPrecio();//actualizamos precio
    }
  }


  valueChangeFechaInicio(entrada: any) {//cuando se cambia la fecha
    this.entradaFechaComprobacion = new Date(entrada);//comprobamos errores
    this.comprobacionErrores();

  }

  valueChangeFechaFin(entrada: any) {//cuando se cambia la fecha
    this.salidaFechaComprobacion = new Date(entrada);//comprobamos errores

    this.comprobacionErrores();
  }

  actualizarPrecio() {
//cogemos las fchas, hacemos calculos y actualizamos precio
    let resta = this.salidaFechaComprobacion.getTime() - this.entradaFechaComprobacion.getTime();
    resta = resta / (1000 * 60 * 60 * 24);

    this.reserva.price = 40 * resta * this.reserva.units;
  }

  comprobacionErrores() {

    var errores = "";//primero sin errores
    if (this.entradaFechaComprobacion > this.salidaFechaComprobacion) {//comrpobamos fecha y ponemos error
      errores += "La fecha de inicio no puede ser mayor que la fecha de salida. ";
    }

    if (this.salidaFechaComprobacion < this.fechaActual) {
      errores += "Debe introducir una fecha de salida posterior a la fecha actual. "

    }

    if (this.salidaFechaComprobacion > this.fechaActualMes) {
      errores += "Debe introducir una fecha de salida anterior a un mes en adelante a la fecha actual. "

    }

    if (this.entradaFechaComprobacion < this.fechaActual) {
      errores += "Debe introducir una fecha de inicio posterior a la fecha actual. "

    }

    if (this.entradaFechaComprobacion > this.fechaActualMes) {
      errores += "Debe introducir una fecha de inicio anterior a un mes en adelante a la fecha actual. "

    }


    this.falloFecha = errores;//guardamos los errores

    if (this.falloFecha == "" && this.falloHuespedes == "") {
      this.corregirErrores = false;
      this.actualizarPrecio();//actualizmos el precio
    } else {
      this.corregirErrores = true;
    }


  }
}
