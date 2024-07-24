import { Injectable, inject } from '@angular/core';
import {
  Firestore,
  collection,
  doc,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  orderBy,
  limit,
  where,
  query,
} from '@angular/fire/firestore';
import { Note } from '../interfaces/note.interface';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class NoteListService {
  trashNotes: Note[] = [];
  normalNotes: Note[] = [];
  normalMarkedNotes: Note[] = [];

  firestore: Firestore = inject(Firestore);

  unsubTrash;
  unsubNotes;
  unsubMarkedNotes;

  constructor() {
    this.unsubNotes = this.subNotesList();
    this.unsubMarkedNotes = this.subMarkedNotesList();
    this.unsubTrash = this.subTrashList();
  }

  async addNote(item: Note, colId: 'notes' | 'trash') {
    console.log('addNote');

    if (colId == 'notes') {
      await addDoc(this.getNotesRef(), item)
        .catch((err) => {
          console.error(err);
        })
        .then((docRef) => {
          console.log('Document written with ID:', docRef?.id);
        });
    } else {
      await addDoc(this.getTrashRef(), item)
        .catch((err) => {
          console.error(err);
        })
        .then((docRef) => {
          console.log('Document written with ID:', docRef?.id);
        });
    }
  }

  async updateNote(note: Note) {
    if (note.id) {
      let docRef = this.getSingleDocRef(this.getColIdFromNote(note), note.id);
      await updateDoc(docRef, this.getCleanJson(note)).catch((err) => {
        console.log(err);
      });
    }
  }

  async deleteNote(colId: 'notes' | 'trash', docId: string) {
    console.log('async deleteNote');

    await deleteDoc(this.getSingleDocRef(colId, docId)).catch((err) => {
      console.log(err);
    });
  }

  getCleanJson(note: Note): {} {
    return {
      type: note.type,
      title: note.title,
      content: note.content,
      marked: note.marked,
    };
  }

  getColIdFromNote(note: Note) {
    if (note.type == 'note') {
      return 'notes';
    } else {
      return 'trash';
    }
  }

  setNoteObject(obj: any, id: string): Note {
    return {
      id: id || '',
      type: obj.type || 'note',
      title: obj.title || '',
      content: obj.content || '',
      marked: obj.marked || false,
    };
  }

  ngOnDestroy() {
    this.unsubTrash();
    this.unsubNotes();
    this.unsubMarkedNotes();
  }

  subTrashList() {
    return onSnapshot(this.getTrashRef(), (list) => {
      this.trashNotes = [];
      list.forEach((element) => {
        this.trashNotes.push(this.setNoteObject(element.data(), element.id));
      });
    });
  }

  subNotesList() {
    const q = query(this.getNotesRef(), limit(50));
    return onSnapshot(q, (list) => {
      this.normalNotes = [];
      list.forEach((element) => {
        this.normalNotes.push(this.setNoteObject(element.data(), element.id));
      });
    });
  }

  subMarkedNotesList() {
    const q = query(this.getNotesRef(), where('marked', '==', true), limit(50));
    return onSnapshot(q, (list) => {
      this.normalMarkedNotes = [];
      list.forEach((element) => {
        this.normalMarkedNotes.push(
          this.setNoteObject(element.data(), element.id)
        );
      });
    });
  }

  getNotesRef() {
    console.log('getNotesRef');

    return collection(this.firestore, 'notes');
  }

  getTrashRef() {
    return collection(this.firestore, 'trash');
  }

  getSingleDocRef(colId: string, docId: string) {
    console.log('getSingleDocRef');

    return doc(collection(this.firestore, colId), docId);
  }
}
