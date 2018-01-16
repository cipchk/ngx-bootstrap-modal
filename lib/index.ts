import { NgModule, ModuleWithProviders, ComponentFactoryResolver, ApplicationRef, Injector } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DialogHolderComponent } from './components/dialog-holder.component';
import { DialogWrapperComponent } from './components/dialog-wrapper.component';
import { DialogService, DialogServiceConfig } from './components/dialog.service';
import { BuiltInComponent } from './components/built-in.dialog';

export { DialogComponent } from './components/dialog.component';
export { DialogService, DialogOptions, DialogServiceConfig } from './components/dialog.service';
export { BuiltInOptions } from './components/built-in.options';
export { BuiltInComponent } from './components/built-in.dialog';

/**
 * Dialog service factory. Creates dialog service with options
 * @param { ComponentFactoryResolver } resolver
 * @param { ApplicationRef } applicationRef
 * @param { Injector } injector
 * @param { DialogServiceConfig } options
 * @return { DialogService }
 */
export function dialogServiceFactory(resolver: ComponentFactoryResolver, applicationRef: ApplicationRef, injector: Injector, options: DialogServiceConfig) {
    return new DialogService(resolver, applicationRef, injector, options);
}

@NgModule({
    imports: [
        CommonModule,
        FormsModule
    ],
    declarations: [
        DialogHolderComponent,
        DialogWrapperComponent,
        BuiltInComponent
    ],
    providers: [
        DialogService
    ],
    entryComponents: [
        DialogHolderComponent,
        DialogWrapperComponent,
        BuiltInComponent
    ]
})
export class BootstrapModalModule {
    static forRoot(config: DialogServiceConfig): ModuleWithProviders {
        return {
            ngModule: BootstrapModalModule,
            providers: [
                {provide: DialogServiceConfig, useValue: config},
                {
                    provide: DialogService,
                    useFactory: dialogServiceFactory,
                    deps: [ComponentFactoryResolver, ApplicationRef, Injector, DialogServiceConfig]
                }
            ]
        };
    }

    static forChild(): ModuleWithProviders {
        return {
            ngModule: BootstrapModalModule,
            providers: [
                {
                    provide: DialogService,
                    useFactory: dialogServiceFactory,
                    deps: [ComponentFactoryResolver, ApplicationRef, Injector, DialogServiceConfig]
                }
            ]
        };
    }
}

