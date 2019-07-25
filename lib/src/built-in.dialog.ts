import { Component, ViewEncapsulation, ViewChild, OnInit, ElementRef } from '@angular/core';
import { DialogComponent } from './dialog.component';
import { BuiltInOptions } from './built-in.options';

@Component({
  selector: 'dialog-built-in',
  templateUrl: './built-in.dialog.html',
  styleUrls: ['./dialog.scss'],
  encapsulation: ViewEncapsulation.None,
  preserveWhitespaces: false,
})
export class BuiltInComponent extends DialogComponent<BuiltInOptions, any> implements OnInit {
  @ViewChild('container', { static: true }) private container: ElementRef<HTMLElement>;
  opt: BuiltInOptions;
  checkboxMap: any = {};
  classs: any = {};

  prompError = false;
  promptData: any;

  ngOnInit() {
    const options = this.opt;
    if (options.className) this.classs[options.className] = true;

    if (options.icon) this.classs['has-icon'] = true;

    if (options.type === 'prompt') {
      if (!options.inputRegex) {
        switch (options.input) {
          case 'email':
            options.inputRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            if (!options.inputError) options.inputError = '邮箱格式不正确';
            break;
          case 'url':
            options.inputRegex = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
            if (!options.inputError) options.inputError = '网址格式不正确';
            break;
        }
      }

      if (options.inputOptions && !Array.isArray(options.inputOptions)) {
        const keys = [];
        // tslint:disable-next-line:forin
        for (const key in options.inputOptions) {
          keys.push({ key, text: options.inputOptions[key] });
        }
        options.inputOptions = keys;
      }
      options.inputOptions = { ...[], ...options.inputOptions };

      options.inputAttributes = {
        maxlength: null,
        min: 0,
        max: 100,
        step: 1,
        ...options.inputAttributes,
      };
    }

    // 默认值
    let defaultValue = options.inputValue;
    if (options.input === 'checkbox' && !Array.isArray(options.inputValue)) {
      defaultValue = typeof defaultValue !== 'undefined' ? [defaultValue] : [];
    }
    options.inputValue = defaultValue || '';

    this.promptData = options.inputValue;
    if (this.promptData) {
      this.promptCheck();
    }

    setTimeout(() => {
      this.setFocus();
    }, 100);
  }

  private promptCheck(): boolean {
    if (this.opt.inputRequired === true) {
      if (this.opt.input === 'checkbox' && this.promptData.length === 0) {
        this.prompError = true;
        return false;
      }
      if (!this.promptData) {
        this.prompError = true;
        return false;
      }
    }

    if (this.opt.inputRegex && !this.opt.inputRegex.test(this.promptData.toString())) {
      this.prompError = true;
      return false;
    }

    this.prompError = false;
    return true;
  }

  private setFocus() {
    const containerEl = this.container.nativeElement;
    let firstFormEl: any = null;
    if (this.opt.type === 'prompt') {
      firstFormEl = containerEl.querySelector('input, textarea, select');
    } else {
      firstFormEl = containerEl.querySelector('button.confirm');
    }
    if (firstFormEl) firstFormEl.focus();
  }

  onChanage() {
    this.promptCheck();
  }

  onKeyup(event: KeyboardEvent) {
    // tslint:disable-next-line: deprecation
    if (event.keyCode === 13) {
      this.ok();
    }
  }

  ok() {
    switch (this.opt.type) {
      case 'confirm':
        this.result = true;
        break;
      case 'prompt':
        if (!this.promptCheck()) return;
        let ret = this.promptData;
        if (this.opt.input === 'checkbox') {
          ret = this.opt.inputOptions
            .filter((item: any) => item._checked)
            .map((item: any) => {
              delete item._checked;
              return item;
            });
        }
        this.result = ret;
        break;
    }

    this.close();
  }
}
