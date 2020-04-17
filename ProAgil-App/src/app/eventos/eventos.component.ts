import { Component, OnInit } from '@angular/core';
import { HttpClientModule, HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-eventos',
  templateUrl: './eventos.component.html',
  styleUrls: ['./eventos.component.css']
})
export class EventosComponent implements OnInit {

  constructor(private http: HttpClient) { }

  _filtroLista: string;

  get filtroLista(){
    return this._filtroLista;
  }

  set filtroLista(value: string){
    this._filtroLista = value;
    this.eventosFiltrados = this._filtroLista ? this.filtrarEventos(this._filtroLista) : this.eventos;
  }

  eventosFiltrados: any = [];

  eventos: any = []; 
  imagemLargura = 50;
  imagemMargem = 2;
  mostrarImagem = false;
    
  ngOnInit() {
    this.getEventos();  
  }

  filtrarEventos(filtrarPor: string) : any{
    filtrarPor = filtrarPor.toLocaleLowerCase();
    return this.eventos.filter(
      w => w.tema.toLocaleLowerCase().indexOf(filtrarPor) !== -1
    )
  }

  getEventos(){
    this.http.get('http://localhost:5000/Evento').subscribe(response => {
      this.eventos = response;
      this.eventosFiltrados = this.eventos;
    }, error => {
      console.log(error);
    })
  }

  alternarImagem(){
    this.mostrarImagem = !this.mostrarImagem;
  }
}
