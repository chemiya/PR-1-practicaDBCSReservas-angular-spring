package com.uva.users.modelo;

import java.time.LocalDate;
import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;
import javax.validation.constraints.Size;



//tabla para las reservas
@Entity
@Table(name = "reserva")
public class Reserva {
    @Id//id unico
    @GeneratedValue
    private int id;

    public int getId() {
      return this.id;
    }

    public void setId(int id) {
      this.id = id;
    }

    //columna con su nombre
    @Column(name="guest_name")
    @Size(max=45)
    private String guestName;

    public String getGuestName() {
      return this.guestName;
    }

    public void setGuestName(String guestName) {
      this.guestName = guestName;
    }

    @Column(name="guest_email")
    @Size(max=45)
    private String guestEmail;

    public String getGuestEmail() {
      return this.guestEmail;
    }

    public void setGuestEmail(String guestEmail) {
      this.guestEmail = guestEmail;
    }

    @Column(name="price")
    private Float price;

    public Float getPrice() {
      return this.price;
    }

    public void setPrice(Float price) {
      this.price = price;
    }

    @Column(name="units")
    private int units;

    public int getUnits() {
      return this.units;
    }

    public void setUnits(int units) {
      this.units = units;
    }

    @Column(name="num_guest")
    private int numGuest;

    public int getNumGuest() {
      return this.numGuest;
    }

    public void setNumGuest(int numGuest) {
      this.numGuest = numGuest;
    }

    @Column(name="status")
    private String status;

    public String getStatus() {
      return this.status;
    }

    public void setStatus(String status) {
      this.status = status;
    }
    

   

    @Column(name="date_in")
    private LocalDate dateIn;

    public LocalDate getDateIn() {
      return this.dateIn;
    }

    public void setDateIn(LocalDate dateIn) {
      this.dateIn = dateIn;
    }

    @Column(name="date_out")
    private LocalDate dateOut;

    public LocalDate getDateOut() {
      return this.dateOut;
    }

    public void setDateOut(LocalDate dateOut) {
      this.dateOut = dateOut;
    }

    @Column(name="created_at")
    @Temporal(TemporalType.DATE)
    private Date createdAt;

    public Date getCreatedAt() {
      return this.createdAt;
    }

    public void setCreatedAt(Date createdAt) {
      this.createdAt = createdAt;
    }

    @Column(name="updated_at")
    @Temporal(TemporalType.DATE)
    private Date updatedAt;

    public Date getUpdatedAt() {
      return this.updatedAt;
    }

    public void setUpdatedAt(Date updatedAt) {
      this.updatedAt = updatedAt;
    }

    Reserva(){

    }

    Reserva(int id, String guestName, String guestEmail, int units,Float price, int numGuest, String status, LocalDate dateIn, LocalDate dateOut, Date createdAt, Date updateAt){
      this.id=id;
      this.guestName=guestName;
      this.guestEmail=guestEmail;
      this.units=units;
      this.price=price;
      this.numGuest=numGuest;
      this.status=status;
      this.dateIn=dateIn;
      this.dateOut=dateOut;
      this.createdAt=createdAt;
      this.updatedAt=updateAt;

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
