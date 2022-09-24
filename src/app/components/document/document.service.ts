import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { Document, DocumentList } from 'src/app/shared/models/document.interface';

@Injectable({
  providedIn: 'root'
})
export class DocumentService {
  userId: string;
  userDocument: AngularFirestoreCollection<Document>;

  constructor(
    public afs: AngularFirestore,
    public afAuth: AngularFireAuth,
    public router: Router
  ) {
    this.afAuth.authState.subscribe(user => {
      if (user) {
        this.userId = user.uid;
        const documents = 'documentList-' + `${this.userId}`;
        this.userDocument = afs.collection<DocumentList>(documents);
      }
    });
  }

  public getUserDocuments(id: string): Observable<DocumentList[]> {
    return this.afs
      .collection(id)
      .snapshotChanges()
      .pipe(
        map(actions =>
          actions.map(a => {
            const data = a.payload.doc.data() as DocumentList;
            const idDocument = a.payload.doc.id;
            return { idDocument, ...data };
          })
        )
      );
  }

  public editDocument(id: string, document: Document): Promise<string> {
    return new Promise((resolve, reject) => {
      this.userDocument.doc(id).update(document).then(() => {
        resolve('This document has been correctly updated.');
      })
        .catch(() => {
          reject('There has been an error. Try again ');
        });
    });
  }

  public newDocument(document: Document): Promise<string> {
    return new Promise((resolve, reject) => {
      this.userDocument.add(document).then(() => {
        resolve('This document has been correctly created.');
      })
        .catch(() => {
          reject('There has been an error. Try again ');
        });
    });
  }
}
