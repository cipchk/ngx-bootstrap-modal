import { DOCUMENT } from '@angular/common';
import { Component, ViewChild, ViewContainerRef, ComponentFactoryResolver, Type, HostListener, Inject } from '@angular/core';
import { Observable } from 'rxjs';
import { DialogComponent } from './dialog.component';
import { DialogWrapperComponent } from './dialog-wrapper.component';
import { DialogOptions } from './interfaces';

@Component({
  selector: 'dialog-holder',
  template: '<ng-template #element></ng-template>',
})
export class DialogHolderComponent {
  /**
   * Target element to insert dialogs
   */
  @ViewChild('element', { read: ViewContainerRef, static: true }) public element: ViewContainerRef;

  /**
   * Array of dialogs
   */
  dialogs: Array<DialogComponent<any, any>> = [];

  /**
   * Constructor
   */
  constructor(private resolver: ComponentFactoryResolver, @Inject(DOCUMENT) private doc: any) {}

  private get body(): HTMLBodyElement {
    return this.doc.body;
  }

  /**
   * Adds dialog
   */
  addDialog<T, T1>(component: Type<DialogComponent<T, T1>>, data?: T, options?: DialogOptions): Observable<T1> {
    options = {
      backdrop: true,
      backdropColor: 'rgba(0,0,0,.5)',
      keyboard: true,
      ...options,
    };

    if (options.backdrop === false) options.backdropColor = '';

    // add body class if this is the only dialog in the stack
    if (!this.body.classList.contains('modal-open')) {
      this.body.classList.add('modal-open');
    }

    const factory = this.resolver.resolveComponentFactory(DialogWrapperComponent);
    const componentRef = this.element.createComponent(factory, options.index);
    const dialogWrapper = componentRef.instance;
    const _component = dialogWrapper.addComponent(component);
    _component.options = options;
    if (typeof options.index !== 'undefined') {
      this.dialogs.splice(options.index, 0, _component);
    } else {
      this.dialogs.push(_component);
    }
    const containerEl = dialogWrapper.container.nativeElement;
    setTimeout(() => {
      containerEl.classList.add('show', 'in');
    });
    if (options.timeout && options.timeout > 0) {
      setTimeout(() => {
        this.removeDialog(_component);
      }, options.timeout);
    }
    // Backdrop
    if (options.backdrop === true) {
      this.closeByClickOutside(_component);
    }
    if (options.backdropColor) {
      containerEl.style.backgroundColor = options.backdropColor;
    }
    // Auto focues
    if (options.autoFocus !== false) {
      setTimeout(() => {
        const autoFocusEl = _component.wrapper.container.nativeElement.querySelector('[autofocus]') as HTMLDivElement;
        if (autoFocusEl) autoFocusEl.focus();
      }, 100);
    }
    return _component.fillData(data);
  }

  /**
   * Removes dialog
   */
  removeDialog(component: DialogComponent<any, any>) {
    const element = component.wrapper.container.nativeElement;

    element.classList.remove('show');
    element.classList.remove('in');
    setTimeout(() => {
      this._removeElement(component);
      if (this.dialogs.length === 0) this.body.classList.remove('modal-open');
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
    // tslint:disable-next-line: deprecation
    if (component.options.keyboard === true && event.keyCode === 27) this.removeDialog(component);
  }

  private closeByClickOutside(component: DialogComponent<any, any>) {
    const containerEl = component.wrapper.container.nativeElement;
    containerEl.querySelector('.modal-content').addEventListener('click', (event: any) => {
      event.stopPropagation();
    });
    containerEl.addEventListener(
      'click',
      () => {
        this.removeDialog(component);
      },
      false,
    );
  }
}
