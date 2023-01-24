import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { DisponibilidadHabitacionesComponent } from './componentesReservas/disponibilidad-habitaciones/disponibilidad-habitaciones.component';



import { AuthService } from './servicios/serviciosIdentificacion/auth.service';
import { AuthGuard } from './servicios/serviciosIdentificacion/auth.guard';
import { EditarUsuarioComponent } from './componentesUsuarios/editar-usuario/editar-usuario.component';
import { EditarReservaComponent } from './componentesReservas/editar-reserva/editar-reserva.component';
import { UsuarioListaComponent } from './componentesUsuarios/usuario-lista/usuario-lista.component';
import { ReservaListaComponent } from './componentesReservas/reserva-lista/reserva-lista.component';
import { ProfileComponent } from './componentesIdentificacion/profile/profile.component';
import { LoginComponent } from './componentesIdentificacion/login/login.component';
import { RegisterComponent } from './componentesIdentificacion/register/register.component';
import { AuthInterceptor } from './servicios/interceptor/auth.interceptor';

@NgModule({
  declarations: [
    AppComponent,
    EditarUsuarioComponent,
    UsuarioListaComponent,
    EditarReservaComponent,
    ProfileComponent,
    LoginComponent,
    RegisterComponent,
    ReservaListaComponent,
    DisponibilidadHabitacionesComponent
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [ AuthService, AuthGuard,
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
