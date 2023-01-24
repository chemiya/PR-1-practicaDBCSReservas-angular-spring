import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from '../../servicios/serviciosUsuarios/data.service';
import { Reserva } from '../../modelo/app.model';
import { TokenStorageService } from '../../servicios/serviciosIdentificacion/token-storage.service';
import { ReservasService } from '../../servicios/serviciosReservas/reservas.service';

@Component({
  selector: 'app-reserva-lista',
  templateUrl: './reserva-lista.component.html',
  styleUrls: ['./reserva-lista.component.css']
})
export class ReservaListaComponent {

  Reservas!: Reserva[];//todas las reservas
  ReservasFiltradas!: Reserva[];//para el filtro
  
  message!: string;//mensaje de servicio que comunica los componentes
  showMessage!: boolean;
  

  username?: string;
  isLoggedIn = false;//para ver si esta registrado
  role?:string;
  esGuest=false;
  peticionHistory!:string;
  filtro!:String;//valor del filtro


//creo servicios
  constructor( private datos: DataService, private tokenStorageService: TokenStorageService,private router:Router, private servicioReservas:ReservasService) { }

  ngOnInit() {


    //filtro en todas
    this.filtro="todas"


    //cogemos usuario y role
    this.isLoggedIn = !!this.tokenStorageService.getToken();

    if (this.isLoggedIn) {//si esta registrado cojo los valores del usuario
      const user = this.tokenStorageService.getUser();

      this.username = user.username;
      this.role=user.role;
      
      if(this.role=="GUEST"){//cojo su rol para ver si puede hacer reservas
        this.esGuest=true;
        
      }
      

      //me suscribo al servicio que comunica los componentes
      this.datos.currentMessage.subscribe(message => this.message = message);
    this.datos.showMessageActual.subscribe(showMessage => this.showMessage = showMessage);

//cargamos reservas
      this.getReservas();
    
    }
  }



  //cambio despegable filtro
  onChangeDespegable(entrada:any){
    if(this.filtro=="Pending"){//si el filtro es pending, guardo en las filtradas segun el status de pending
      this.ReservasFiltradas=this.Reservas.filter(reserva=>reserva.status=="Pending");
      
    }else if(this.filtro=="Confirmed"){
      this.ReservasFiltradas=this.Reservas.filter(reserva=>reserva.status=="Confirmed");
      
    }else  if(this.filtro=="Cancelled"){
      this.ReservasFiltradas=this.Reservas.filter(reserva=>reserva.status=="Cancelled");
      
    }else{
      this.ReservasFiltradas=this.Reservas
    }
  }




//coger todas las reservas
  getReservas() {
 
    this.servicioReservas.getAllReservas().subscribe(//le pido las reservas
      resp => {

        if (resp.status < 400) {
          this.Reservas = resp.body!;//las guardo en el array
          this.ReservasFiltradas=this.Reservas;//tambien guardo las filtradas


          //si es guest solo suyas
          if(this.esGuest){//filtro las reservas solo las que tienen mi nombre
           this.Reservas=this.Reservas.filter(reserva=>reserva.guestName==this.username)
           this.ReservasFiltradas=this.Reservas;
          }

          //ordeno por fechas las reservas
          this.ReservasFiltradas.sort((a, b) => new Date(a.createdAt).getTime() -  new Date(b.createdAt).getTime())
          
        } else {//mensaje de error
          this.datos.changeMessage("error al acceder a las reservas");
          this.datos.changeShowMessage(true);
        }
      },
      err => {
        console.log("Error al traer la lista: " + err.message);
        throw err;
      }
    )
  }

//salir
  logout(): void {
    this.tokenStorageService.signOut();//llamo al token y voy a la ruta
    this.router.navigate(['login']);
  }

}
