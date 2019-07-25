import { Component } from '@angular/core';
import { DialogComponent } from 'ngx-bootstrap-modal';

export interface ConfirmModel {
  title: string;
  message: string;
}

@Component({
  selector: 'confirm',
  template: `
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h4 class="modal-title">{{ title || 'Confirm' }}</h4>
          <button type="button" class="close" data-dismiss="modal" aria-label="Close" (click)="close()">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
          <p>{{ message || 'Are you sure?' }}</p>
        </div>
        <div class="modal-footer">
          <button type="button" autofocus class="btn btn-primary" (click)="confirm()">OK</button>
          <button type="button" class="btn btn-default" (click)="cancel()">Cancel</button>
        </div>
      </div>
    </div>
  `,
})
export class ConfirmComponent extends DialogComponent<ConfirmModel, boolean> implements ConfirmModel {
  title: string;
  message: string;
  confirm() {
    // on click on confirm button we set dialog result as true,
    // ten we can get dialog result from caller code
    this.close(true);
  }
  cancel() {
    this.close(false);
  }
}
