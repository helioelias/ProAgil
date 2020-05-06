import { Component, OnInit, TemplateRef } from '@angular/core';
import { EventoService } from '../_services/evento.service';
import { Evento } from '../_models/Evento';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { BsLocaleService } from 'ngx-bootstrap/datepicker'
import { defineLocale, ptBrLocale } from 'ngx-bootstrap/chronos'
import { ToastrService } from 'ngx-toastr';
defineLocale('pt-br', ptBrLocale);

@Component({
  selector: 'app-eventos',
  templateUrl: './eventos.component.html',
  styleUrls: ['./eventos.component.css']
})
export class EventosComponent implements OnInit {
  
  titulo = 'Eventos';
  eventosFiltrados: Evento[];
  eventos: Evento[]; 
  evento: Evento; 
  imagemLargura = 50;
  imagemMargem = 2;
  mostrarImagem = false;  
  registerForm: FormGroup;
  modoSalvar = 'post';
  bodyDeletarEvento = '';
  dataEvento: any;
  file: File;
  fileNameToUpdate: string = '';
  dataAtual: string = '';
  
  _filtroLista = '';
  
  constructor(
    private eventoService: EventoService
    , private modalService: BsModalService
    , private fb: FormBuilder
    , private localeService: BsLocaleService
    , private toastr: ToastrService
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
    
    editarEvento(evento: Evento, template: any) {
      this.modoSalvar = 'put';
      this.openModal(template);
      this.evento = Object.assign({}, evento); // copia do elemento
      this.fileNameToUpdate = evento.imagemUrl.toString();
      this.evento.imagemUrl = '';      
      this.registerForm.patchValue(this.evento);
    }
    
    novoEvento(template: any) {
      this.modoSalvar = 'post';
      this.openModal(template);
    }
    
    openModal(template: any) {
      this.registerForm.reset();
      template.show();
    }
    
    ngOnInit() {
      this.validation();
      this.getEventos();  
    }
    
    filtrarEventos(filtrarPor: string) : Evento[] {
      filtrarPor = filtrarPor.toLocaleLowerCase();
      return this.eventos.filter(w => w.tema.toLocaleLowerCase().indexOf(filtrarPor) !== -1);
    }
    
    getEventos() {
      this.dataAtual = new Date().getMilliseconds().toString();
      this.eventoService.getAllEvento().subscribe((_eventos: Evento[]) => {
        this.eventos = _eventos;
        this.eventosFiltrados = this.eventos;
        console.log(_eventos);
      }, error => {
        this.toastr.error(`Erro ao tentar carregar eventos: ${error}`, 'Proagil Eventos');
      });
    }
    
    alternarImagem() {
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
    
    onFileChange(event) {
      const reader = new FileReader();
      
      if (event.target.files && event.target.files.length) {
        this.file = event.target.files;
        console.log(this.file);
      }
    }
    
    uploadImagem() { 
      if(this.modoSalvar === 'post') {
        const nomeArquivo = this.evento.imagemUrl.split('\\', 3);          
        this.evento.imagemUrl = nomeArquivo[2];
        
        this.eventoService.postUpload(this.file, nomeArquivo[2])
        .subscribe(
          () => {
            this.dataAtual = new Date().getMilliseconds().toString();
            this.getEventos();
          });          
        }else{
          this.evento.imagemUrl = this.fileNameToUpdate;
          this.eventoService.postUpload(this.file, this.fileNameToUpdate)
          .subscribe(
            () => {
              this.dataAtual = new Date().getMilliseconds().toString();
              this.getEventos();
            });          
          }
        }
        
        salvarAlteracao(template: any){
          if (this.registerForm.valid) {
            
            if(this.modoSalvar === 'post') {
              this.evento = Object.assign({}, this.registerForm.value);
              
              this.uploadImagem();
              
              this.eventoService.postEvento(this.evento).subscribe(
                (novoEvento: Evento) => {
                  console.log(novoEvento);
                  template.hide();
                  this.getEventos();
                  this.toastr.success('Inserido com sucesso', 'Proagil Eventos');
                },
                error => {
                  this.toastr.error(`Erro ao inserir: ${error}`, 'Proagil Eventos');
                });
                
              }
              else {
                this.evento = Object.assign({id: this.evento.id}, this.registerForm.value);
                
                this.uploadImagem();
                
                this.eventoService.updateEvento(this.evento).subscribe(
                  () => {
                    template.hide();
                    this.getEventos();
                    this.toastr.success('Editado com sucesso', 'Proagil Eventos');
                  },
                  error => {
                    this.toastr.error(`Erro ao editar: ${error}`, 'Proagil Eventos');
                  });
                  
                }
              }
            }
            
            excluirEvento(evento: Evento, template: any) {
              this.openModal(template);    
              this.evento = evento;
              this.bodyDeletarEvento = `Tem certeza que deseja excluir o Evento: ${evento.tema}, Código: ${evento.id}`;
            }
            
            confirmeDelete(template: any) {
              this.eventoService.deleteEvento(this.evento.id).subscribe(
                () => {
                  template.hide();
                  this.getEventos();
                  this.toastr.success('Deletado com sucesso', 'Proagil Eventos');
                }, error => {
                  this.toastr.error(`Erro ao deletar: ${error}`, 'Proagil Eventos');
                }
                );
              }
              
            }
            