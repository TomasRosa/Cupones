import { Injectable } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, signInWithPopup,GoogleAuthProvider} from '@angular/fire/auth';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService 
{
  user: Observable<any>;

  constructor(private auth: Auth) {
    this.user = new Observable<any>((observer) => {
      const unsubscribe = this.auth.onAuthStateChanged(
        (user) => {
          observer.next(user);
        },
        (error) => {
          observer.error(error);
        },
        () => {
          observer.complete();
        }
      );
      return () => {
        unsubscribe();
      };
    });
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
    return this.user.pipe(map(user => !!user));
  }
}
