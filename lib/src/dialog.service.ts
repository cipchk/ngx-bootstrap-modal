import { Injectable, ComponentFactoryResolver, ApplicationRef, Injector, EmbeddedViewRef, Type, Optional } from '@angular/core';
import { Observable } from 'rxjs';
import { DialogHolderComponent } from './dialog-holder.component';
import { DialogComponent } from './dialog.component';
import { BuiltInOptions } from './built-in.options';
import { BuiltInComponent } from './built-in.dialog';
import { DialogOptions, DialogServiceConfig } from './interfaces';

@Injectable()
export class DialogService {
  constructor(
    private resolver: ComponentFactoryResolver,
    private applicationRef: ApplicationRef,
    private injector: Injector,
    @Optional() config: DialogServiceConfig,
  ) {
    if (config) {
      this.container = config.container;
      this.DEFOPT = config.builtInOptions;
    }
  }
  /**
   * Placeholder of modal dialogs
   */
  private dialogHolderComponent: DialogHolderComponent;
  /**
   * HTML container for dialogs
   */
  private container: HTMLElement;

  private DEFOPT: BuiltInOptions;

  /**
   * Adds dialog
   */
  addDialog<T, T1>(component: Type<DialogComponent<T, T1>>, data?: T, options?: DialogOptions): Observable<T1> {
    if (!this.dialogHolderComponent) {
      this.dialogHolderComponent = this.createDialogHolder();
    }
    return this.dialogHolderComponent.addDialog<T, T1>(component, data, options);
  }

  /**
   * Hides and removes dialog from DOM
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

  /**
   * 构建一个内置模态
   * @param builtInOptions 内置配置参数
   * @param options 模态配置参数
   */
  show(builtInOptions: BuiltInOptions, options?: DialogOptions) {
    const opt = {
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
      confirmButtonClass: 'btn-primary',
      ...this.DEFOPT,
      ...builtInOptions,
    };

    this.addDialog<BuiltInOptions, any>(
      BuiltInComponent,
      {
        opt,
      } as any,
      this.mergerDialog(
        {
          timeout: 0,
          backdrop: true,
          backdropColor: 'rgba(0,0,0,.5)',
          keyboard: true,
        },
        { ...builtInOptions, ...options },
      ),
    ).subscribe(res => {
      if (opt.onHide) opt.onHide(res);
    });

    if (opt.onShow) opt.onShow();
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
   */
  alert(title: string, content: string, options?: BuiltInOptions) {
    this.show(
      {
        ...options,
        type: 'alert',
        title,
        content,
        showCancelButton: false,
      },
      this.mergerDialog(
        {
          timeout: 0,
          backdrop: true,
          backdropColor: 'rgba(0,0,0,.5)',
          keyboard: true,
        },
        options,
      ),
    );
  }

  /**
   * Show confirm
   */
  confirm(title: string, content: string, options?: BuiltInOptions): Promise<boolean> {
    return new Promise<boolean>((resolve, _reject) => {
      this.show(
        {
          ...options,
          type: 'confirm',
          title,
          content,
          onHide: (res: boolean) => {
            resolve(res === undefined ? false : res);
          },
        },
        this.mergerDialog(
          {
            timeout: 0,
            backdrop: 'static',
            backdropColor: 'rgba(0,0,0,.5)',
            keyboard: false,
          },
          options,
        ),
      );
    });
  }

  /**
   * Show prompt
   */
  prompt(title: string, options?: BuiltInOptions): Promise<any> {
    return new Promise<any>((resolve, _reject) => {
      this.show(
        {
          input: 'text',
          inputRequired: true,
          inputError: '不可为空',
          ...options,
          type: 'prompt',
          title,
          onHide: (res: any) => {
            resolve(res);
          },
        },
        this.mergerDialog(
          {
            timeout: 0,
            backdrop: 'static',
            backdropColor: 'rgba(0,0,0,.5)',
            keyboard: false,
          },
          options,
        ),
      );
    });
  }
}
