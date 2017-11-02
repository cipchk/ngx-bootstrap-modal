export interface BuiltInOptions {
    /**
     * 模态框类型
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
     * @type {any}
     */
    inputValue?: any;
    /**
     * Input `required` 字段，必填项校验失败时【确定】按钮为 `disabled` 状态。
     *
     * @type {boolean}
     * @default true
     */
    inputRequired?: boolean;
    /**
     * Input 正则判断校验，校验失败时【确定】按钮为 `disabled` 状态。
     *
     * @type {RegExp}
     */
    inputRegex?: RegExp;
    /**
     * 输入参数无效时提醒文本。
     *
     * @type {string}
     */
    inputError?: string;
    /**
     * 数据两种数据格式：键值对象或{text:string}[]数组，如果input值为 `select` `radio` `checkbox` 时为必填项。
     * 对象键表示属性名，对象值表示属性值
     *
     * @type {*}
     */
    inputOptions?: { text: string, [key: string]: any }[] | any;
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
     * 是否包括背景且点击背景会关闭，如果传递的是字符串 'static' 点击背景不会关闭。
     *
     * @type {boolean}
     * @default true
     */
    backdrop?: boolean | 'static';

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
    /**
     * 自动关闭时间（单位：ms）
     *
     * @type {number}
     * @default 不会自动关闭
     */
    timeout?: number;
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

    [key: string]: any;
}
