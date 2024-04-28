import { Injectable } from "@angular/core";
import {
  Firestore,
  collection,
  query,
  where,
  getDocs,
  DocumentData,
  QuerySnapshot,
  addDoc,
  doc,
  updateDoc,
  arrayUnion,
} from "@angular/fire/firestore";
import { Observable, from } from "rxjs";
import { map } from "rxjs/operators";
import { User } from "../models/user";
import { Lugar } from "../interfaces/lugar";
import { Timestamp } from "@angular/fire/firestore";

const PATH = "users";

@Injectable({
  providedIn: "root",
})
export class FirestoreService {

  constructor(private firestore: Firestore) {}

  private _collection = collection(this.firestore, PATH);

  createUser(user: User) {
    return addDoc(this._collection, user);
  }
  getUserData(userId: string): Observable<User | null> {
    const userQuery = query(
      collection(this.firestore, PATH),
      where("id", "==", userId)
    );

    return from(getDocs(userQuery)).pipe(
      map((snapshot: QuerySnapshot<DocumentData>) => {
        if (snapshot.empty) {
          return null; // User not found
        } else {
          const userData = snapshot.docs[0].data() as User;
          return userData;
        }
      })
    );
  }
  actualizarDatosUsuario(
    userId: string,
    firstName: string,
    lastName: string
  ): Promise<void> {
    const userRef = doc(this.firestore, PATH, userId);

    return updateDoc(userRef, { firstName, lastName })
      .then(() => {
        console.log("Datos actualizados en Firestore.");
      })
      .catch((error) => {
        console.error("Error al actualizar los datos en Firestore:", error);
        throw error;
      });
  }
  addCouponToUser(userId: string, coupon: Lugar): Promise<void> {
    const userRef = doc(this.firestore, PATH, userId);
    console.log(userId);
    return updateDoc(userRef, {
      coupons: arrayUnion(coupon), // Agrega el cupón al arreglo de cupones del usuario
    })
      .then(() => {
        console.log("Cupón agregado al usuario en Firestore.");
      })
      .catch((error) => {
        console.error(
          "Error al agregar el cupón al usuario en Firestore:",
          error
        );
        throw error;
      });
  }
  getUserIdByEmail(email: string): Observable<string | null> {
    const userQuery = query(
      collection(this.firestore, PATH),
      where("email", "==", email)
    );

    return from(getDocs(userQuery)).pipe(
      map((snapshot: QuerySnapshot<DocumentData>) => {
        if (snapshot.empty) {
          return null; // User not found
        } else {
          const userId = snapshot.docs[0].id;
          return userId;
        }
      })
    );
  }
  getUserCupones(userId: string): Observable<Lugar[]> {
    const userCollectionRef = collection(this.firestore, PATH);
    const userQuery = query(userCollectionRef, where('id', '==', userId));
  
    return from(getDocs(userQuery)).pipe(
      map((querySnapshot: QuerySnapshot<DocumentData>) => {
        if (!querySnapshot.empty) {
          const userData = querySnapshot.docs[0].data() as DocumentData;
          const cupones: Lugar[] = userData['coupons'] || [];
          
          // Convertir Timestamp a Date para cada cupón
          return cupones.map((cupon: Lugar) => {
            const fechaObtenido = cupon.fechaObtenido;
            if (fechaObtenido instanceof Timestamp) {
              return {
                ...cupon,
                fechaObtenido: fechaObtenido.toDate()
              };
            } else {
              return cupon;
            }
          });
        } else {
          return []; // El usuario no tiene cupones
        }
      })
    );
  } 
}
