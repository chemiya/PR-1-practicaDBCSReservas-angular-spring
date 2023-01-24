import { Component, OnInit } from '@angular/core';
import { TokenStorageService } from 'src/app/servicios/serviciosIdentificacion/token-storage.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  currentUser: any;

  constructor(private token: TokenStorageService) { }
  //coge los datos del storage
  ngOnInit(): void {
    this.currentUser = this.token.getUser();
  }
}
