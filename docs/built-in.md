# 内置模态使用方法

内置模态框包括 `alert` `confirm` `prompt` 三种形态，下面介绍如何具体使用。

## 1、添加 bootstrap

如果项目已经使用，就无须再引入。否则，你可以使用CDN版本，内置模态对Bootstrap的依赖比较多一点，所以建议如果你的项目不是以Bootstrap为基础，那么可以放弃之！

```html
<!-- Bootstrap 3.x -->
<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" integrity="sha384-BVYiiSIFeK1dGmJRAkycuHAHRg32OmUcww7on3RYdg4Va+PmSTsz/K68vbdEjh4u" crossorigin="anonymous">
```

或

```html
<!-- Bootstrap 4.x -->
<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0-alpha.6/css/bootstrap.min.css" integrity="sha384-rwoIResjU2yc3z8GV/NPeZWAv56rSmLldC3R/AZzGRnGxQQKnKkoFVhFQhNUwEyJ" crossorigin="anonymous">
```

## 2、导入 `BootstrapModalModule` 模块

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
    BootstrapModalModule.forRoot() // 如果模块延迟加载使用 `BootstrapModalModule.forRoot({container:document.body})`
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

`forRoot` 还包含另一个内置模态专属的全局默认配置项。

```typescript
imports: [
    ...
    BootstrapModalModule.forRoot({
        container:document.body,
        builtInOptions: <BuiltInOptions>{
            size: 'lg', // 默认大size
            cancelButtonClass: 'btn-outline-secondary', // 默认取消按钮样式为镂空型
            confirmButtonClass: 'btn-outline-success'
        }
    })
  ]
```

## 3、使用

app.component.ts

```typescript
import { Component } from '@angular/core';
import { ConfirmComponent } from './confirm.component';
import { DialogService } from "ngx-bootstrap-modal";

@Component({
    selector: 'app',
    template: `
    <div class="container">
        <button class="btn btn-default" (click)="dialogService.alert('提醒', '确认要删除吗？');">Show confirm</button>
        <button class="btn btn-default" (click)="showConfirm()">Show confirm</button>
    </div>
    `
})
export class AppComponent {
    constructor(public dialogService:DialogService) {}
    showConfirm() {
        // confirm 返回的是一个 Promise<boolean> 类型，如果在对话框中点【确认】返回 `true`，其他情况返回 `false`
        this.dialogService.confirm('提醒', '确认要删除吗？', <BuiltInOptions>{
            // 可选项，可以对部分参数重写
        }).then((result: boolean) => {
            // result
        });
    }
}
```

## Show

前面说内置模态框包括 `alert` `confirm` `prompt` 三种形态，这三种形态其实是 `show` 的简化版本，你可以使用 `show` 方法来构建更有意思的模态框。

例如，创建一个带有 icon 的正确提示框。

![Success](success.gif)

```typescript
this.dialogService.show(<BuiltInOptions>{
    content: '保存成功',
    icon: 'success',
    size: 'sm',
    showCancelButton: false
})
```

有关更多参数细节见 [BuiltInOptions](#builtinoptions)

## DialogService

```typescript
class DialogService {
    /**
     * 构建一个内置模态
     * @param builtInOptions 内置配置参数
     * @param options 模态配置参数
     */
    show(builtInOptions: BuiltInOptions, options?: DialogOptions) {}

    /**
     * Show Alter
     *
     * @param {string} title
     * @param {string} content
     * @param {BuiltInOptions} 覆盖内置配置参数
     */
    alert(title: string, content: string, options?: BuiltInOptions) {}

    /**
     * Show confirm
     *
     * @param {string} title
     * @param {string} content
     * @param {BuiltInOptions} 覆盖内置配置参数
     * @returns {Promise<boolean>} 返回一个Promise布尔类型
     */
    confirm(title: string, content: string, options?: BuiltInOptions): Promise<boolean> {}

    /**
     * Show prompt
     *
     * @param {string} title
     * @param {BuiltInOptions} 覆盖内置配置参数
     * @returns {Promise<any>} 返回一个Promise任意类型
     */
    prompt(title: string, promptOptions?: BuiltInOptions): Promise<any> {}
}
```

## BuiltInOptions

| 名称    | 类型           | 默认值  | 描述 |
| ------- | ------------- | ----- | ----- |
| type | string | default | 模态框类型，值包含 `default`、`alert`、`confirm`、`prompt`。 |
| title | string |  | 标题 |
| content | string |  | 内容，支持HTML |
| icon | string |  | icon 类型，指定的情况下 `title` 被隐藏同时 `content` 将居中显示，值包含 `warning`、`error`、`success`、`info`、`question`。 |
| input | string |  | 当 `type==='prompt` 时生效，Input `type` 字段，值包含 `text`、`email`、`password`、`number`、`tel`、`range`、`textarea`、`select`、`radio`、`checkbox`、`url`。 |
| inputPlaceholder | string |  | Input `placeholder` 字段 |
| inputValue | any |  | Input 初始化值 |
| inputRequired | any |  | Input `required` 字段，必填项校验失败时【确定】按钮为 `disabled` 状态。 |
| inputRegex | RegExp |  | Input 正则判断校验，校验失败时【确定】按钮为 `disabled` 状态。 |
| inputError | string |  | 输入参数无效时提醒文本。 |
| inputOptions | { text: string }[]或Object |  | 数据两种数据格式：键值对象或{text:string}[]数组，如果input值为 `select` `radio` `checkbox` 时为必填项。对象键表示属性名，对象值表示属性值。当 `checkbox` 时为字符串文本，用于显示 checkbox 后面的文本。 |
| inputAttributes | any |  | HTML元素属性对象，例如 `min` `max` 等，对象键表示属性名，对象值表示属性值 |
| size | string | sm | 尺寸，包含值：`lg`、`sm` |
| className | string |  | 自定义class |
| showCloseButton | boolean | true | 右上角显示关闭按钮 |
| showCancelButton | boolean | true | 显示取消按钮 |
| cancelButtonText | string | 取消 | 取消按钮文本 |
| cancelButtonClass | string | btn-default | 取消按钮CSS类 |
| showConfirmButton | boolean | true | 显示确认按钮 |
| confirmButtonText | string | 确认 | 确认按钮文本 |
| confirmButtonClass | string | btn-primary | 确认按钮CSS类 |
| backdrop |  | false | 是否包括背景且点击背景会关闭，如果传递的是字符串 'static' 点击背景不会关闭。 |
| backdropColor |  | rgba(0,0,0,.5) | 背景色 |
| keyboard |  | true | 键盘上的 esc 键被按下时关闭模态框。 |
| timeout | number | 0 | 自动关闭时间（单位：ms），0表示不会自动关闭 |
| onShow | Function |  | 显示时回调函数 |
| onHide | Function |  | 隐藏时回调函数 |
