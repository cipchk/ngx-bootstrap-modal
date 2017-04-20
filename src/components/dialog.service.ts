import {
    Injectable, ComponentFactoryResolver, ApplicationRef, Injector, EmbeddedViewRef, Type, Optional
} from "@angular/core";
import { DialogHolderComponent } from "./dialog-holder.component";
import { DialogComponent } from "./dialog.component";
import { Observable } from "rxjs";
import { BuiltInOptions } from './built-in.options';
import { BuiltInComponent } from './built-in.dialog';

export interface DialogOptions {
    /**
     * 指定模态顺序
     * 
     * @type {number}
     * @default 自动叠加
     */
    index?: number;
    /**
     * 自动关闭时间（单位：ms）
     * 
     * @type {number}
     * @default 不会自动关闭
     */
    timeout?: number;
    /**
     * 是否包括背景且点击背景会关闭，如果传递的是字符串 'static' 点击背景不会关闭。
     * 
     * @type {boolean}
     * @default true
     */
    backdrop?: boolean | string;
    /**
     * 背景色
     * 
     * @type {string}
     * @default 'rgba(0,0,0,.5)' 半透明
     */
    backdropColor?: string;
    /**
     * 键盘上的 esc 键被按下时关闭模态框。
     * 
     * @type {boolean}
     * @default true
     */
    keyboard?: boolean;
}

export class DialogServiceConfig {
    container: HTMLElement = null;
}

@Injectable()
export class DialogService {

    /**
     * Placeholder of modal dialogs
     * @type {DialogHolderComponent}
     */
    private dialogHolderComponent: DialogHolderComponent;

    /**
     * HTML container for dialogs
     * type {HTMLElement}
     */
    private container: HTMLElement;

    /**
     * @param {ComponentFactoryResolver} resolver
     * @param {ApplicationRef} applicationRef
     * @param {Injector} injector
     * @param {DialogServiceConfig} config
     */
    constructor(private resolver: ComponentFactoryResolver, private applicationRef: ApplicationRef, private injector: Injector, @Optional() config: DialogServiceConfig) {
        this.container = config && config.container;
    }

    /**
     * Adds dialog
     * @param {Type<DialogComponent<T, T1>>} component
     * @param {T?} data
     * @param {DialogOptions?} options
     * @return {Observable<T1>}
     */
    addDialog<T, T1>(component: Type<DialogComponent<T, T1>>, data?: T, options?: DialogOptions): Observable<T1> {
        if (!this.dialogHolderComponent) {
            this.dialogHolderComponent = this.createDialogHolder();
        }
        return this.dialogHolderComponent.addDialog<T, T1>(component, data, options);
    }

    /**
     * Hides and removes dialog from DOM
     * @param {DialogComponent} component
     */
    removeDialog(component: DialogComponent<any, any>): void {
        if (!this.dialogHolderComponent) {
            return;
        }
        this.dialogHolderComponent.removeDialog(component);
    }

    /**
     * Closes all dialogs
     */
    removeAll(): void {
        this.dialogHolderComponent.clear();
    }

    /**
     * Creates and add to DOM dialog holder component
     * @return {DialogHolderComponent}
     */
    private createDialogHolder(): DialogHolderComponent {

        let componentFactory = this.resolver.resolveComponentFactory(DialogHolderComponent);

        let componentRef = componentFactory.create(this.injector);
        let componentRootNode = (componentRef.hostView as EmbeddedViewRef<any>).rootNodes[0] as HTMLElement;
        if (!this.container) {
            let componentRootViewContainer = this.applicationRef['_rootComponents'][0];
            this.container = (componentRootViewContainer.hostView as EmbeddedViewRef<any>).rootNodes[0] as HTMLElement;
        }
        this.applicationRef.attachView(componentRef.hostView);

        componentRef.onDestroy(() => {
            this.applicationRef.detachView(componentRef.hostView);
        });
        this.container.appendChild(componentRootNode);

        return componentRef.instance;
    }

    show(builtInOptions: BuiltInOptions, options?: DialogOptions) {
        let opt = Object.assign(<BuiltInOptions>{
            type: 'default',
            size: 'sm',
            input: 'text',
            inputOptions: {},
            inputAttributes: {},
            showCloseButton: true,
            showCancelButton: true,
            cancelButtonText: '取消',
            cancelButtonClass: 'btn-default',
            showConfirmButton: true,
            confirmButtonText: '确认',
            confirmButtonClass: 'btn-primary'
        }, builtInOptions);

        this.addDialog<BuiltInOptions, any>(BuiltInComponent, <any>{
            opt: opt
        }, options).subscribe(res => {
            if (opt.onHide)
                opt.onHide(res);
        });

        if (opt.onShow)
            opt.onShow();
    }

    /**
     * Show Alter
     * 
     * @param {string} title 
     * @param {string} content 
     */
    alert(title: string, content: string, options?: BuiltInOptions) {
        this.show(Object.assign({}, options, <BuiltInOptions>{
            type: 'alert',
            title: title,
            content: content,
            showCancelButton: false
        }));
    }

    /**
     * show confirm
     * 
     * @param {string} title 
     * @param {string} content 
     */
    confirm(title: string, content: string, options?: BuiltInOptions): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            this.show(Object.assign({}, options, <BuiltInOptions>{
                type: 'confirm',
                title: title,
                content: content,
                onHide: (res: boolean) => {
                    resolve(res === undefined ? false : res);
                }
            }));
        });
    }

    /**
     * show confirm
     * 
     * @param {string} title 
     * @param {string} content 
     */
    prompt(title: string, promptOptions?: BuiltInOptions): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            this.show(Object.assign(<BuiltInOptions>{
                input: 'text',
                inputRequired: true,
                inputError: '不可为空'
            }, promptOptions, <BuiltInOptions>{
                type: 'prompt',
                title: title,
                onHide: (res: boolean) => {
                    resolve(res === undefined ? false : res);
                }
            }));
        });
    }
}
