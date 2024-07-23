import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes), provideFirebaseApp(() => initializeApp({"projectId":"danotes-22828","appId":"1:757017648839:web:555dcb1155db0b58f7e8e2","storageBucket":"danotes-22828.appspot.com","apiKey":"AIzaSyBY9fb28i105RNxFn9ebrRRiP87PWntq8g","authDomain":"danotes-22828.firebaseapp.com","messagingSenderId":"757017648839"})), provideFirestore(() => getFirestore())]
};
