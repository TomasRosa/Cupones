import { v4 as uuidv4 } from 'uuid';

export class User {
    id: string;
    firstName: string = '';
    lastName: string = '';
    email: string = '';
    password?: string = '';

    constructor(firstName: string, lastName: string, email: string, password: string) {
        this.id = uuidv4(); // Genera un UUID único
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.password = password;
    }
}