import { Component, OnInit } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { FormGroup, Validators, FormBuilder, FormArray } from '@angular/forms';
import { EventoService } from 'src/app/_services/evento.service';
import { BsLocaleService } from 'ngx-bootstrap/datepicker'
import { defineLocale, ptBrLocale } from 'ngx-bootstrap/chronos'
import { ToastrService } from 'ngx-toastr';
import { Evento } from 'src/app/_models/Evento';
import { ActivatedRoute } from '@angular/router';

defineLocale('pt-br', ptBrLocale);

@Component({
  selector: 'app-evento-edit',
  templateUrl: './eventoEdit.component.html',
  styleUrls: ['./eventoEdit.component.css']
})
export class EventoEditComponent implements OnInit {
  
  titulo = 'Editar Evento';
  registerForm: FormGroup;
  evento: Evento = new Evento();
  file: File;
  dataEvento: any;
  imagemURL = 'assets/img/upload.png';
  fileNameToUpdate: string = '';
  dataAtual= '';
  
  get lotes(): FormArray {
    return <FormArray>this.registerForm.get('lotes');
  }
  
  get redesSociais(): FormArray {
    return <FormArray>this.registerForm.get('redesSociais');
  }
  
  constructor(
    private eventoService: EventoService
    , private fb: FormBuilder
    , private localeService: BsLocaleService
    , private toastr: ToastrService
    , private router: ActivatedRoute
    ) { 
      this.localeService.use('pt-br');
    }
    
    ngOnInit() {
      this.validation();
      this.carregarEvento();
    }
    
    carregarEvento() {
      const idEvento = +this.router.snapshot.paramMap.get('id'); // + convert o valor de string para number
      this.eventoService.getEventoById(idEvento).subscribe((evento: Evento)  => {
        this.evento = Object.assign({}, evento); // copia do elemento
        this.fileNameToUpdate = evento.imagemUrl.toString();
        this.imagemURL = `http://localhost:5000/resources/images/${ this.evento.imagemUrl }?_ts=${this.dataAtual}`;

        if(!this.evento.redesSociais) {
          this.evento.redesSociais = [];
        }

        this.registerForm.patchValue(this.evento);
        
        this.evento.lotes.forEach(lote => {
          this.lotes.push(this.criaLote(lote));
        });
        this.evento.redesSociais.forEach(redeSocial => {
          this.redesSociais.push(this.criaRedeSocial(redeSocial));
        });
      }
      )
    }
    
    validation() {
      this.registerForm = this.fb.group({      
        id: [],
        tema: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(50)] ],
        local: ['', Validators.required],
        dataEvento: ['', Validators.required],
        qtdPessoas: ['', [Validators.required, Validators.max(120000)]],
        imagemURL: [''], 
        telefone: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        lotes: this.fb.array([]),
        redesSociais: this.fb.array([])
      });
    }
    
    criaLote(lote: any) : FormGroup {
      return this.fb.group({
        id: [lote.id],
        nome: [lote.nome, Validators.required],
        quantidade:  [lote.quantidade, Validators.required],
        preco:  [lote.preco, Validators.required],
        dataInicio:  [lote.dataInicio],
        dataFim: [lote.dataFim] });
      }
      
      criaRedeSocial(redeSocial: any): FormGroup {
        return this.fb.group({
          id: [redeSocial.id],
          nome: [redeSocial.nome, Validators.required],
          url:  [redeSocial.url, Validators.required]
        });
      }
      
      onFileChange(file: any) {
        const reader = new FileReader();
        reader.onload = (event: any) => {
          this.imagemURL = event.target.result;          
        } 
        this.file = file.target.files;
        reader.readAsDataURL(file.target.files[0]);
      }
      
      adicionarLote() {
        this.lotes.push(this.criaLote({id: 0}));
      }
      
      adicionaRedeSocial() {
        this.redesSociais.push(this.criaRedeSocial({id: 0}));
      }
      
      removerLote(id: number) {
        this.lotes.removeAt(id);
      }
      
      removerRedeSocial(id: number) {
        this.redesSociais.removeAt(id);
      }
      
      
      salvarEvento() {
        this.evento = Object.assign({id: this.evento.id}, this.registerForm.value);
        this.evento.imagemUrl = this.fileNameToUpdate;
        this.uploadImagem();
        console.log(this.evento);
        this.eventoService.updateEvento(this.evento).subscribe(() => {
          this.toastr.success('Editado com sucesso', 'Proagil Eventos');
        },
        error => {
          this.toastr.error(`Erro ao editar: ${error}`, 'Proagil Eventos');
        });
      }
      
      uploadImagem() {
        if(this.registerForm.get('imagemURL').value !== ''){
          
          this.eventoService.postUpload(this.file, this.fileNameToUpdate).subscribe(() => {
            this.dataAtual = new Date().getMilliseconds().toString();
            this.imagemURL = `http://localhost:5000/resources/images/${ this.evento.imagemUrl }?_ts=${this.dataAtual}`;
          });     
        }
      }  
    }