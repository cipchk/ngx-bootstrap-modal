# ngx-bootstrap-modal
simplify the work with bootstrap modal dialogs

[![NPM version](https://img.shields.io/npm/v/ngx-bootstrap-modal.svg)](https://www.npmjs.com/package/ngx-bootstrap-modal)
[![Build Status](https://travis-ci.org/cipchk/ngx-bootstrap-modal.svg?branch=master)](https://travis-ci.org/cipchk/ngx-bootstrap-modal)

一个简单的**引导Bootstrap模态框组件启动**的服务，无须引入Bootstrap JS文件，并且兼容Bootstrap 3 4 版本。

> 组件的核心代码都来自［ng2-bootstrap-modal](https://github.com/ankosoftware/ng2-bootstrap-modal)，在此基础上做了适量优化。

## 安装

```
npm install ngx-bootstrap-modal --save
```

[在线DEMO](https://cipchk.github.io/ngx-bootstrap-modal/)，以及一个[plnkr](http://plnkr.co/edit/QrmKH1M9KOde9wtQesTt?p=preview)在线示例。

## 项目没有使用Bootstrap

没有关系，你可以加入以下CSS，依然也可以使用：

```css
.modal {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 1050;
    overflow: hidden;
    -webkit-overflow-scrolling: touch;
    outline: 0;
}

.fade {
    opacity: 0;
    -webkit-transition: opacity .15s linear;
    -o-transition: opacity .15s linear;
    transition: opacity .15s linear;
}

.fade.in {
    opacity: 1;
}

.modal-dialog {
    position: relative;
    width: auto;
    margin: 10px;
}

.modal.in .modal-dialog {
    -webkit-transform: translate(0,0);
    -ms-transform: translate(0,0);
    -o-transform: translate(0,0);
    transform: translate(0,0);
}

.modal.fade .modal-dialog {
    -webkit-transition: -webkit-transform .3s ease-out;
    -o-transition: -o-transform .3s ease-out;
    transition: transform .3s ease-out;
    -webkit-transform: translate(0,-25%);
    -ms-transform: translate(0,-25%);
    -o-transform: translate(0,-25%);
    transform: translate(0,-25%);
}

@media (min-width: 768px) {
    .modal-dialog {
        width: 600px;
        margin: 30px auto;
    }
}
```

## 五分钟入门

### 1、添加 bootstrap

如果项目已经使用，就无须再引入。否则，你可以使用CDN版本。

```html
<!-- Bootstrap 3.x -->
<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" integrity="sha384-BVYiiSIFeK1dGmJRAkycuHAHRg32OmUcww7on3RYdg4Va+PmSTsz/K68vbdEjh4u" crossorigin="anonymous">
```

或

```html
<!-- Bootstrap 4.x -->
<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0-alpha.6/css/bootstrap.min.css" integrity="sha384-rwoIResjU2yc3z8GV/NPeZWAv56rSmLldC3R/AZzGRnGxQQKnKkoFVhFQhNUwEyJ" crossorigin="anonymous">
```

### 2、导入 `BootstrapModalModule` 模块

app.module.ts：

```typescript
import { NgModule} from '@angular/core';
import { CommonModule } from "@angular/common";
import { BrowserModule } from '@angular/platform-browser';
import { BootstrapModalModule } from 'ngx-bootstrap-modal';
import { AppComponent } from './app.component';
@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    CommonModule,
    BrowserModule,
    BootstrapModalModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
```

默认模态框创建的茅坑会在 _AppComponent_ 下面，但你也可以指定一个位置，比如：

```typescript
imports: [
    ...
    BootstrapModalModule.forRoot({container:document.body})
  ]
```

如果你遇到模态框的 `z-index` 关系会因为显示上很奇怪，那就可以试试。

### 3、创建模态框组件

前面说到**引导Bootstrap模态框组件启动**，换句话你需要创建一个组件，然后由 `ngx-bootstrap-model` 帮你引导启动。

只是对于这个组件需要继承 `DialogComponent<T, T1>` 类，包含两个参数：

+ `T` 外部传参给模态框的类型。
+ `T1` 模态框返回值类型。

因此，**DialogService**应该是**DialogComponent**的一个构造函数的参数。

confirm.component.ts：

```typescript
import { Component } from '@angular/core';
import { DialogComponent, DialogService } from "ngx-bootstrap-modal";
export interface ConfirmModel {
  title:string;
  message:string;
}
@Component({  
    selector: 'confirm',
    template: `<div class="modal-dialog">
                <div class="modal-content">
                   <div class="modal-header">
                     <button type="button" class="close" (click)="close()" >&times;</button>
                     <h4 class="modal-title">{{title || 'Confirm'}}</h4>
                   </div>
                   <div class="modal-body">
                     <p>{{message || 'Are you sure?'}}</p>
                   </div>
                   <div class="modal-footer">
                     <button type="button" class="btn btn-primary" (click)="confirm()">OK</button>
                     <button type="button" class="btn btn-default" (click)="close()" >Cancel</button>
                   </div>
                 </div>
              </div>`
})
export class ConfirmComponent extends DialogComponent<ConfirmModel, boolean> implements ConfirmModel {
  title: string;
  message: string;

  // 构造函数需要一个DialogService参数
  constructor(dialogService: DialogService) {
    super(dialogService);
  }
  
  confirm() {
    // result是一个boolean类型，这一点取决于{DialogComponent<ConfirmModel, boolean>}
    this.result = true;
    // close() 方法是由 `DialogComponent` 定义的，用于关闭静态框。在HTML模板中也有可以调用。
    this.close(); 
  }
}
```

### 4、注册模态框组件

由于内部是动态创建组件，所以我们还需要在 **declarations** 和 **entryComponents** 分别注册这个静态框组件。

app.module.ts:

```typescript
import { NgModule} from '@angular/core';
import { CommonModule } from "@angular/common";
import { BrowserModule } from '@angular/platform-browser';
import { BootstrapModalModule } from 'ngx-bootstrap-modal';
import { ConfirmComponent } from './confirm.component';
import { AppComponent } from './app.component';
@NgModule({
    declarations: [
    AppComponent,
    ConfirmComponent
    ],
    imports: [
    CommonModule,
    BrowserModule,
    BootstrapModalModule
    ],
    // 别忘记
    entryComponents: [
    ConfirmComponent
    ],
    bootstrap: [AppComponent]
})
export class AppModule {}
```

### 5、使用

所有事情都完毕后调用就变得很简单了，使用 `DialogService.addDialog` 可以创建我们创建的静态框组件了。

app.component.ts

```typescript
import { Component } from '@angular/core';
import { ConfirmComponent } from './confirm.component';
import { DialogService } from "ngx-bootstrap-modal";

@Component({
    selector: 'app',
    template: `
    <div class="container">
        <button class="btn btn-default" (click)=showConfirm()>Show confirm</button>
    </div>
    `
})
export class AppComponent {
    constructor(private dialogService:DialogService) {}
    showConfirm() {
        let disposable = this.dialogService.addDialog(ConfirmComponent, {
            title:'Confirm title', 
            message:'Confirm message'})
            .subscribe((isConfirmed)=>{
                //We get dialog result
                if(isConfirmed) {
                    alert('accepted');
                }
                else {
                    alert('declined');
                }
            });
        // 可以调用 disposable.unsubscribe() 关闭对话框
        setTimeout(()=>{
            disposable.unsubscribe();
        },10000);
    }
}
```

## 文档

### DialogComponent

```typescript
/**
* Dialog abstract class
* @template T1 - input dialog data
* @template T2 - dialog result
*/
abstract class DialogComponent<T1, T2> implements T1 {
    /**
    * Constructor
    * @param {DialogService} dialogService - instance of DialogService
    */
    constructor(dialogService: DialogService);
    
    /**
    * Dialog result 
    * @type {T2}
    */
    protected result:T2;
    
    /**
    * Closes dialog
    */
    public close:Function;
}
```

### DialogOptions

```typescript
interface DialogOptions {
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
```

### DialogService

```typescript
class DialogService {
    /**
    * 添加组件
    * @param {Type<DialogComponent<T1, T2>} component - Modal dialog component
    * @param {T1?} data - Initialization data for component (optional) to add to component instance and can be used in component code or template 
    * @param {DialogOptions?} Dialog options
    * @return {Observable<T2>} - returns Observable to get dialog result
    */
    public addDialog<T1, T2>(component:Type<DialogComponent<T1, T2>>, data?:T1, options: DialogOptions): Observable<T2> => {}

    /**
     * 移除指定组件
     * @param {DialogComponent} component
     */
    removeDialog(component: DialogComponent<any, any>): void {
        if (!this.dialogHolderComponent) {
            return;
        }
        this.dialogHolderComponent.removeDialog(component);
    }

    /**
     * 移除所有批件
     */
    removeAll(): void {
        this.dialogHolderComponent.clear();
    }
}
```
