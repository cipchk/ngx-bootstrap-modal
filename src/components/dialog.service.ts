import { Injectable, ComponentFactoryResolver, ApplicationRef, Injector, EmbeddedViewRef, Type, Optional } from '@angular/core';
import { DialogHolderComponent } from './dialog-holder.component';
import { DialogComponent } from './dialog.component';
import { Observable } from 'rxjs/Observable';
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
    backdrop?: boolean | 'static';
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
    container?: HTMLElement = null;

    builtInOptions?: BuiltInOptions;
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
        this.DEFOPT = config && config.builtInOptions;
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
        const componentFactory = this.resolver.resolveComponentFactory(DialogHolderComponent);

        const componentRef = componentFactory.create(this.injector);
        const componentRootNode = (componentRef.hostView as EmbeddedViewRef<any>).rootNodes[0] as HTMLElement;
        if (!this.container) this.container = document.body;
        this.applicationRef.attachView(componentRef.hostView);

        componentRef.onDestroy(() => {
            this.applicationRef.detachView(componentRef.hostView);
        });
        this.container.appendChild(componentRootNode);

        return componentRef.instance;
    }

    public DEFOPT: BuiltInOptions;

    /**
     * 构建一个内置模态
     * @param builtInOptions 内置配置参数
     * @param options 模态配置参数
     */
    show(builtInOptions: BuiltInOptions, options?: DialogOptions) {
        const opt = Object.assign(<BuiltInOptions>{
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
        }, this.DEFOPT, builtInOptions);

        this.addDialog<BuiltInOptions, any>(BuiltInComponent, <any>{
            opt: opt
        }, this.mergerDialog({
            timeout: 0,
            backdrop: true,
            backdropColor: 'rgba(0,0,0,.5)',
            keyboard: true
        }, Object.assign(builtInOptions, options))).subscribe(res => {
            if (opt.onHide)
                opt.onHide(res);
        });

        if (opt.onShow)
            opt.onShow();
    }

    private mergerDialog(options: DialogOptions, built: BuiltInOptions): DialogOptions {
        const newOptions: any = {};
        if (!built) return newOptions;
        Object.keys(options).forEach(key => {
            if (typeof built[key] !== 'undefined') newOptions[key] = built[key];
        });
        return newOptions;
    }

    /**
     * Show Alter
     *
     * @param {string} title
     * @param {string} content
     * @param {BuiltInOptions} 覆盖内置配置参数
     */
    alert(title: string, content: string, options?: BuiltInOptions) {
        this.show(Object.assign({}, options, <BuiltInOptions>{
            type: 'alert',
            title: title,
            content: content,
            showCancelButton: false
        }), this.mergerDialog({
            timeout: 0,
            backdrop: true,
            backdropColor: 'rgba(0,0,0,.5)',
            keyboard: true
        }, options));
    }

    /**
     * Show confirm
     *
     * @param {string} title
     * @param {string} content
     * @param {BuiltInOptions} 覆盖内置配置参数
     * @returns {Promise<boolean>} 返回一个Promise布尔类型
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
            }), this.mergerDialog({
                timeout: 0,
                backdrop: 'static',
                backdropColor: 'rgba(0,0,0,.5)',
                keyboard: false
            }, options));
        });
    }

    /**
     * Show prompt
     *
     * @param {string} title
     * @param {BuiltInOptions} 覆盖内置配置参数
     * @returns {Promise<any>} 返回一个Promise任意类型
     */
    prompt(title: string, options?: BuiltInOptions): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            this.show(Object.assign(<BuiltInOptions>{
                input: 'text',
                inputRequired: true,
                inputError: '不可为空'
            }, options, <BuiltInOptions>{
                type: 'prompt',
                title: title,
                onHide: (res: any) => {
                    resolve(res);
                }
            }), this.mergerDialog({
                timeout: 0,
                backdrop: 'static',
                backdropColor: 'rgba(0,0,0,.5)',
                keyboard: false
            }, options));
        });
    }
}
