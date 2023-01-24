package com.uva.users.modelo;

import java.time.LocalDate;

//clase para la siponiblidad que no se guarda en la base de datos
public class Disponibilidad {
    private LocalDate fecha;

    public LocalDate getFecha() {
        return this.fecha;
    }

    public void setFecha(LocalDate fecha) {
        this.fecha = fecha;
    }

    private int numero;

    public int getNumero() {
        return this.numero;
    }

    public void setNumero(int numero) {
        this.numero = numero;
    }


    public Disponibilidad(LocalDate fecha,int numero){
        this.fecha=fecha;
        this.numero=numero;
    }

}
