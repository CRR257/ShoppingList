import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DocumentService } from './document.service';
import { Document, DocumentList } from '../../shared/models/document.interface';
import { AuthService } from '../../shared/services/auth/auth-service';
import { documentEditor } from '../../constants/editor.constants';
import { NotificationComponent } from '../notification/notification.component';

@Component({
  selector: 'app-document',
  templateUrl: './document.component.html',
  styleUrls: ['./document.component.scss'],
})
export class DocumentComponent implements OnInit {
  apiKey: string = documentEditor.apiKey;
  userId: string;
  loading = false;
  documentList: DocumentList[];
  documentId: string;
  documentText: string;

  documentForm = new FormGroup({
    text: new FormControl(''),
  });

  constructor(
    public authService: AuthService,
    public documentService: DocumentService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loading = true;
    this.getUserLogged();
    this.getUserDocuments();
  }

  getUserLogged() {
    this.userId = this.authService.getUserLogged().uid;
  }

  getUserDocuments() {
    const userDocuments = 'documentList-' + `${this.userId}`;
    this.documentService
      .getUserDocuments(userDocuments)
      .subscribe((documents) => {
        const documentsList = documents;
        this.documentList = documentsList;
        if (this.documentList.length > 0) {
          this.documentText = documentsList[0].text;
          this.documentId = documentsList[0].idDocument;
        }
        this.loading = false;
      });
  }

  modifyDocument(form: Document) {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    const document = {
      text: form.text,
    };
    if (this.documentId === undefined) {
      this.documentService
        .newDocument(document)
        .then((result) => {
          this.openSnackBar(result);
        })
        .catch((error) => {
          this.openSnackBar(error);
        });
    } else {
      this.documentService
        .editDocument(this.documentId, document)
        .then((result) => {
          this.openSnackBar(result);
        })
        .catch((error) => {
          this.openSnackBar(error);
        });
    }
  }

  openSnackBar(message: string) {
    this.snackBar.openFromComponent(NotificationComponent, {
      data: message,
      duration: 3000,
    });
  }
}
