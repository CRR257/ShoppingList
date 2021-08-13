import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { DocumentService } from '../../shared/services/Document/document.service';
import {Document, DocumentList} from '../../shared/models/document.interface';
import {AuthService} from '../../shared/services/auth/auth-service';
import {documentEditor} from '../../constants/editor.constants';

@Component({
  selector: 'app-document',
  templateUrl: './document.component.html',
  styleUrls: ['./document.component.scss']
})
export class DocumentComponent implements OnInit {
  apiKey: string = documentEditor.apiKey;
  userId: string;
  loading = false;
  documentList: DocumentList[];
  documentId: string;
  documentText: string;
  cardDialog = false;
  messageCardDialog: string;

  documentForm = new FormGroup({
    text: new FormControl('')
  });

  constructor(public authService: AuthService, public documentService: DocumentService) { }

  ngOnInit(): void {
    this.loading = true;
    this.getUserLogged();
    this.getUserDocuments();
  }

  getUserLogged() {
    this.userId = this.authService.getUserLogged().id;
  }

  getUserDocuments() {
    const userDocuments = 'documentList-' + `${this.userId}`;
    this.documentService.getUserDocuments(userDocuments).subscribe(documents => {
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
      text: form.text
    };
    if (this.documentId === undefined) {
      this.documentService.newDocument(document).then(result => {
        this.cardDialog = true;
        this.messageCardDialog = result;
      }).catch(error => {
        this.cardDialog = true;
        this.messageCardDialog = error;
      });
    } else {
      this.documentService.editDocument(this.documentId, document)
        .then(result => {
        this.cardDialog = true;
        this.messageCardDialog = result;
      }).catch(error => {
        this.cardDialog = true;
        this.messageCardDialog = error;
      });
    }
  }

  closeDialog() {
    this.cardDialog = false;
  }
}
