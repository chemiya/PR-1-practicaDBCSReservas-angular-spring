import { Component, OnInit } from '@angular/core';
import { Route, Router } from '@angular/router';
import { AuthService } from '../../servicios/serviciosIdentificacion/auth.service';
import { TokenStorageService } from '../../servicios/serviciosIdentificacion/token-storage.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  form: any = {//creo los campos del formualrio
    username: null,
    password: null
  };
  isLoggedIn = false;
  isLoginFailed = false;
  errorMessage = '';
  role!: String;


  //creo servicios
  constructor(private authService: AuthService, private tokenStorage: TokenStorageService,private router:Router ) { }

  ngOnInit(): void {
    //busca en el storage
    if (this.tokenStorage.getToken()) {
      this.isLoggedIn = true;//si hay token, cojo los datos
      this.role = this.tokenStorage.getUser().role;
    }
  }

  onSubmit(): void {
    const { username, password } = this.form;//cojo los datos del formulario
    //llama al auth service para identificarse y guarda token y usuario
    this.authService.login(username, password).subscribe({
      next: data => {
        this.tokenStorage.saveToken(data.accessToken);
        this.tokenStorage.saveUser(data);

        this.isLoginFailed = false;
        this.isLoggedIn = true;
        this.role = this.tokenStorage.getUser().role;
        this.router.navigate(['usuarios']);//voy a la pantalla de usuarios
        
        
        
      },
      error: err => {
        this.errorMessage = err.error.message;
        this.isLoginFailed = true;
      }
    });
  }

  
}
