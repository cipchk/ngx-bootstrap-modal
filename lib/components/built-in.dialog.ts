import { Component, ViewEncapsulation, ViewChild, OnInit, Inject } from '@angular/core';
import { DialogComponent } from './dialog.component';
import { BuiltInOptions } from './built-in.options';

@Component({
    selector: 'dialog-built-in',
    template: `<div class="modal-dialog modal-{{opt.size}}" [ngClass]="classs" #container>
                <div class="modal-content" [ngClass]="{'text-center':opt.icon}">
                   <div class="modal-header" *ngIf="opt.title" [hidden]="opt.icon">
                     <h5 class="modal-title">{{opt.title}}</h5>
                    <button *ngIf="opt.showCloseButton" type="button" class="close" data-dismiss="modal" aria-label="Close" (click)="close()">
                        <span aria-hidden="true">&times;</span>
                    </button>
                   </div>
                   <div class="modal-body">
                    <div *ngIf="opt.icon" [ngSwitch]="opt.icon">
                        <div class="modal-icon modal-error animate-error-icon" *ngSwitchCase="'error'">
                            <span class="x-mark animate-x-mark"><span class="x-mark-line-left"></span><span class="x-mark-line-right"></span></span>
                        </div>
                        <div class="modal-icon modal-question" *ngSwitchCase="'question'">?</div>
                        <div class="modal-icon modal-warning" *ngSwitchCase="'warning'">!</div>
                        <div class="modal-icon modal-info" *ngSwitchCase="'info'">i</div>
                        <div class="modal-icon modal-success animate-success-icon" *ngSwitchCase="'success'">
                            <div class="success-circular-line-left" style="background: rgb(255, 255, 255);"></div>
                            <span class="success-line-tip animate-success-line-tip"></span>
                            <span class="success-line-long animate-success-line-long"></span>
                            <div class="success-ring"></div>
                            <div class="success-fix" style="background: rgb(255, 255, 255);"></div>
                            <div class="success-circular-line-right" style="background: rgb(255, 255, 255);"></div>
                        </div>
                    </div>
                     <div *ngIf="opt.content" [innerHTML]="opt.content"></div>
                     <div [ngSwitch]="opt.input" *ngIf="opt.type === 'prompt'" class="modal-{{opt.type}}" [ngClass]="{'has-danger has-error': prompError}">
                        <textarea *ngSwitchCase="'textarea'" placeholder="{{opt.inputPlaceholder}}" [(ngModel)]="promptData"
                            class="form-control" [ngClass]="{'form-control-danger': prompError}"></textarea>
                        <select *ngSwitchCase="'select'" [(ngModel)]="promptData" name="promptData"
                            (ngModelChange)="onChanage()"
                            class="form-control" [ngClass]="{'form-control-danger': prompError}">
                            <option *ngFor="let i of opt.inputOptions" [ngValue]="i">{{i.text}}</option>
                        </select>
                        <div *ngSwitchCase="'range'" class="row modal-range">
                            <div class="col-{{opt.size}}-9">
                                <input type="range" [min]="opt.inputAttributes.min" [max]="opt.inputAttributes.max" [(ngModel)]="promptData" name="promptData"
                                    (ngModelChange)="onChanage()" class="form-control">
                            </div>
                            <div class="col-{{opt.size}}-3"><p class="form-control-static">{{promptData}}</p></div>
                        </div>
                        <div *ngSwitchCase="'checkbox'">
                            <label *ngFor="let i of opt.inputOptions" class="checkbox-inline custom-control custom-checkbox">
                                <input type="checkbox" [(ngModel)]="i._checked" [value]="i" name="checkbox1"
                                    class="custom-control-input">
                                <span class="custom-control-indicator"></span>
                                <span class="custom-control-description"> {{i.text}}</span>
                            </label>
                        </div>
                        <div *ngSwitchCase="'radio'">
                            <label *ngFor="let i of opt.inputOptions" class="radio-inline custom-control custom-radio">
                                <input type="radio" (click)="promptData=i" [checked]="i===promptData" class="custom-control-input">
                                <span class="custom-control-indicator"></span>
                                <span class="custom-control-description"> {{i.text}}</span>
                            </label>
                        </div>
                        <input *ngSwitchDefault type="{{opt.input}}"
                            placeholder="{{opt.inputPlaceholder}}" [(ngModel)]="promptData" name="promptData"
                            (ngModelChange)="onChanage()" (keyup)="onKeyup($event)" [maxlength]="opt.inputAttributes.maxlength"
                            class="form-control" [ngClass]="{'form-control-danger': prompError}">
                        <div class="form-control-feedback" *ngIf="prompError">{{opt.inputError}}</div>
                    </div>
                   </div>
                   <div class="modal-footer" *ngIf="opt.showConfirmButton || opt.showCancelButton">
                     <button type="button" class="cancel btn" tabIndex="2" (click)="close()" [ngClass]="opt.cancelButtonClass" [hidden]="!opt.showCancelButton">{{opt.cancelButtonText}}</button>
                     <button type="button" class="confirm btn" tabIndex="1" (click)="ok()" [disabled]="prompError" [ngClass]="opt.confirmButtonClass" [hidden]="!opt.showConfirmButton">{{opt.confirmButtonText}}</button>
                   </div>
                </div>
             </div>`,
    styleUrls: [ './dialog.scss' ],
    encapsulation: ViewEncapsulation.None,
    preserveWhitespaces: false
})
export class BuiltInComponent extends DialogComponent<BuiltInOptions, any> implements OnInit {
    @ViewChild('container') container: any;
    opt: BuiltInOptions;
    checkboxMap: any = {};
    classs: any = {};

    prompError = false;
    promptData: any;

    ngOnInit() {
        const options = this.opt;
        if (options.className)
            this.classs[options.className] = true;

        if (options.icon)
            this.classs['has-icon'] = true;

        if (options.type === 'prompt') {
            if (!options.inputRegex) {
                switch (options.input) {
                    case 'email':
                        options.inputRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                        if (!options.inputError) options.inputError = '邮箱格式不正确';
                        break;
                    case 'url':
                        options.inputRegex = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
                        if (!options.inputError) options.inputError = '网址格式不正确';
                        break;
                }
            }

            if (options.inputOptions && !Array.isArray(options.inputOptions)) {
                const keys = [];
                // tslint:disable-next-line:forin
                for (const key in options.inputOptions) {
                    keys.push({ key: key, text: options.inputOptions[key] });
                }
                options.inputOptions = keys;
            }
            options.inputOptions = Object.assign([], options.inputOptions);

            options.inputAttributes = Object.assign({
                maxlength: null,
                min: 0,
                max: 100,
                step: 1
            }, options.inputAttributes);
        }

        // 默认值
        let defaultValue = options.inputValue;
        if (options.input === 'checkbox' && !Array.isArray(options.inputValue)) {
            defaultValue = typeof defaultValue !== 'undefined' ? [ defaultValue ] : [];
        }
        options.inputValue = defaultValue || '';

            console.log(options);
        this.promptData = options.inputValue;
        if (this.promptData) {
            this.promptCheck();
        }

        setTimeout(() => {
            this.setFocus();
        }, 100);
    }

    private promptCheck(): boolean {
        if (this.opt.inputRequired === true) {
            if (this.opt.input === 'checkbox' && this.promptData.length === 0) {
                this.prompError = true;
                return false;
            }
            if (!this.promptData) {
                this.prompError = true;
                return false;
            }
        }

        if (this.opt.inputRegex && !this.opt.inputRegex.test(this.promptData.toString())) {
            this.prompError = true;
            return false;
        }

        this.prompError = false;
        return true;
    }

    private setFocus() {
        const containerEl = this.container.nativeElement;
        let firstFormEl: any = null;
        if (this.opt.type === 'prompt') {
            firstFormEl = containerEl.querySelector('input, textarea, select');
        } else {
            firstFormEl = containerEl.querySelector('button.confirm');
        }
        if (firstFormEl) firstFormEl.focus();
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
                let ret = this.promptData;
                if (this.opt.input === 'checkbox') {
                    ret = this.opt.inputOptions
                                .filter((item: any) => item._checked)
                                .map((item: any) => {
                                    delete item._checked;
                                    return item;
                                });
                }
                this.result = ret;
                break;
        }

        this.close();
    }
}
