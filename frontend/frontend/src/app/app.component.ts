import { Component } from '@angular/core';
import { TokenStorageService } from './servicios/serviciosIdentificacion/token-storage.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  private roles: string[] = [];//para los roles
  isLoggedIn = false;
 
  username?: string;

  constructor(private tokenStorageService: TokenStorageService) { }//llamo al servicio de token

  ngOnInit(): void {
    //compruebo si esta logeado buscando el token
    this.isLoggedIn = !!this.tokenStorageService.getToken();

    if (this.isLoggedIn) {//si esta logeado busco el usuario
      const user = this.tokenStorageService.getUser();

      this.roles = user.roles;

      this.username = user.username;
    }
  }

  logout(): void {//llamo al token para salir
    this.tokenStorageService.signOut();
    window.location.reload();
  }
}
