import { Component, ViewEncapsulation } from '@angular/core';
import { DialogService } from "./dialog.service";
import { DialogComponent } from './dialog.component';
import { BuiltInOptions } from './built-in.options';

@Component({
    selector: 'dialog-built-in',
    template: `<div class="modal-dialog modal-{{opt.size}}" [ngClass]="classs">
                <div class="modal-content" [ngClass]="{'text-center':opt.icon}">
                   <div class="modal-header" *ngIf="opt.title" [hidden]="opt.icon">
                     <h4 class="modal-title">{{opt.title}}</h4>
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
                     <div [ngSwitch]="opt.input" *ngIf="opt.type === 'prompt'" [ngClass]="{'has-danger': prompError}">
                        <textarea *ngSwitchCase="'textarea'" placeholder="{{opt.inputPlaceholder}}" [(ngModel)]="promptData"
                            class="form-control modal-textarea" autofocus [ngClass]="{'form-control-danger': prompError}"></textarea>
                        <select *ngSwitchCase="'select'" [(ngModel)]="promptData" name="promptData"
                            (ngModelChange)="onChanage()"
                            class="form-control" [ngClass]="{'form-control-danger': prompError}">
                            <option *ngFor="let si of opt.inputOptions | keys" [ngValue]="si.key">{{si.value}}</option>
                        </select>
                        <div *ngSwitchCase="'range'" class="row">
                            <div class="col-9">
                                <input type="range" [min]="opt.inputAttributes.min" [max]="opt.inputAttributes.max" [(ngModel)]="promptData" name="promptData"
                                    (ngModelChange)="onChanage()" class="form-control">
                            </div>
                            <div class="col-3"><p class="form-control-static">{{promptData}}</p></div>
                        </div>
                        <div *ngSwitchCase="'checkbox'">
                            <label class="custom-control custom-checkbox">
                                <input type="checkbox" [(ngModel)]="promptData" class="custom-control-input">
                                <span class="custom-control-indicator"></span>
                                <span class="custom-control-description"> {{opt.inputOptions}}</span>
                            </label>
                        </div>
                        <div *ngSwitchCase="'radio'">
                            <label class="custom-control custom-radio" *ngFor="let si of opt.inputOptions | keys">
                                <input type="radio" (click)="promptData=si.key" [checked]="si.key===promptData" class="custom-control-input">
                                <span class="custom-control-indicator"></span>
                                <span class="custom-control-description"> {{si.value}}</span>
                            </label>
                        </div>
                        <input *ngSwitchDefault type="{{opt.input}}"
                            placeholder="{{opt.inputPlaceholder}}" [(ngModel)]="promptData" name="promptData"
                            (ngModelChange)="onChanage()" (keyup)="onKeyup($event)"
                            class="form-control" autofocus [ngClass]="{'form-control-danger': prompError}">
                        <div class="form-control-feedback" style="font-size:.8rem;" *ngIf="prompError">{{opt.inputError}}</div>
                    </div>
                   </div>
                   <div class="modal-footer" *ngIf="opt.showConfirmButton || opt.showCancelButton">
                     <button type="button" class="btn" (click)="close()" [ngClass]="opt.cancelButtonClass" [hidden]="!opt.showCancelButton">{{opt.cancelButtonText}}</button>
                     <button type="button" class="btn" (click)="ok()" [disabled]="prompError" [ngClass]="opt.confirmButtonClass" [hidden]="!opt.showConfirmButton">{{opt.confirmButtonText}}</button>
                   </div>
                </div>
             </div>`,
    styles: [`
    .modal-textarea{height:108px;padding:12px}.modal-icon{width:80px;height:80px;border:4px solid transparent;border-radius:50%;margin:20px auto 30px;padding:0;position:relative;box-sizing:content-box;cursor:default;user-select:none;-webkit-tap-highlight-color:transparent}.modal-icon.modal-error{border-color:#f27474}.modal-icon.modal-error .x-mark{position:relative;display:block}.modal-icon.modal-error [class^='x-mark-line']{position:absolute;height:5px;width:47px;background-color:#f27474;display:block;top:37px;border-radius:2px}.modal-icon.modal-error [class^='x-mark-line'][class$='left']{transform:rotate(45deg);left:17px}.modal-icon.modal-error [class^='x-mark-line'][class$='right']{transform:rotate(-45deg);right:16px}.modal-icon.modal-warning{font-family:'Helvetica Neue', Helvetica, Arial, sans-serif;color:#f8bb86;border-color:#facea8;font-size:60px;line-height:80px;text-align:center}.modal-icon.modal-info{font-family:'Open Sans', sans-serif;color:#3fc3ee;border-color:#9de0f6;font-size:60px;line-height:80px;text-align:center}.modal-icon.modal-question{font-family:'Helvetica Neue', Helvetica, Arial, sans-serif;color:#87adbd;border-color:#c9dae1;font-size:60px;line-height:80px;text-align:center}.modal-icon.modal-success{border-color:#a5dc86}.modal-icon.modal-success [class^='success-circular-line']{border-radius:50%;position:absolute;width:60px;height:120px;transform:rotate(45deg)}.modal-icon.modal-success [class^='success-circular-line'][class$='left']{border-radius:120px 0 0 120px;top:-7px;left:-33px;transform:rotate(-45deg);transform-origin:60px 60px}.modal-icon.modal-success [class^='success-circular-line'][class$='right']{border-radius:0 120px 120px 0;top:-11px;left:30px;transform:rotate(-45deg);transform-origin:0 60px}.modal-icon.modal-success .success-ring{width:80px;height:80px;border:4px solid rgba(165,220,134,0.2);border-radius:50%;box-sizing:content-box;position:absolute;left:-4px;top:-4px;z-index:2}.modal-icon.modal-success .success-fix{width:7px;height:90px;position:absolute;left:28px;top:8px;z-index:1;transform:rotate(-45deg)}.modal-icon.modal-success [class^='success-line']{height:5px;background-color:#a5dc86;display:block;border-radius:2px;position:absolute;z-index:2}.modal-icon.modal-success [class^='success-line'][class$='tip']{width:25px;left:14px;top:46px;transform:rotate(45deg)}.modal-icon.modal-success [class^='success-line'][class$='long']{width:47px;right:8px;top:38px;transform:rotate(-45deg)}@keyframes animate-success-tip{0%{width:0;left:1px;top:19px}54%{width:0;left:1px;top:19px}70%{width:50px;left:-8px;top:37px}84%{width:17px;left:21px;top:48px}100%{width:25px;left:14px;top:45px}}@keyframes animate-success-long{0%{width:0;right:46px;top:54px}65%{width:0;right:46px;top:54px}84%{width:55px;right:0;top:35px}100%{width:47px;right:8px;top:38px}}@keyframes rotatePlaceholder{0%{transform:rotate(-45deg)}5%{transform:rotate(-45deg)}12%{transform:rotate(-405deg)}100%{transform:rotate(-405deg)}}.animate-success-line-tip{animation:animate-success-tip 0.75s}.animate-success-line-long{animation:animate-success-long 0.75s}.modal-success.animate-success-icon .success-circular-line-right{animation:rotatePlaceholder 4.25s ease-in}@keyframes animate-error-icon{0%{transform:rotateX(100deg);opacity:0}100%{transform:rotateX(0deg);opacity:1}}.animate-error-icon{animation:animate-error-icon 0.5s}@keyframes animate-x-mark{0%{transform:scale(0.4);margin-top:26px;opacity:0}50%{transform:scale(0.4);margin-top:26px;opacity:0}80%{transform:scale(1.15);margin-top:-6px}100%{transform:scale(1);margin-top:0;opacity:1}}.animate-x-mark{animation:animate-x-mark 0.5s}@keyframes rotate-loading{0%{transform:rotate(0deg)}100%{transform:rotate(360deg)}}
    `],
    encapsulation: ViewEncapsulation.None
})
export class BuiltInComponent extends DialogComponent<BuiltInOptions, any> {
    public opt: BuiltInOptions;
    public checkboxMap: any = {};
    public classs: Object = {};

    public prompError: boolean = false;
    public promptData: any;
    constructor(dialogService: DialogService) {
        super(dialogService);
    }

    ngOnInit() {
        if (this.opt.className)
            this.classs[this.opt.className] = true;

        if (this.opt.icon)
            this.classs['has-icon'] = true;
        
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
        if (this.opt.input !== 'checkbox' && this.opt.inputRequired === true && !this.promptData) {
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
