import { cargaGr } from "./cargaGr";


    export interface EstadoComentario{
        id:number
    }
    export interface CargaComentario {
        id: string;
    }

    export interface Comentario {
        comentario: string;
        fecha:string;
        cargas: CargaComentario[];
    }
