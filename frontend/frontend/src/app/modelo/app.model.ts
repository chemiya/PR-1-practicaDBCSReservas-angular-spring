export interface Usuario {//clase para el usuario con number, string,boolean, date
    id:Number,
    name: String,   
    firstName: String,
    lastName: String,
    email: String,
    password: String,
    enabled: boolean,
    role:String,
    createdAt:Date,
    updatedAt:Date
    }

export interface Reserva{//clase para el reserva con number, string,boolean, date
    id:number,
    guestName:string;
    guestEmail:string;
    price:number,
    units:number;
    numGuest:number,
    status:String,
    dateIn:Date,
    dateOut:Date,
    createdAt:Date,
    updatedAt:Date

}

export interface Disponibilidad{//clase para el disponibilidad con number y date
    fecha:Date,
    numero:number
}

