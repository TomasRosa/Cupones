import { Injectable } from '@angular/core';
import { Firestore, addDoc, collection,} from '@angular/fire/firestore';
import { User } from '../models/user';

const PATH = 'users';

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {
  
  constructor(private firestore: Firestore) { }

  private _collection = collection(this.firestore,PATH);

  createUser(user: User)
  {
    return addDoc(this._collection,user);
  }
}

