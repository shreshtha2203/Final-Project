import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  constructor(private firestore: AngularFirestore) { }

  addQuestion(question: string, response: any) {
    const timestamp = new Date();
    return this.firestore.collection('questions').add({ 
      question, 
      response, 
      timestamp 
    });
  }

  getQuestions(): Observable<any[]> {
    return this.firestore.collection('questions', ref => ref.orderBy('timestamp', 'desc')).valueChanges();
  }
}
