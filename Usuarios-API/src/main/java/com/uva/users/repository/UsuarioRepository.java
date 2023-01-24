package com.uva.users.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;

import com.uva.users.modelo.Usuario;



public interface UsuarioRepository extends JpaRepository<Usuario, Integer> {
    
    //query para buscar segun enabled
    @Query(value="SELECT * FROM users u WHERE u.enabled = ?1 ", nativeQuery = true)
    List<Usuario> findByEnabled(boolean enabled);
   

    //query para buscar nombre igual
    @Query(value="select * from users u where u.username=?1", nativeQuery = true)
    List<Usuario> findByName(String name);

     //query para buscar email igual
    @Query(value="select * from users u where u.email=?1", nativeQuery = true)
    List<Usuario> findByEmail(String email);

    @Query(value="select * from users u where u.username=?1 and u.password=?2", nativeQuery = true)
    List<Usuario> findByIdentificacion(String email,String contrasena);



}
