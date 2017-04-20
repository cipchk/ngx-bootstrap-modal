## 自定义模态框

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
    // close() 方法是由 `DialogComponent` 定义的，用于关闭模态框。在HTML模板中也有可以调用。
    this.close(); 
  }
}
```

### 4、注册模态框组件

由于内部是动态创建组件，所以我们还需要在 **declarations** 和 **entryComponents** 分别注册这个模态框组件。

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

所有事情都完毕后调用就变得很简单了，使用 `DialogService.addDialog` 可以创建我们创建的模态框组件了。

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
