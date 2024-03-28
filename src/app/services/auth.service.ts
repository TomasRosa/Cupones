import { Injectable } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, signInWithPopup,GoogleAuthProvider} from '@angular/fire/auth';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private userSubject = new BehaviorSubject<boolean>(false);
  private userDataSubject = new BehaviorSubject<any>(null);

  constructor(private auth: Auth) {
    this.auth.onAuthStateChanged(user => {
      if (user) {
        this.setUserLoggedIn(false); // Emitir false si el usuario no está autenticado
      } else {
        this.setUserLoggedIn(true); // Emitir true si el usuario está autenticado
      }
    });
  }
  getName(): Observable<string | null> {
    return this.userDataSubject.pipe(map(userData => userData ? userData.name : null));
  }

  getLastName(): Observable<string | null> {
    return this.userDataSubject.pipe(map(userData => userData ? userData.lastName : null));
  }

  getEmail(): Observable<string | null> {
    return this.userDataSubject.pipe(map(userData => userData ? userData.email : null));
  }
  register(email: any, password: any)
  {
    return createUserWithEmailAndPassword(this.auth,email,password);
  }
  login(email: any, password: any)
  {
    return signInWithEmailAndPassword(this.auth,email,password);
  }
  loginWithGoogle()
  {
    return signInWithPopup(this.auth, new GoogleAuthProvider);
  }
  logout()
  {
    return signOut(this.auth);
  }
  isLoggedIn(): Observable<boolean> {
    return this.userSubject.asObservable();
  }
  setUserLoggedIn(value: boolean) {
    this.userSubject.next(value);
} 
}
