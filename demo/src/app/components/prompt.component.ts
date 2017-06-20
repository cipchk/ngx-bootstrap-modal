import { Component } from '@angular/core';
import { DialogComponent, DialogService } from "ngx-bootstrap-modal";

export interface PromptModel {
  title:string;
  question:string;
}

@Component({
  selector: 'prompt',
  template: `<div class="modal-dialog">
                <div class="modal-content">
                   <div class="modal-header">
                     <h4 class="modal-title">{{title || 'Prompt'}}</h4>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close" (click)="close()">
                    <span aria-hidden="true">&times;</span>
                    </button>
                   </div>
                   <div class="modal-body">
                    <label>{{question}}</label><input autofocus type="text" class="form-control" [(ngModel)]="message" name="name" >
                   </div>
                   <div class="modal-footer">
                     <button type="button" class="btn btn-primary" (click)="apply()">OK</button>
                     <button type="button" class="btn btn-default" (click)="close()" >Cancel</button>
                   </div>
                 </div>
                </div>`
})
export class PromptComponent extends DialogComponent<PromptModel, string> implements PromptModel {
  title: string;
  question: string;
  message: string = '';
  constructor(dialogService: DialogService) {
    super(dialogService);
  }
  apply() {
    this.result = this.message;
    this.close();
  }
}
