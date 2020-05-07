import { Component, OnInit } from '@angular/core';
import { PalestranteService } from '../_services/palestrante.service';
import { Palestrante } from '../_models/Palestrante';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { BsLocaleService } from 'ngx-bootstrap/datepicker'
import { defineLocale, ptBrLocale } from 'ngx-bootstrap/chronos'
import { ToastrService } from 'ngx-toastr';
defineLocale('pt-br', ptBrLocale);

@Component({
  selector: 'app-palestrantes',
  templateUrl: './palestrantes.component.html',
  styleUrls: ['./palestrantes.component.css']
})
export class PalestrantesComponent implements OnInit {
  
  titulo = 'Palestrantes';
  registerForm: FormGroup;
  file: File;
  palestrantesFiltrados: Palestrante[];
  palestrantes: Palestrante[];
  palestrante: Palestrante;
  bodyDeletarPalestrante = '';
  imagemLargura = 50;
  imagemMargem = 2;
  mostrarImagem = false;  
  dataAtual: string = '';
  _filtroLista = '';
  modoSalvar = 'post';
  fileNameToUpdate: string = '';
  
  get filtroLista(){
    return this._filtroLista;
  }
  
  set filtroLista(value: string){
    this._filtroLista = value;
    this.palestrantesFiltrados = this._filtroLista ? this.filtrarPalestrante(this._filtroLista) : this.palestrantes;
  }
  
  constructor(
    private palestranteService: PalestranteService
    , private modalService: BsModalService
    , private fb: FormBuilder
    , private localeService: BsLocaleService
    , private toastr: ToastrService
    ) { 
      this.localeService.use('pt-br');
    }
    
    ngOnInit() {
      this.validation();
      this.getPalestrantes();  
    }
    
    filtrarPalestrante(filtrarPor: string) : Palestrante[] {
      filtrarPor = filtrarPor.toLocaleLowerCase();
      return this.palestrantes.filter(w => w.nome.toLocaleLowerCase().indexOf(filtrarPor) !== -1);
    }
    
    onFileChange(event) {
      const reader = new FileReader();
      
      if (event.target.files && event.target.files.length) {
        this.file = event.target.files;
        console.log(this.file);
      }
    }
    
    validation(){
      this.registerForm = this.fb.group({      
        nome: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(50)] ],
        miniCurriculo: ['', Validators.required],
        imagemURL: ['', Validators.required], 
        telefone: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]]
      });
    }
    
    getPalestrantes() {
      this.dataAtual = new Date().getMilliseconds().toString();
      this.palestranteService.getAll().subscribe((_palestrantes: Palestrante[]) => {
        this.palestrantes = _palestrantes;
        this.palestrantesFiltrados = this.palestrantes;
        console.log(_palestrantes);
      }, error => {
        this.toastr.error(`Erro ao tentar carregar palestrantes: ${error}`, 'Proagil Eventos');
      });
    }
    
    novoPalestrante(template: any){
      this.modoSalvar = 'post';
      this.openModal(template);
    }
    
    openModal(template: any) {
      this.registerForm.reset();
      template.show();
    }
    
    alternarImagem(){
      this.mostrarImagem = !this.mostrarImagem;
    }
    
    editarPalestrante(palestrante: Palestrante, template: any){
      this.modoSalvar = 'put';
      this.openModal(template);
      this.palestrante = Object.assign({}, palestrante); // copia do elemento
      this.fileNameToUpdate = palestrante.imagemURL.toString();
      this.palestrante.imagemURL = '';      
      this.registerForm.patchValue(this.palestrante);
    }
    excluirPalestrante(palestrante: any, template: any){
      this.openModal(template);    
      this.palestrante = palestrante;
      this.bodyDeletarPalestrante = `Tem certeza que deseja excluir o Palestrante: ${palestrante.nome}, Código: ${palestrante.id}`;
    }
    salvarAlteracao(template: any){
      if (this.registerForm.valid) {
        
        if(this.modoSalvar === 'post') {
          this.palestrante = Object.assign({}, this.registerForm.value);
          
          this.uploadImagem();
          
          this.palestranteService.postPalestrante(this.palestrante).subscribe((novoPalestrante: Palestrante) => {
            console.log(this.novoPalestrante);
            template.hide();
            this.getPalestrantes();
            this.toastr.success('Inserido com sucesso', 'Proagil Palestrante');
          },
          error => {
            this.toastr.error(`Erro ao inserir: ${error}`, 'Proagil Palestrante');
          });
          
        }
        else {
          this.palestrante = Object.assign({id: this.palestrante.id}, this.registerForm.value);
          
          this.uploadImagem();
          
          this.palestranteService.updatePalestrante(this.palestrante).subscribe(() => {
            template.hide();
            this.getPalestrantes();
            this.toastr.success('Editado com sucesso', 'Proagil Palestrante');
          },
          error => {
            this.toastr.error(`Erro ao editar: ${error}`, 'Proagil Palestrante');
          });
          
        }
      }
    }
    
    confirmeDelete(template: any){
      this.palestranteService.deletePalestrante(this.palestrante.id).subscribe(() => {
        template.hide();
        this.getPalestrantes();
        this.toastr.success('Deletado com sucesso', 'Proagil Eventos');
      }, error => {
        this.toastr.error(`Erro ao deletar: ${error}`, 'Proagil Eventos');
      }
      );
    }
    
    uploadImagem() { 
      if(this.modoSalvar === 'post') {
        const nomeArquivo = this.palestrante.imagemURL.split('\\', 3);          
        this.palestrante.imagemURL = nomeArquivo[2];
        
        this.palestranteService.postUpload(this.file, nomeArquivo[2]).subscribe(() => {
          this.dataAtual = new Date().getMilliseconds().toString();
          this.getPalestrantes();
        });          
      }else{
        this.palestrante.imagemURL = this.fileNameToUpdate;
        this.palestranteService.postUpload(this.file, this.fileNameToUpdate).subscribe(() => {
          this.dataAtual = new Date().getMilliseconds().toString();
          this.getPalestrantes();
        });          
      }
    }      
  }
  