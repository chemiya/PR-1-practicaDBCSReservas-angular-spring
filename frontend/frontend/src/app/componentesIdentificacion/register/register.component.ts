import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/servicios/serviciosIdentificacion/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  form: any = {//creo formulario
    username: null,
    email: null,
    password: null
  };
  isSuccessful = false;
  isSignUpFailed = false;
  errorMessage = '';

  //creo el servicio
  constructor(private authService: AuthService) { }

  ngOnInit(): void {
  }

  //cuando se suba el formulario
  onSubmit(): void {
    const { username, email, password } = this.form;//cojo los datos del formualrio
    //llama al auth para registrarse y le psao los atributos
    this.authService.register(username, email, password).subscribe({
      next: data => {//si se registra correcto, actualizamos variables
        console.log(data);
        this.isSuccessful = true;
        this.isSignUpFailed = false;
      },
      error: err => {
        this.errorMessage = err.error.message;//si no ponemos error
        this.isSignUpFailed = true;
      }
    });
  }
}
