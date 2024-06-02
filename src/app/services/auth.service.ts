import { Injectable } from "@angular/core";
import {
  Auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  signInWithPopup,
  GoogleAuthProvider,
  User,
  updateProfile,
  sendPasswordResetEmail,
} from "@angular/fire/auth";
import { BehaviorSubject, Observable, from, map, of, switchMap } from "rxjs";
import { FirestoreService } from "./firestore.service";
import { Lugar } from "../interfaces/lugar";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  private userSubject = new BehaviorSubject<boolean>(false);
  currentUser: User | null = null; // Propiedad para almacenar el usuario actual

  constructor(private auth: Auth, private firestore: FirestoreService) {
    // Observador para el estado de autenticación global
    this.auth.onAuthStateChanged((user: User | null) => {
      if (user) {
        this.currentUser = user; // Almacenar el usuario actual
        this.setUserLoggedIn(true);
      } else {
        this.currentUser = null; // Restablecer el usuario actual
        this.setUserLoggedIn(false);
      }
    });
  }
  async getUltimoGiro(): Promise<Date | null> {
    if (!this.currentUser) {
      return null;
    }
    const userId = this.currentUser.uid;
    return this.firestore.getUltimoGiro(userId);
  }

  async updateUltimoGiro(ultimoGiro: Date): Promise<void> {
    if (!this.currentUser) {
      throw new Error("No hay usuario autenticado.");
    }
    const userId = this.currentUser.uid;
    await this.firestore.updateUltimoGiro(userId, ultimoGiro);
  }

  getCantTickets(): Observable<number | null> {
    return this.getUserId().pipe(
      switchMap((userId) => {
        if (userId) {
          return this.firestore
            .getUserData(userId)
            .pipe(map((userData) => (userData ? userData.cantTickets : null)));
        } else {
          return of(null);
        }
      })
    );
  }
  sendPasswordResetEmail(email: string): Observable<void> {
    return from(sendPasswordResetEmail(this.auth, email));
  }
  addCouponToUser(coupon: Lugar): Promise<void> {
    const currentUser = this.auth.currentUser;
    if (currentUser) {
      return from(this.firestore.getUserIdByEmail(currentUser.email!))
        .pipe(
          switchMap((userId) => {
            if (userId) {
              return this.firestore.addCouponToUser(userId, coupon);
            } else {
              return Promise.reject(
                "No se encontró la ID del usuario en Firestore."
              );
            }
          })
        )
        .toPromise();
    } else {
      return Promise.reject("No hay usuario autenticado.");
    }
  }
  updateCantTickets(cantTickets: number): Promise<void> {
    const currentUser = this.auth.currentUser;
    if (currentUser) {
      return this.firestore.
      getUserIdByEmail(currentUser.email!).
      pipe(
        switchMap((userId) => {
          if (userId) {
            return this.firestore.updateCantTicket(cantTickets, userId);
          } 
          else 
          {
            return Promise.reject(
              "No se encontró la ID del usuario en Firestore."
            );
          }
        })
      ).toPromise();
    }
    else 
    {
      return Promise.reject("No se encontró un usuario autenticado.");
    }
  }
  actualizarDatosUsuario(firstName: string, lastName: string): Promise<void> {
    const currentUser = this.auth.currentUser;
    if (currentUser) {
      return updateProfile(currentUser, {
        displayName: firstName + " " + lastName,
      })
        .then(() => {
          // Obtener la ID del usuario desde Firestore
          return this.firestore
            .getUserIdByEmail(currentUser.email!)
            .pipe(
              switchMap((userId) => {
                if (userId) {
                  // Actualizar datos del usuario en Firestore usando la ID obtenida
                  return this.firestore.actualizarDatosUsuario(
                    userId,
                    firstName,
                    lastName
                  );
                } else {
                  return Promise.reject(
                    "No se encontró la ID del usuario en Firestore."
                  );
                }
              })
            )
            .toPromise();
        })
        .catch((error: any) => {
          console.error(
            "Error al actualizar datos de usuario en Firebase Auth:",
            error
          );
          throw error;
        });
    } else {
      return Promise.reject("No se encontró un usuario autenticado.");
    }
  }
  getName(): Observable<string | null> {
    return this.getUserId().pipe(
      switchMap((userId) => {
        if (userId) {
          return this.firestore
            .getUserData(userId)
            .pipe(map((userData) => (userData ? userData.firstName : null)));
        } else {
          return of(null);
        }
      })
    );
  }
  getLastName(): Observable<string | null> {
    return this.getUserId().pipe(
      switchMap((userId) => {
        if (userId) {
          return this.firestore
            .getUserData(userId)
            .pipe(map((userData) => (userData ? userData.lastName : null)));
        } else {
          return of(null);
        }
      })
    );
  }

  getEmail(): Observable<string | null> {
    return this.getUserId().pipe(
      switchMap((userId) => {
        if (userId) {
          return this.firestore
            .getUserData(userId)
            .pipe(map((userData) => (userData ? userData.email : null)));
        } else {
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
  async getNextSpinTime(): Promise<number> {
    const userId = await this.getUserId().toPromise(); // Convertir el observable a una promesa

    if (userId) {
      // Obtener el último tiempo de giro del usuario desde Firestore
      const lastSpinTime = await this.firestore.getUltimoGiro(userId);
      if (lastSpinTime) {
        // Calcular el próximo tiempo de giro sumando 24 horas al último tiempo de giro
        const nextSpinTime = lastSpinTime.getTime() + (24 * 60 * 60 * 1000);
        return nextSpinTime;
      }
    }
    
    // Si no se puede obtener el usuario o su último giro, devolver el tiempo actual
    return new Date().getTime();
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
  isLoggedIn(): Observable<boolean> {
    return this.userSubject.asObservable();
  }
  setUserLoggedIn(value: boolean) {
    // Actualizar el estado del usuario solo si es necesario
    if (this.userSubject.getValue() !== value) {
      this.userSubject.next(value);
    }
  }

  register(email: any, password: any) {
    return createUserWithEmailAndPassword(this.auth, email, password);
  }
  login(email: any, password: any) {
    return signInWithEmailAndPassword(this.auth, email, password);
  }
  loginWithGoogle() {
    return signInWithPopup(this.auth, new GoogleAuthProvider());
  }
  logout() {
    return signOut(this.auth);
  }
}
