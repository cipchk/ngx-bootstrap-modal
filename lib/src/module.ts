import {
  NgModule,
  ModuleWithProviders,
  ComponentFactoryResolver,
  ApplicationRef,
  Injector,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DialogHolderComponent } from './dialog-holder.component';
import { DialogWrapperComponent } from './dialog-wrapper.component';
import { DialogService, DialogServiceConfig } from './dialog.service';
import { BuiltInComponent } from './built-in.dialog';

/**
 * Dialog service factory. Creates dialog service with options
 */
export function dialogServiceFactory(
  resolver: ComponentFactoryResolver,
  applicationRef: ApplicationRef,
  injector: Injector,
  options: DialogServiceConfig,
) {
  return new DialogService(resolver, applicationRef, injector, options);
}

@NgModule({
  imports: [CommonModule, FormsModule],
  declarations: [
    DialogHolderComponent,
    DialogWrapperComponent,
    BuiltInComponent,
  ],
  providers: [DialogService],
  entryComponents: [
    DialogHolderComponent,
    DialogWrapperComponent,
    BuiltInComponent,
  ],
})
export class BootstrapModalModule {
  static forRoot(config: DialogServiceConfig): ModuleWithProviders {
    return {
      ngModule: BootstrapModalModule,
      providers: [
        { provide: DialogServiceConfig, useValue: config },
        {
          provide: DialogService,
          useFactory: dialogServiceFactory,
          deps: [
            ComponentFactoryResolver,
            ApplicationRef,
            Injector,
            DialogServiceConfig,
          ],
        },
      ],
    };
  }

  static forChild(): ModuleWithProviders {
    return {
      ngModule: BootstrapModalModule,
      providers: [
        {
          provide: DialogService,
          useFactory: dialogServiceFactory,
          deps: [
            ComponentFactoryResolver,
            ApplicationRef,
            Injector,
            DialogServiceConfig,
          ],
        },
      ],
    };
  }
}
