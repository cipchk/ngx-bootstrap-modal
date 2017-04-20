import { Component } from '@angular/core';
import { DialogService } from "./dialog.service";
import { DialogComponent } from './dialog.component';
import { BuiltInOptions } from './built-in.options';

@Component({
    selector: 'dialog-built-in',
    template: `<div class="modal-dialog modal-{{opt.size}}" [ngClass]="opt.className">
                <div class="modal-content">
                   <div class="modal-header">
                     <h4 class="modal-title">{{opt.title}}</h4>
                    <button *ngIf="opt.showCloseButton" type="button" class="close" data-dismiss="modal" aria-label="Close" (click)="close()">
                        <span aria-hidden="true">&times;</span>
                    </button>
                   </div>
                   <div class="modal-body">
                     <div *ngIf="opt.content" [innerHTML]="opt.content"></div>
                     <div [ngSwitch]="opt.input" *ngIf="opt.type === 'prompt'" [ngClass]="{'has-danger': prompError}">
                        <textarea *ngSwitchCase="'textarea'" placeholder="{{opt.inputPlaceholder}}" [(ngModel)]="promptData"
                            class="form-control" autofocus [ngClass]="{'form-control-danger': prompError}"></textarea>
                        <input *ngSwitchDefault type="{{opt.input}}"
                            placeholder="{{opt.inputPlaceholder}}" [(ngModel)]="promptData" name="promptData"
                            (ngModelChange)="onChanage()" (keyup)="onKeyup($event)"
                            class="form-control" autofocus [ngClass]="{'form-control-danger': prompError}">
                        <div class="form-control-feedback" style="font-size:.8rem;" *ngIf="prompError">{{opt.inputError}}</div>
                    </div>
                   </div>
                   <div class="modal-footer" *ngIf="opt.showConfirmButton || opt.showCancelButton">
                     <button type="button" class="btn" (click)="close()" [ngClass]="opt.cancelButtonClass" *ngIf="opt.showCancelButton">{{opt.cancelButtonText}}</button>
                     <button type="button" class="btn" (click)="ok()" [disabled]="prompError" [ngClass]="opt.confirmButtonClass" *ngIf="opt.showConfirmButton">{{opt.confirmButtonText}}</button>
                   </div>
                </div>
             </div>`
})
export class BuiltInComponent extends DialogComponent<BuiltInOptions, any> {
    public opt: BuiltInOptions;

    public prompError: boolean = false;
    public promptData: string;
    constructor(dialogService: DialogService) {
        super(dialogService);
    }

    ngOnInit() {
        if (this.opt.type === 'prompt' && !this.opt.inputRegex) {
            switch (this.opt.input) {
                case 'email':
                    this.opt.inputRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                    if (!this.opt.inputError) this.opt.inputError = '邮箱格式不正确';
                    break;
                case 'url':
                    this.opt.inputRegex = /^((http[s]?|ftp):\/)?\/?([^:\/\s]+)((\/\w+)*\/)([\w\-\.]+[^#?\s]+)(.*)?(#[\w\-]+)?$/;
                    if (!this.opt.inputError) this.opt.inputError = '网址格式不正确';
                    break;
            }
        }
        this.promptData = this.opt.inputValue;
        if (this.promptData) {
            this.promptCheck();
        }
    }

    private promptCheck(): boolean {
        if (this.opt.inputRequired === true && !this.promptData) {
            this.prompError = true;
            return false;
        }

        if (this.opt.inputRegex && !this.opt.inputRegex.test(this.promptData.toString())) {
            this.prompError = true;
            return false;
        }
        
        this.prompError = false;
        return true;
    }

    onChanage() {
        this.promptCheck();
    }

    onKeyup(event: KeyboardEvent) {
        if (event.keyCode === 13) {
            this.ok();
        }
    }

    ok() {
        switch (this.opt.type) {
            case 'confirm':
                this.result = true;
                break;
            case 'prompt':
                if (!this.promptCheck()) return;
                this.result = this.promptData;
                break;
        }

        this.close();
    }
}
