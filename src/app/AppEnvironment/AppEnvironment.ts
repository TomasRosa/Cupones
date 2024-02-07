export interface AppEnvironment 
{
  production: boolean;
  recaptchaSiteKey: string;
  firebaseConfig:
  {
    apiKey: string;
    authDomain: string;
    projectId: string;
    storageBucket: string;
    messagingSenderId: string;
    appId: string;
    measurementId: string;
  };
}