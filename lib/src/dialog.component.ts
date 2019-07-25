import { Inject } from '@angular/core';
import { Observer, Observable } from 'rxjs';
import { DialogWrapperComponent } from './dialog-wrapper.component';
import { DialogService } from './dialog.service';
import { DialogOptions } from './interfaces';

/**
 * Abstract dialog
 * @template T - dialog data;
 * @template T1 - dialog result
 */
export abstract class DialogComponent<T, T1> {
  /**
   * Observer to return result from dialog
   */
  private observer: Observer<T1>;

  /**
   * Dialog result
   */
  protected result: T1;

  options: DialogOptions;

  /**
   * Dialog wrapper (modal placeholder)
   */
  wrapper: DialogWrapperComponent;

  /**
   * Constructor
   */
  constructor(@Inject(DialogService) protected dialogService: DialogService) {}

  fillData(data: any): Observable<T1> {
    data = data || ({} as any);
    const keys = Object.keys(data);
    for (let i = 0, length = keys.length; i < length; i++) {
      const key = keys[i];
      this[key] = data[key];
    }
    return new Observable(observer => {
      this.observer = observer;
      return () => this.close();
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
