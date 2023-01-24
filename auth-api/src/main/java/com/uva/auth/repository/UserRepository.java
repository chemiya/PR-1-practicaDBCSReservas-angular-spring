package com.uva.auth.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.uva.auth.models.User;

@Repository
public interface UserRepository extends JpaRepository<User, Integer> {
  //consultas en el repositorio
  Optional<User> findByEmail(String username);

  Boolean existsByUsername(String username);

  Boolean existsByEmail(String email);
}
