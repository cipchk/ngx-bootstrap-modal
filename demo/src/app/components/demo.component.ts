/* tslint:disable */
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { AlertComponent } from './alert.component';
import { ConfirmComponent } from './confirm.component';
import { PromptComponent } from './prompt.component';
import { ParentDialogComponent } from './parent-dialog.component';
import { DialogService, BuiltInOptions } from "ngx-bootstrap-modal";

@Component({
    selector: 'demo',
    templateUrl: './demo.component.html'
})
export class DemoComponent {
    confirmResult: boolean = null;
    promptMessage: string = '';

    constructor(private dialogService: DialogService) { 
    }


    opt: any = {
        title: '',
        content: '',
        icon: 'success', //success
        size: 'sm',
        showCloseButton: true,
        input: 'text',
        inputValue: '',
        inputPlaceholder: '必填项',
        inputRequired: true,
        inputError: '',
        inputAttributes: {},
        showCancelButton: true,
        cancelButtonText: '取消',
        showConfirmButton: true,
        confirmButtonText: '确认'
    };
    confirm_result: string = '';
    bConfirm() {
        this.dialogService.confirm(this.opt.title || '提醒', this.opt.content || '确认要删除吗？', this.opt).then((res: any) => {
            this.confirm_result = res ? '确认' : '取消';
        });
    }
    inputOptions: string = `{
        "": "请选择",
        "durex": "杜蕾斯",
        "jissbon": "杰士邦",
        "donless": "多乐士",
        "first": "处男"
    }`;
    regex: string = ''; // [a-z]+
    prompt_result: any;
    bPrompt() {
        if (this.regex)
            this.opt.inputRegex = new RegExp(this.regex);
        else
            this.opt.inputRegex = null;
        
        if (this.inputOptions) {
            try {
                this.opt.inputOptions = this.opt.input == 'checkbox' ? this.inputOptions : JSON.parse(this.inputOptions);
            }catch(ex) {
                alert(`数据无法JSON.parse：${ex}`);
                return;
            }
        } else {
            this.opt.inputOptions = {};
        }
        this.opt.icon = '';

        this.dialogService.prompt(this.opt.title || '请输入新值', this.opt).then((res: any) => {
            this.prompt_result = res;
        })
    }

    showAlert() {
        this.dialogService.addDialog(AlertComponent, { title: 'Alert title!', message: 'Alert message!!!' });
    }

    showConfirm() {
        this.dialogService.addDialog(ConfirmComponent, {
            title: 'Confirmation',
            message: 'Bla bla confirm some action?'
        })
            .subscribe((isConfirmed) => {
                //Get dialog result
                this.confirmResult = isConfirmed;
            });
    }

    showPrompt() {
        this.dialogService.addDialog(PromptComponent, {
            title: 'Name dialog',
            question: 'What is your name?: '
        })
            .subscribe((message) => {
                //We get dialog result
                this.promptMessage = message;
            });
    }

    showAlert2() {
        this.dialogService.addDialog(AlertComponent, { message: 'Click outside to close dialog' });
    }

    showAlert5() {
        this.dialogService.addDialog(AlertComponent, { message: 'Click outside only close button' }, { backdrop: 'static' });
    }

    showAlert3() {
        this.dialogService.addDialog(AlertComponent, { message: 'Wait 5 seconds and dialog will be closed automatically' }, { timeout: 5000 });
    }

    showAlert4() {
        this.dialogService.addDialog(AlertComponent, { message: 'Dialog with red backdrop' }, { backdropColor: 'rgba(255, 0, 0, 0.5)' });
    }
    showParentDialog() {
        this.dialogService.addDialog(ParentDialogComponent);
    }
}
