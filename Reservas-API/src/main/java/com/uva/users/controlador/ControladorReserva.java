package com.uva.users.controlador;

import java.util.Date;
import java.util.HashMap;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.uva.users.excepcion.ReservaExcepcion;
import com.uva.users.modelo.Disponibilidad;
import com.uva.users.modelo.Reserva;

import com.uva.users.repository.ReservaRepository;

@RestController
@RequestMapping("book")//ruta basica
@CrossOrigin(origins = "*")//para cors
public class ControladorReserva {

    //enlazamos repositorio
    private final ReservaRepository repository;

    ControladorReserva(ReservaRepository repository) {
        this.repository = repository;
    }


    //obtener todas las reservas, devuelvo array
     @GetMapping()
    public List<Reserva> getReservas() {
        List<Reserva> reservas = new ArrayList<Reserva>();

        //busca todas y por cada la añades al array para devolver
            repository.findAll().forEach(reservaVisto -> reservas.add(reservaVisto));


        return reservas;

    }

    //disponibilidad, devuelves array
      @GetMapping("/availability")
    public List<Disponibilidad> getReservaDisponibilidad() {
        List<Reserva> reservas = new ArrayList<Reserva>();
//busca todas y por cada la añades al array para devolver
        repository.findAll().forEach(reservaVisto -> reservas.add(reservaVisto));

        //array solo de las disponiblidades
        List<Disponibilidad>numeroHabitaciones=new ArrayList<Disponibilidad>();
        LocalDate hoy=LocalDate.now();
        LocalDate mesMargen=hoy.plusDays(31);
        for(LocalDate inicio=hoy; inicio.isBefore(mesMargen);inicio=inicio.plusDays(1)){
            //dia 1=25 de diciembre
            //busca reservas cuya fecha de inicio se igual o anterior al 25 de diciembre:23,24,25
            //de esas busca las que cuya fecha final sea posterior al 25 dediciembre:26,27,28
            //devuelve 10-el numero de habitaciones utilizadas de las que cumplen eso
            int maximo=10;
            for(int i=0;i<reservas.size();i++){
                Reserva comprobar=reservas.get(i);

                if(comprobar.getDateIn().isBefore(inicio) ||comprobar.getDateIn().isEqual(inicio) ){
                    if(comprobar.getDateOut().isAfter(inicio)){
                        maximo=maximo-comprobar.getUnits();
                    }
                }
            }
            
            Disponibilidad nueva=new Disponibilidad(inicio,maximo);
            numeroHabitaciones.add(nueva);

        }

        return numeroHabitaciones;

    }

    //obtener una reserva concreta
     @GetMapping(value = "/{id}")//parametro de la ruta
    public Reserva getReservaById(@PathVariable int id) {

        Reserva reserva;//la buscas en el repositorio
        if (repository.existsById(id)) {
            reserva = repository.findById(id).get();
            return reserva;

        } else {
            // si no se encuntra devuelve null
            return null;
        }

    }


    @PostMapping//crear reserva, que te llegan los valores en el cuerpo
    public String newReserva(@RequestBody Reserva newReserva) {
        //para comprobar si se puede hacer la reserva, hay que mirar que el numero de habitaciones
        //disponibles en los dias que ocupa la reserva sea mayor al numero de habitaciones que pide la reserva
        //fehca inicio reserva 4 enero, fecha final reserva 7 enero, habitaciones 3
        //miras si el 4,5,6 de enero hay de disponibilidad 3 habitaciones al menos
        try {
            //ajustas estos campos
            Date date=new Date();
            newReserva.setCreatedAt(date);
            newReserva.setStatus("Pending");

            //compruebas si hay disponibilidad para esas fechas
           List<Disponibilidad> dispons= getReservaDisponibilidad();
            boolean validez=true;
           for(int i=0;i<dispons.size();i++){
            Disponibilidad dispo=dispons.get(i);
            if(dispo.getFecha().isBefore(newReserva.getDateOut()) &&dispo.getFecha().isAfter(newReserva.getDateIn())  ){
                if(dispo.getNumero()<newReserva.getUnits()){
                    validez=false;
                }
            }

            if(dispo.getFecha().isEqual(newReserva.getDateIn()) ){
                if(dispo.getNumero()<newReserva.getUnits()){
                    validez=false;
                }
            }
            
           }


           if(validez){
            repository.save(newReserva);//guardas la reserva
            return "Nueva reserva creada";
           }else{
            return "no se ha podido crear la reserva. el numero de habitaciones solicitadas no esta disponible en esas fechas";
           }
           
        } catch (Exception e) {

            return "no se ha podido crear la reserva";
        }
    }

    //actualizar reserva, me llega el id
     @PutMapping(value = "/{id}")//coges el id de la ruta y del body los datos nuevos
    public String actualizarReservaById(@PathVariable int id, @RequestBody Reserva reserva) {
        if (repository.existsById(id)) {//buscas la reserva, pones los nuevos datos
            Reserva reservaCorrespondiente = repository.findById(id).get();

            reservaCorrespondiente.setUnits(reserva.getUnits());
            reservaCorrespondiente.setNumGuest(reserva.getNumGuest());
            reservaCorrespondiente.setStatus(reserva.getStatus());
            reservaCorrespondiente.setDateIn(reserva.getDateIn());
            reservaCorrespondiente.setDateOut(reserva.getDateOut());


            Date date=new Date();
            reservaCorrespondiente.setUpdatedAt(date);

            repository.save(reservaCorrespondiente);//guardas la reserva
            return "actualizado correctamente";
        } else {
            return "no existe ese usuario";
        }

    }

   

}
