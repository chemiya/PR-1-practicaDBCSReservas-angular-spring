package com.uva.users.excepcion;


import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;
@ResponseStatus(code = HttpStatus.UNPROCESSABLE_ENTITY)
public class ReservaExcepcion extends RuntimeException{
    public ReservaExcepcion(String mensaje) {
    super(mensaje);
}
}

