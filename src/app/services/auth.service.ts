import { Injectable } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, signInWithPopup,GoogleAuthProvider, User} from '@angular/fire/auth';
import { BehaviorSubject, Observable,of, switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private userSubject = new BehaviorSubject<boolean>(false);

  constructor(private auth: Auth) {
    this.auth.onAuthStateChanged(user => {
      if (user) {
        this.setUserLoggedIn(true); // Emitir false si el usuario no está autenticado
      } else {
        this.setUserLoggedIn(false); // Emitir true si el usuario está autenticado
      }
    });
  }

  getName(): Observable<string | null> {
    return of(this.auth.currentUser).pipe(
      switchMap((user: User | null) => {
        if (user) {
          return of(user.displayName ?? null);
        } else {
          return of(null);
        }
      })
    );
  }

  getEmail(): Observable<string | null> {
    return of(this.auth.currentUser).pipe(
      switchMap((user: User | null) => {
        if (user) {
          return of(user.email ?? null);
        } else {
          return of(null);
        }
      })
    );
  }

  isLoggedIn(): Observable<boolean> {
    return this.userSubject.asObservable();
  }
  setUserLoggedIn(value: boolean) {
    this.userSubject.next(value);
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
}
