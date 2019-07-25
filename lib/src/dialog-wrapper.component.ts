import {
  Component,
  ViewContainerRef,
  ViewChild,
  ComponentFactoryResolver,
  Type,
  Injector,
  ElementRef,
  ViewEncapsulation,
} from '@angular/core';
import { DialogComponent } from './dialog.component';

@Component({
  selector: 'dialog-wrapper',
  template: `
    <div #container class="modal fade" style="display:block !important;" role="dialog">
      <ng-template #element></ng-template>
    </div>
  `,
  preserveWhitespaces: false,
  encapsulation: ViewEncapsulation.None,
})
export class DialogWrapperComponent {
  /**
   * Target element to insert dialog content component
   */
  @ViewChild('element', { read: ViewContainerRef, static: true }) public element: ViewContainerRef;

  /**
   * Link container DOM element
   */
  @ViewChild('container', { static: true }) public container: ElementRef<HTMLElement>;

  /**
   * Dialog content componet
   */
  private content: DialogComponent<any, any>;

  /**
   * Constructor
   */
  constructor(private resolver: ComponentFactoryResolver) {}

  /**
   * Adds content dialog component to wrapper
   */
  addComponent<T, T1>(component: Type<DialogComponent<T, T1>>) {
    const factory = this.resolver.resolveComponentFactory(component);
    const injector = Injector.create({ providers: [], parent: this.element.injector });
    const componentRef = factory.create(injector);
    this.element.insert(componentRef.hostView);
    this.content = componentRef.instance as DialogComponent<T, T1>;
    this.content.wrapper = this;
    return this.content;
  }
}
