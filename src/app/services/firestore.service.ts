import { Injectable } from '@angular/core';
import { Firestore, collection, query, where, getDocs, DocumentData, QuerySnapshot, addDoc } from '@angular/fire/firestore';
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
}