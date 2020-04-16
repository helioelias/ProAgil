import { Component, OnInit } from '@angular/core';
import { HttpClientModule, HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-eventos',
  templateUrl: './eventos.component.html',
  styleUrls: ['./eventos.component.css']
})
export class EventosComponent implements OnInit {

  constructor(private http: HttpClient) { }

  eventos: any; 

  ngOnInit() {
    this.getEventos();
  }

  getEventos(){
    this.http.get('http://localhost:5000/Evento').subscribe(response => {
      this.eventos = response;
    }, error => {
      console.log(error);
    })
  }
}
