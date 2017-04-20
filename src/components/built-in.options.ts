export interface BuiltInOptions {
    /**
     * 静态框类型
     * 
     * @type {('default' | 'alert' | 'confirm' | 'prompt')}
     */
    type?: 'default' | 'alert' | 'confirm' | 'prompt';
    /**
     * 标题
     * 
     * @type {string}
     */
    title?: string;
    /**
     * 内容，支持HTML
     * 
     * @type {string}
     */
    content?: string;
    /**
     * icon 类型，指定的情况下居中显示
     * 
     * @type {string}
     */
    icon?: 'warning' | 'error' | 'success' | 'info' | 'question';
    /**
     * Input `type` 字段
     * 
     * @type {string}
     */
    input?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'range' | 'textarea' | 'select' | 'radio' | 'checkbox' | 'url';
    /**
     * Input `placeholder` 字段
     * 
     * @type {string}
     */
    inputPlaceholder?: string;
    /**
     * Input 初始化值
     * 
     * @type {string}
     */
    inputValue?: string;
    /**
     * Input `required` 字段 
     * 
     * @type {boolean}
     * @default true
     */
    inputRequired?: boolean;
    /**
     * Input 正则判断
     * 
     * @type {RegExp}
     */
    inputRegex?: RegExp;
    /**
     * 输入参数无效时提醒
     * 
     * @type {string}
     */
    inputError?: string;
    /**
     * 数据键值对象，如果input值为 `select` `radio` `checkbox` 时为必填项。
     * 对象键表示属性名，对象值表示属性值
     * 
     * @type {*}
     */
    inputOptions?: any;
    /**
     * HTML元素属性对象，例如 `min` `max` 等，对象键表示属性名，对象值表示属性值
     * 
     * @type {*}
     */
    inputAttributes?: any;
    /**
     * 尺寸（默认：sm）
     * 
     * @type {('lg' | 'sm')}
     * @default 'sm'
     */
    size?: 'lg' | 'sm';
    /**
     * 自定义class
     * 
     * @type {string}
     */
    className?: string;
    /**
     * 右上角显示关闭按钮
     * 
     * @type {boolean}
     * @default true
     */
    showCloseButton?: boolean;
    /**
     * 显示取消按钮（默认显示）
     * 
     * @type {boolean}
     * @default true
     */
    showCancelButton?: boolean;
    /**
     * 取消按钮文本（默认：取消）
     * 
     * @type {string}
     * @default '取消'
     */
    cancelButtonText?: string;
    /**
     * 取消按钮CSS类（默认：btn-default
     * 
     * @type {string}
     * @default 'btn-default'
     */
    cancelButtonClass?: string;
    /**
     * 显示确认按钮（默认显示）
     * 
     * @type {boolean}
     * @default true
     */
    showConfirmButton?: boolean;
    /**
     * 确认按钮文本（默认：确认）
     * 
     * @type {string}
     * @default '确认'
     */
    confirmButtonText?: string;
    /**
     * 确认按钮CSS类（默认：btn-primary）
     * 
     * @type {string}
     * @default 'btn-primary'
     */
    confirmButtonClass?: string;

    /**
     * 显示时回调函数
     * 
     * @type {Function}
     */
    onShow?: Function;

    /**
     * 隐藏时回调函数
     * 
     * @type {Function}
     */
    onHide?: Function;
}
