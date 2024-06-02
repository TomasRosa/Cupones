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
  runTransaction,
  getDoc,
  Timestamp
} from "@angular/fire/firestore";
import { Observable, from } from "rxjs";
import { map } from "rxjs/operators";
import { User } from "../models/user";
import { Lugar } from "../interfaces/lugar";

const PATH = "users";

@Injectable({
  providedIn: "root",
})
export class FirestoreService {
  constructor(private firestore: Firestore) {}

  private _collection = collection(this.firestore, PATH);

  async getUltimoGiro(userId: string): Promise<Date | null> {
    const userDoc = doc(this.firestore, PATH, userId);
    const docSnapshot = await getDoc(userDoc);
    const userData = docSnapshot.data() as User;
    return userData.ultimoGiro;
  }

  // Método para actualizar el campo 'ultimoGiro' de un usuario
  async updateUltimoGiro(userId: string, ultimoGiro: Date): Promise<void> {
    const userDoc = doc(this.firestore, PATH, userId);
    await updateDoc(userDoc, { ultimoGiro });
  }

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
  updateCantTicket(cantTickets: number, userId: string): Promise<void>
  {
    const userRef = doc(this.firestore,PATH,userId);

    return updateDoc(userRef,{ cantTickets })
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
  getUserCupones(
    userId: string
  ): Observable<{ disponibles: Lugar[]; utilizados: Lugar[], vencidos: Lugar[] }> {
    const userCollectionRef = collection(this.firestore, PATH);
    const userQuery = query(userCollectionRef, where("id", "==", userId));

    return from(getDocs(userQuery)).pipe(
      map((querySnapshot: QuerySnapshot<DocumentData>) => {
        if (!querySnapshot.empty) {
          const userData = querySnapshot.docs[0].data() as DocumentData;
          const cuponesDisponibles: Lugar[] = userData["coupons"] || [];
          const cuponesUtilizados: Lugar[] =
            userData["couponsUtilizados"] || [];
          const cuponesVencidos: Lugar[] = 
            userData["couponsVencidos"] || [];

          // Convertir Timestamp a Date para cada cupón
          const cuponesDisponiblesFormateados = cuponesDisponibles.map(
            (cupon: Lugar) => {
              const fechaObtenido = cupon.fechaObtenido;
              if (fechaObtenido instanceof Timestamp) {
                return {
                  ...cupon,
                  fechaObtenido: fechaObtenido.toDate(),
                };
              } else {
                return cupon;
              }
            }
          );

          const cuponesUtilizadosFormateados = cuponesUtilizados.map(
            (cupon: Lugar) => {
              const fechaObtenido = cupon.fechaObtenido;
              if (fechaObtenido instanceof Timestamp) {
                return {
                  ...cupon,
                  fechaObtenido: fechaObtenido.toDate(),
                };
              } else {
                return cupon;
              }
            }
          );

          const cuponesVencidosFormateados = cuponesVencidos.map(
            (cupon: Lugar) =>{
              const fechaObtenido = cupon.fechaObtenido;
              if(fechaObtenido instanceof Timestamp)
                {
                  return{
                    ...cupon,
                    fechaObtenido: fechaObtenido.toDate(),
                  };
                }
              else
              {
                return cupon;
              }
            }
          );

          return {
            disponibles: cuponesDisponiblesFormateados,
            utilizados: cuponesUtilizadosFormateados,
            vencidos: cuponesVencidosFormateados
          };
        } else {
          return {
            disponibles: [], // El usuario no tiene cupones disponibles
            utilizados: [], // El usuario no tiene cupones utilizados
            vencidos: []
          };
        }
      })
    );
  }
  addCouponToUserUtilizados(
    userId: string,
    coupon: Lugar,
    cuponesDisponibles: Lugar[]
  ): Promise<void> {
    const userRef = doc(this.firestore, PATH, userId);

    // Usa runTransaction para ejecutar la transacción
    return runTransaction(this.firestore, async (transaction) => {
      const userDoc = await transaction.get(userRef);

      if (!userDoc.exists()) {
        throw new Error("Usuario no encontrado en Firestore.");
      }

      const userData = userDoc.data();

      // Agregar el cupón a la lista de utilizados
      const cuponesUtilizados = [
        ...(userData?.["couponsUtilizados"] || []),
        coupon,
      ];

      // Eliminar el cupón de la lista de disponibles
      cuponesDisponibles = cuponesDisponibles.filter((c) => c !== coupon);

      // Actualizar el documento del usuario en Firestore
      transaction.update(userRef, {
        couponsUtilizados: cuponesUtilizados,
        coupons: cuponesDisponibles, // Actualizar la lista de cupones disponibles en Firestore
      });
      return;
    });
  }
  checkEmailExists(email: string): Observable<boolean> {
    const usersRef = collection(this.firestore, PATH);
    const userQuery = query(usersRef, where("email", "==", email));
      
    return from(getDocs(userQuery)).pipe(
      map((snapshot: QuerySnapshot<DocumentData>) => {
        console.log("Snapshot:", snapshot); // Agrega este console.log para ver el contenido del snapshot
        return snapshot.size > 0; // Devuelve true si hay al menos un documento coincidente
      })
    );
  }
  moverCuponesVencidos(userId: string, cuponesVencidos: Lugar[]): Promise<void> {
    const userRef = doc(this.firestore, PATH, userId);
  
    // Usa runTransaction para ejecutar la transacción
    return runTransaction(this.firestore, async (transaction) => {
      const userDoc = await transaction.get(userRef);
  
      if (!userDoc.exists()) {
        throw new Error("Usuario no encontrado en Firestore.");
      }
  
      const userData = userDoc.data();
  
      // Agregar los cupones vencidos a la lista de cupones vencidos
      const cuponesVencidosActualizados = [
        ...(userData?.["couponsVencidos"] || []),
        ...cuponesVencidos,
      ];
  
      // Filtrar los cupones disponibles para eliminar los vencidos
      const cuponesDisponiblesActualizados = (userData?.["coupons"] || []).filter(
        (cupon: Lugar) => !cuponesVencidos.includes(cupon)
      );
  
      // Actualizar el documento del usuario en Firestore
      transaction.update(userRef, {
        couponsVencidos: cuponesVencidosActualizados,
        coupons: cuponesDisponiblesActualizados, // Actualizar la lista de cupones disponibles en Firestore
      });
      return;
    });
  }
}
