import { v4 as uuidv4 } from 'uuid';
import { Lugar } from '../interfaces/lugar';
import { Timestamp } from '@angular/fire/firestore';

export class User {
    id: string;
    firstName: string = '';
    lastName: string = '';
    email: string = '';
    password?: string = '';
    coupons: Lugar[] = []; // Campo para almacenar los cupones del usuario
    couponsUtilizados: Lugar[] = [];
    couponsVencidos: Lugar[] = [];
    cantTickets: number = 0;
    ultimoGiro: Timestamp | null = null; // Campo para almacenar la fecha y hora del último giro

    constructor(firstName: string, lastName: string, email: string, password: string, coupons?: Lugar[], couponsUtilizados?: Lugar[], couponsVencidos?: Lugar[]) {
        this.id = uuidv4(); // Genera un UUID único
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.password = password;
        this.coupons = coupons || [];
        this.couponsUtilizados = couponsUtilizados || [];
        this.couponsVencidos = couponsVencidos || [];
    }
}