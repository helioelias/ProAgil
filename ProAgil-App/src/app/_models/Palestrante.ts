import { RedeSocial } from './RedeSocial';
import { Evento } from './Evento';

export class Palestrante {

    constructor() { }
    id: number;
    nome: string;
    miniCurriculo: string;
    imagemURL: string;
    telefone: string;
    email: string;
    redesSociais: RedeSocial[];
    palestrantesEventos: Evento[];
}
