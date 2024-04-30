import { v4 as uuidv4 } from 'uuid';
import { Lugar } from '../interfaces/lugar';

export class User {
    id: string;
    firstName: string = '';
    lastName: string = '';
    email: string = '';
    password?: string = '';
    coupons: Lugar[] = []; // Campo para almacenar los cupones del usuario
    couponsUtilizados: Lugar[] = [];
     constructor(firstName: string, lastName: string, email: string, password: string, coupons?: Lugar[],couponsUtilizados?: Lugar[]) {
        this.id = uuidv4(); // Genera un UUID único
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.password = password;
        this.coupons = coupons || [];
        this.couponsUtilizados = couponsUtilizados || [];
    }
}