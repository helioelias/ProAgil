import { Component, OnInit, TemplateRef } from '@angular/core';
import { EventoService } from '../_services/evento.service';
import { Evento } from '../_models/Evento';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { BsLocaleService } from 'ngx-bootstrap/datepicker'
import { defineLocale, ptBrLocale } from 'ngx-bootstrap/chronos'

defineLocale('pt-br', ptBrLocale);

@Component({
  selector: 'app-eventos',
  templateUrl: './eventos.component.html',
  styleUrls: ['./eventos.component.css']
})
export class EventosComponent implements OnInit {
  
  eventosFiltrados: Evento[];
  eventos: Evento[]; 
  evento: Evento; 
  imagemLargura = 50;
  imagemMargem = 2;
  mostrarImagem = false;  
  registerForm: FormGroup;
  editId = 0;

  _filtroLista = '';

  constructor(
    private eventoService: EventoService
    , private modalService: BsModalService
    , private fb: FormBuilder
    , private localeService: BsLocaleService
    ) { 
      this.localeService.use('pt-br');
    }

  get filtroLista(){
    return this._filtroLista;
  }

  set filtroLista(value: string){
    this._filtroLista = value;
    this.eventosFiltrados = this._filtroLista ? this.filtrarEventos(this._filtroLista) : this.eventos;
  }

  openModal(template: any) {
    this.registerForm.reset();
    template.show();
  }

  editModal(template: any, evento: Evento) {
    this.registerForm.reset();
    template.show();

    this.editId = evento.id;

    this.registerForm.setValue({'local': evento.local, 
                                'tema': evento.tema, 
                                'dataEvento': evento.dataEvento,
                                'qtdPessoas': evento.qtdPessoas,
                                'imagemUrl': evento.imagemUrl,
                                'telefone': evento.telefone,
                                'email': evento.email
                               } );
  }
      
  ngOnInit() {
    this.validation();
    this.getEventos();  
  }

  filtrarEventos(filtrarPor: string) : Evento[] {
    filtrarPor = filtrarPor.toLocaleLowerCase();
    return this.eventos.filter(
      w => w.tema.toLocaleLowerCase().indexOf(filtrarPor) !== -1
    )
  }

  getEventos(){
    this.eventoService.getAllEvento().subscribe(
    (_eventos: Evento[]) => {
      this.eventos = _eventos;
      this.eventosFiltrados = this.eventos;
      console.log(_eventos);
    }, error => {
      console.log(error);
    })
  }

  alternarImagem(){
    this.mostrarImagem = !this.mostrarImagem;
  }

  validation(){
    this.registerForm = this.fb.group({      
      tema: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(50)] ],
      local: ['', Validators.required],
      dataEvento: ['', Validators.required],
      qtdPessoas: ['', [Validators.required, Validators.max(120000)]],
      imagemUrl: ['', Validators.required], 
      telefone: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]]
    });
  }

  salvarAlteracao(template: any){
    if (this.registerForm.valid) {
      this.evento = Object.assign({}, this.registerForm.value);      
      console.log(this.evento);
      if(this.editId > 0) {
        this.evento.id = this.editId
        this.eventoService.updateEvento(this.evento).subscribe(
          (novoEvento: Evento) => {
            console.log(novoEvento);
            template.hide();
            this.getEventos();
          },
          error => {
            console.log(error);
        });
        return;
      }

      this.eventoService.postEvento(this.evento).subscribe(
        (novoEvento: Evento) => {
          console.log(novoEvento);
          template.hide();
          this.getEventos();
        },
        error => {
          console.log(error);
      });
    }
  }
  
}
