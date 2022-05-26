export interface ComentarioConEstado {
    nombre?: string;
    color?: string;
    comentario?: string;
    idComentario?: string;
}

export interface CargaGrConDetalle {
    siniestro?: string;
    fechaAsignacion?: string;
    correo?: string;
    origen?: string;
    estadoActual?: string;
    color?: string;
    comentario?: ComentarioConEstado[];
}