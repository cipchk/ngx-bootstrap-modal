import { OnDestroy } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import { DialogWrapperComponent } from './dialog-wrapper.component';
import { DialogService, DialogOptions } from './dialog.service';

/**
 * Abstract dialog
 * @template T - dialog data;
 * @template T1 - dialog result
 */
export class DialogComponent<T, T1> {

    public options: DialogOptions;

    /**
     * Observer to return result from dialog
     */
    private observer: Observer<T1>;

    /**
     * Dialog result
     * @type {T1}
     */
    protected result: T1;

    /**
     * Dialog wrapper (modal placeholder)
     */
    wrapper: DialogWrapperComponent;

    /**
     * Constructor
     * @param {DialogService} dialogService - instance of DialogService
     */
    constructor(protected dialogService: DialogService) { }

    /**
     *
     * @param {T} data
     * @return {Observable<T1>}
     */
    fillData(data: any): Observable<T1> {
        data = data || <any>{};
        const keys = Object.keys(data);
        for (let i = 0, length = keys.length; i < length; i++) {
            const key = keys[i];
            this[key] = data[key];
        }
        return Observable.create((observer: any) => {
            this.observer = observer;
            return () => {
                this.close();
            }
        });
    }

    /**
     * Closes dialog
     */
    close(result?: T1): void {
        if (typeof result !== 'undefined') this.result = result;
        this.dialogService.removeDialog(this);
        if (this.observer) {
            this.observer.next(this.result);
            this.observer.complete();
        }
    }

    [key: string]: any;
}
