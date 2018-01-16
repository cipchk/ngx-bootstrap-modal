import { Component, ViewChild, ViewContainerRef, ComponentFactoryResolver, Type, HostListener } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { DialogComponent } from './dialog.component';
import { DialogWrapperComponent } from './dialog-wrapper.component';
import { DialogOptions } from './dialog.service';

@Component({
    selector: 'dialog-holder',
    template: '<ng-template #element></ng-template>'
})
export class DialogHolderComponent {
    /**
     * Target element to insert dialogs
     */
    @ViewChild('element', { read: ViewContainerRef }) public element: ViewContainerRef;

    /**
     * Array of dialogs
     * @type {Array<DialogComponent> }
     */
    dialogs: Array<DialogComponent<any, any>> = [];

    /**
     * Constructor
     * @param {ComponentFactoryResolver} resolver
     */
    constructor(private resolver: ComponentFactoryResolver) { }

    /**
     * Adds dialog
     * @param {Type<DialogComponent>} component
     * @param {object?} data
     * @param {DialogOptions?} options
     * @return {Observable<*>}
     */
    addDialog<T, T1>(component: Type<DialogComponent<T, T1>>, data?: T, options?: DialogOptions): Observable<T1> {
        options = Object.assign(<DialogOptions>{
            backdrop: true,
            backdropColor: 'rgba(0,0,0,.5)',
            keyboard: true
        }, options);

        if (options.backdrop === false)
            options.backdropColor = '';

        // add body class if this is the only dialog in the stack
        if (!document.body.classList.contains('modal-open')) {
            document.body.classList.add('modal-open');
        }

        const factory = this.resolver.resolveComponentFactory(DialogWrapperComponent);
        const componentRef = this.element.createComponent(factory, options.index);
        const dialogWrapper: DialogWrapperComponent = <DialogWrapperComponent>componentRef.instance;
        const _component: DialogComponent<T, T1> = dialogWrapper.addComponent(component);
        _component.options = options;
        if (typeof (options.index) !== 'undefined') {
            this.dialogs.splice(options.index, 0, _component);
        }
        else {
            this.dialogs.push(_component);
        }
        setTimeout(() => {
            dialogWrapper.container.nativeElement.classList.add('show');
            dialogWrapper.container.nativeElement.classList.add('in');
        });
        if (options.timeout && options.timeout > 0) {
            setTimeout(() => {
                this.removeDialog(_component);
            }, options.timeout);
        }
        if (options.backdrop === true) {
            dialogWrapper.closeByClickOutside();
        }
        if (options.backdropColor) {
            dialogWrapper.container.nativeElement.style.backgroundColor = options.backdropColor;
        }
        return _component.fillData(data);
    }

    /**
     * Removes dialog
     * @param {DialogComponent} component
     */
    removeDialog(component: DialogComponent<any, any>) {
        const element = component.wrapper.container.nativeElement;

        element.classList.remove('show');
        element.classList.remove('in');
        setTimeout(() => {
            this._removeElement(component);
            this.dialogs.length === 0 && document.body.classList.remove('modal-open');
        }, 300);
    }

    private _removeElement(component: any) {
        const index = this.dialogs.indexOf(component);
        if (index > -1) {
            this.element.remove(index);
            this.dialogs.splice(index, 1);
        }
    }

    clear() {
        this.element.clear();
        this.dialogs = [];
    }

    @HostListener('window:keydown', ['$event'])
    documentKeypress(event: KeyboardEvent) {
        // 检查是否最后一个
        if (this.dialogs.length <= 0) return;

        // 移除最新一个组件
        const component = this.dialogs[this.dialogs.length - 1];
        if (component.options.keyboard === true && event.keyCode === 27)
            this.removeDialog(component);
    }
}
