import { Injectable } from '@angular/core';
import { Firestore, collection, query, where, getDocs, DocumentData, QuerySnapshot, addDoc, doc, updateDoc } from '@angular/fire/firestore';
import { Observable, from } from 'rxjs';
import { map } from 'rxjs/operators';
import { User } from '../models/user';

const PATH = 'users';

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {
  
  constructor(private firestore: Firestore) { }

  private _collection = collection(this.firestore, PATH);

  createUser(user: User) {
    return addDoc(this._collection, user);
  }
  getUserData(userId: string): Observable<User | null> {
    const userQuery = query(collection(this.firestore, PATH), where('id', '==', userId));
    
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
  actualizarDatosUsuario(userId: string, firstName: string, lastName: string): Promise<void> {
    const userRef = doc(this.firestore, PATH, '2Xj9mUpbPJZKKjeL4l59');
    
    return updateDoc(userRef, { firstName, lastName })
      .then(() => {
        console.log('Datos actualizados en Firestore.');
      })
      .catch(error => {
        console.error('Error al actualizar los datos en Firestore:', error);
        throw error;
      });
  }
  getUserIdByEmail(email: string): Observable<string | null> {
    const userQuery = query(collection(this.firestore, PATH), where('email', '==', email));

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

}