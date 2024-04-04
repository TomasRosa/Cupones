import { Injectable } from '@angular/core';
 import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, signInWithPopup,GoogleAuthProvider, User} from '@angular/fire/auth';
import { BehaviorSubject, Observable,map,of, switchMap } from 'rxjs';
import { FirestoreService } from './firestore.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private userSubject = new BehaviorSubject<boolean>(false);

 constructor(private auth: Auth,
              private firestore: FirestoreService) {
    // Observador para el estado de autenticación global
    this.auth.onAuthStateChanged((user: User | null) => {
      if (user) {
        this.setUserLoggedIn(true);
      } else {
        this.setUserLoggedIn(false);
      }
    });
  }

  getName(): Observable<string | null> {
    return this.getUserId().pipe(
      switchMap(userId => {
        if (userId) {
          return this.firestore.getUserData(userId).pipe(
            map(userData => userData ? userData.firstName : null)
          );
        } else {
          return of(null);
        }
      })
    );
  }
  getEmail(): Observable<string | null> {
    return this.getUserId().pipe(
      switchMap(userId => {
        if(userId)
        {
          return this.firestore.getUserData(userId).pipe(
            map(userData => userData ? userData.email : null)
          );
        }
        else
        {
          return of(null);
        }
      })
    );
  }
  checkFirstTimeGoogleLogin(): Observable<boolean> {
    // Comprueba si el usuario actual ha iniciado sesión con Google
    return new Observable<boolean>((observer) => {
      const currentUser = this.auth.currentUser;
      if (currentUser) {
        const isGoogleUser = currentUser.providerData
          .some(provider => provider.providerId === 'google.com');
        observer.next(isGoogleUser);
        observer.complete();
      } else {
        observer.next(false);
        observer.complete();
      }
    });
  }

  getNameFromGoogle(): Observable<string | null> {
    // Obtén el nombre del usuario actual si ha iniciado sesión con Google
    const currentUser = this.auth.currentUser;
    if (currentUser) {
      return of(currentUser.displayName ?? null);
    } else {
      return of(null);
    }
  }
  getUserId(): Observable<string | null> {
    const currentUser = this.auth.currentUser;
    if (currentUser) {
      const uid = currentUser.uid;
      return of(uid);
    } else {
      return of(null);
    }
  }
  
  isLoggedIn(): Observable<boolean> {
    return this.userSubject.asObservable();
  }

  setUserLoggedIn(value: boolean) {
    // Actualizar el estado del usuario solo si es necesario
    if (this.userSubject.getValue() !== value) {
      this.userSubject.next(value);
    }
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
