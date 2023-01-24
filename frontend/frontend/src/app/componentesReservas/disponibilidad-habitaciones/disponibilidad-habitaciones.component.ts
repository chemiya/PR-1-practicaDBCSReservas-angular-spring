import { Component } from '@angular/core';
import { Disponibilidad } from '../../modelo/app.model';
import { ReservasService } from '../../servicios/serviciosReservas/reservas.service';

@Component({
  selector: 'app-disponibilidad-habitaciones',
  templateUrl: './disponibilidad-habitaciones.component.html',
  styleUrls: ['./disponibilidad-habitaciones.component.css']
})
export class DisponibilidadHabitacionesComponent {
  entradaFecha!:Date;
  salidaFecha!:Date;
  
  Dispons! :Disponibilidad[];//para guardar todas
  Filtrado!:Disponibilidad[]//para guardar las filtradas
  falloFecha!:String;

  entradaFechaComprobacion!:Date;
  salidaFechaComprobacion!:Date;
  fechaActual!:Date;
  fechaActualMes!: Date;
  corregirErrores!:boolean;
  

//creo servicio
  constructor(private servicioReservas:ReservasService){}

  ngOnInit(): void {
    //coge las disponibilidades
    this.getDisponibilidades();


    //coge fechas
    this.fechaActual=new Date();
    this.fechaActualMes=new Date();
    this.fechaActualMes.setDate(this.fechaActual.getDate()+31);


    //sin errores
   this.corregirErrores=false;
    
    
  }


//pide al servicio las disponibilidades----------------------------------
  getDisponibilidades(){
    this.servicioReservas.getDisponibilidades().subscribe(
      resp => {

        if (resp.status < 400) {//si todo correct, guardo las disponiblidades
          
          this.Dispons = resp.body!;
         
        } else {
          
        }
      },
      err => {
        console.log("Error al traer la lista: " + err.message);
        throw err;
      }
    )
  }



//formulario fechas-----------------------
  onSubmit(){
    
    //coge las fechas
    var inicioPeticion=new Date(this.entradaFecha);
    var salidaPeticion=new Date(this.salidaFecha);



    //sin fallos en las fechas, entonces filtra de las disponibilidades
    if((this.falloFecha=="")){//filtro las fechas que esten en el rango solicitado
      this.Filtrado=this.Dispons.filter(dispons=>new Date(dispons.fecha)>=inicioPeticion && new Date(dispons.fecha)<=salidaPeticion)
      this.Dispons=this.Filtrado
      this.corregirErrores=false;
    }else{
      this.corregirErrores=true;
    }

    

  }


  //cambio en fecha inicio----------------------------------
  valueChangeInicio(entrada:any){

    //mira si hay errores
   this.entradaFechaComprobacion=new Date(entrada);
   this.comprobacionErrores();
  
  }


   //cambio en fecha final----------------------------------
  valueChangeFin(entrada:any){


    //mira si hay errores
    this.salidaFechaComprobacion=new Date(entrada);
    this.comprobacionErrores();
  
  }



  //comprobacion de errores-------------------------------------
  comprobacionErrores(){
    var errores="";//variable vacia
    if(this.entradaFechaComprobacion>this.salidaFechaComprobacion){//revisa las fechas
     errores+="La fecha de inicio no puede ser mayor que la fecha de salida. ";
    }
 
    if(this.salidaFechaComprobacion<this.fechaActual){
     errores+="Debe introducir una fecha de salida posterior a la fecha actual. "
    
    }
 
    if(this.salidaFechaComprobacion>this.fechaActualMes){
     errores+="Debe introducir una fecha de salida anterior a un mes en adelante a la fecha actual. "
    
    }
 
    if(this.entradaFechaComprobacion<this.fechaActual){
     errores+="Debe introducir una fecha de inicio posterior a la fecha actual. "
    
    }
 
    if(this.entradaFechaComprobacion>this.fechaActualMes){
     errores+="Debe introducir una fecha de inicio anterior a un mes en adelante a la fecha actual. "
    
    }
   
 
    this.falloFecha=errores;
 
    if(this.falloFecha==""){
     this.corregirErrores=false;
    }else{
     this.corregirErrores=true;
    }
  }
}
