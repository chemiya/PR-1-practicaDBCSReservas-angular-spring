package com.uva.auth.controllers;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


import com.uva.auth.models.User;
import com.uva.auth.payload.request.LoginRequest;
import com.uva.auth.payload.request.SignupRequest;
import com.uva.auth.payload.response.JwtResponse;
import com.uva.auth.payload.response.MessageResponse;

import com.uva.auth.repository.UserRepository;
import com.uva.auth.security.jwt.JwtUtils;
import com.uva.auth.security.services.UserDetailsImpl;

@CrossOrigin(origins = "*", maxAge = 3600)//para lo de cors
@RestController
@RequestMapping("/api/auth")//ruta de las peticiones
public class AuthController {
  //enlazamos con todos estos servicios
  @Autowired
  AuthenticationManager authenticationManager;

  @Autowired
  UserRepository userRepository;



  @Autowired
  PasswordEncoder encoder;

  @Autowired
  JwtUtils jwtUtils;

  //me llega peticion de login
  @PostMapping("/signin")//de entrada me llega una peticion de login
  public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {

    //realiza comprobacion
    Authentication authentication = authenticationManager.authenticate(
        new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword()));

    SecurityContextHolder.getContext().setAuthentication(authentication);
    String jwt = jwtUtils.generateJwtToken(authentication);
    
    UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal(); 
    
    

        //devuelve una respuesta
    return ResponseEntity.ok(new JwtResponse(jwt, 
                         userDetails.getId(), 
                         userDetails.getUsername(), 
                         userDetails.getEmail(), 
                         userDetails.getRole()));
  }


  //me llega peticion de registro
  @PostMapping("/signup")//me llega el objeto de una peticion de registro
  public ResponseEntity<?> registerUser(@Valid @RequestBody SignupRequest signUpRequest) {


    // crea el usuario con los datos
    User user = new User(signUpRequest.getUsername(), 
               signUpRequest.getEmail(),
               encoder.encode(signUpRequest.getPassword()));


    user.setRole("HOST");//asigno el rol
    userRepository.save(user);//guardo el usuario

    return ResponseEntity.ok(new MessageResponse("User registered successfully!"));
  }
}
