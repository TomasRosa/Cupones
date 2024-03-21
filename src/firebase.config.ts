import { EnvironmentProviders, importProvidersFrom } from '@angular/core';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { __makeTemplateObject } from 'tslib';

const firebaseProviders: EnvironmentProviders = importProvidersFrom(
    provideFirebaseApp(() => 
    initializeApp({
      "projectId":"gocupon-4545b",
      "appId":"1:602761522123:web:703abc63c01fb10fd7a44e",
      "storageBucket":"gocupon-4545b.appspot.com",
      "apiKey":"AIzaSyBSNkBPhkh7Ie6_SJYN85iS-TuORaworlU",
      "authDomain":"gocupon-4545b.firebaseapp.com",
      "messagingSenderId":"602761522123"
    }),
    ),
    provideFirestore(() => getFirestore()),
    provideAuth(() => getAuth())
); 

export { firebaseProviders };