package com.uva.users.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;

import com.uva.users.modelo.Reserva;




public interface ReservaRepository extends JpaRepository<Reserva, Integer> {
    


//consulta al repositorio con select
    @Query(value="select * from reserva r where r.guest_name=?1 ", nativeQuery = true)
    List<Reserva> findByGuestName(String name);



}
