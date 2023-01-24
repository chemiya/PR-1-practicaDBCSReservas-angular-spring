package com.uva.auth.models;

import java.util.Date;
import java.util.HashSet;
import java.util.Set;

import javax.persistence.*;
import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;

@Entity
@Table(name = "users")//nombre de la tabla
public class User {
    @Id//Id unico
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    //columnas con su nombre y si son unicas
    @Column(unique=true,name="username")
    @Size(max=45)
    private String username;

    @Column(name="first_name")
    @Size(max=45)
    private String firstName;

    @Column(name="last_name")
    @Size(max=45)
    private String lastName;

    @Column(unique=true,name="email")
    @Size(max=45)
    private String email;

    @Column(name="password")
    @Size(max=150)
    private String password;

    @Column(name="enabled")
    private boolean enabled;

    @Column(name="role")
    private String role;

    //columna de hora y fecha
    @Column(name="created_at")
    @Temporal(TemporalType.DATE)
    private Date createdAt;

    @Column(name="updated_at")
    @Temporal(TemporalType.DATE)
    private Date updatedAt;

    public Integer getId() {
        return this.id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getUsername() {
        return this.username;
    }

    public void setUsername(String name) {
        this.username = name;
    }

    public String getFirstName() {
        return this.firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return this.lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public String getEmail() {
        return this.email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return this.password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public boolean isEnabled() {
        return this.enabled;
    }

    public void setEnabled(boolean enabled) {
        this.enabled = enabled;
    }

    public String getRole() {
        return this.role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public Date getCreatedAt() {
        return this.createdAt;
    }

    public void setCreatedAt(Date createdAt) {
        this.createdAt = createdAt;
    }

    public Date getUpdatedAt() {
        return this.updatedAt;
    }

    public void setUpdatedAt(Date updatedAt) {
        this.updatedAt = updatedAt;
    }

    //constructor vacio y con parametros
    User(){

    }

    public User( String username, String email,String password){
   
        this.username=username;
       
        this.email=email;
        this.password=password;
       
    }

}


/*
{
"name":"cdhes22dd222223",
  "firstName":"chema",
   "lastName":"lozano",
   "email":"csshss1322@gmail.com",
   "password":"cont1234",
  "role":0,
  "enabled":true,
  "createdAt":"2017-04-03",
  "updatedAt":"2017-03-03"
  
  
}




*/ 
