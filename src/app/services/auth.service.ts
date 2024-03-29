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
    this.auth.onAuthStateChanged((user: User | null) => {
      if (!user) {
        this.setUserLoggedIn(true); // Emitir true si el usuario está autenticado
      } else {
        this.setUserLoggedIn(false); // Emitir false si el usuario no está autenticado
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
