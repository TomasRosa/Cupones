export class User 
{
    firstName:string ='';
    lastName:string ='';
    email: string ='';
    password: string='';
    dni: string ='';

    constructor(firstName: string, lastName: string, email: string, password: string, dni: string)
    {
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.password = password;
        this.dni = dni;
    }
}
