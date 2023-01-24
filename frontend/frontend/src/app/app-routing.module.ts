import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';


import { AuthGuard } from './servicios/serviciosIdentificacion/auth.guard';
import { UsuarioListaComponent } from './componentesUsuarios/usuario-lista/usuario-lista.component';
import { EditarUsuarioComponent } from './componentesUsuarios/editar-usuario/editar-usuario.component';
import { ReservaListaComponent } from './componentesReservas/reserva-lista/reserva-lista.component';
import { DisponibilidadHabitacionesComponent } from './componentesReservas/disponibilidad-habitaciones/disponibilidad-habitaciones.component';
import { EditarReservaComponent } from './componentesReservas/editar-reserva/editar-reserva.component';
import { LoginComponent } from './componentesIdentificacion/login/login.component';
import { RegisterComponent } from './componentesIdentificacion/register/register.component';
import { ProfileComponent } from './componentesIdentificacion/profile/profile.component';


const routes: Routes = [
  //rutas y sus componentes
  //solo puede activarse si se cumple la guarda
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'profile', component: ProfileComponent , canActivate:[AuthGuard]},

  {path:"usuarios",component:UsuarioListaComponent, canActivate:[AuthGuard]},
  {path:"usuarios/:id/editar",component:EditarUsuarioComponent, canActivate:[AuthGuard]},//aqui tambien va el id
  {path:"usuarios/nuevo",component:EditarUsuarioComponent, canActivate:[AuthGuard]},

  {path:"book",component:ReservaListaComponent, canActivate:[AuthGuard]},
  {path:"book/disponibilidad",component:DisponibilidadHabitacionesComponent, canActivate:[AuthGuard]},
  {path:"book/:id/editar",component:EditarReservaComponent, canActivate:[AuthGuard]},//aqui tambien va el id
  {path:"book/nueva",component:EditarReservaComponent, canActivate:[AuthGuard]},

  { path: '**', redirectTo: 'login', pathMatch: 'full' }//cualquier otra te redirige
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
