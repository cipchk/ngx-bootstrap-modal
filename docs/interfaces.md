# 接口说明

## DialogOptions

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

## DialogService

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
    removeDialog(component: DialogComponent<any, any>): void {}

    /**
     * 移除所有批件
     */
    removeAll(): void {}

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

## DialogComponent

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

## BuiltInOptions

| 名称    | 类型           | 默认值  | 描述 |
| ------- | ------------- | ----- | ----- |
| type | string | default | 模态框类型，值包含 `default`、`alert`、`confirm`、`prompt`。 |
| title | string |  | 标题 |
| content | string |  | 内容，支持HTML |
| icon | string |  | icon 类型，指定的情况下内容将居中显示，值包含 `warning`、`error`、`success`、`info`、`question`。 |
| input | string |  | 当 `type==='prompt` 时生效，Input `type` 字段，值包含 `text`、`email`、`password`、`number`、`tel`、`range`、`textarea`、`select`、`radio`、`checkbox`、`url`。 |
| inputPlaceholder | string |  | Input `placeholder` 字段 |
| inputValue | any |  | Input 初始化值 |
| inputRequired | any |  | Input `required` 字段，必填项校验失败时【确定】按钮为 `disabled` 状态。 |
| inputRegex | RegExp |  | Input 正则判断校验，校验失败时【确定】按钮为 `disabled` 状态。 |
| inputError | string |  | 输入参数无效时提醒文本。 |
| inputOptions | any |  | 数据键值对象，如果input值为 `select` `radio` `checkbox` 时为必填项。对象键表示属性名，对象值表示属性值。当 `checkbox` 时为字符串文本，用于显示 checkbox 后面的文本。 |
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
| backdrop | boolean, 'static' | false | 是否包括背景且点击背景会关闭，如果传递的是字符串 'static' 点击背景不会关闭。 |
| backdropColor |  | rgba(0,0,0,.5) | 背景色 |
| keyboard |  | true | 键盘上的 esc 键被按下时关闭模态框。 |
| timeout | number | 0 | 自动关闭时间（单位：ms），0表示不会自动关闭 |
| onShow | Function |  | 显示时回调函数 |
| onHide | Function |  | 隐藏时回调函数 |
