export interface BuiltInOptions {
  /**
   * 模态框类型
   */
  type?: 'default' | 'alert' | 'confirm' | 'prompt';
  /**
   * 标题
   */
  title?: string;
  /**
   * 内容，支持HTML
   */
  content?: string;
  /**
   * icon 类型，指定的情况下居中显示
   */
  icon?: 'warning' | 'error' | 'success' | 'info' | 'question';
  /**
   * Input `type` 字段
   */
  input?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'range' | 'textarea' | 'select' | 'radio' | 'checkbox' | 'url';
  /**
   * Input `placeholder` 字段
   */
  inputPlaceholder?: string;
  /**
   * Input 初始化值
   */
  inputValue?: any;
  /**
   * Input `required` 字段，必填项校验失败时【确定】按钮为 `disabled` 状态，默认：`true`
   */
  inputRequired?: boolean;
  /**
   * Input 正则判断校验，校验失败时【确定】按钮为 `disabled` 状态。
   */
  inputRegex?: RegExp;
  /**
   * 输入参数无效时提醒文本。
   */
  inputError?: string;
  /**
   * 数据两种数据格式：键值对象或{text:string}[]数组，如果input值为 `select` `radio` `checkbox` 时为必填项。
   * 对象键表示属性名，对象值表示属性值
   */
  inputOptions?: { text: string; [key: string]: any }[] | any;
  /**
   * HTML元素属性对象，例如 `min` `max` 等，对象键表示属性名，对象值表示属性值
   */
  inputAttributes?: any;
  /**
   * 尺寸，默认：`sm`
   */
  size?: 'lg' | 'sm';
  /**
   * 自定义class
   */
  className?: string;
  /**
   * 右上角显示关闭按钮，默认：`true`
   */
  showCloseButton?: boolean;
  /**
   * 显示取消按钮，默认：`true`
   */
  showCancelButton?: boolean;
  /**
   * 取消按钮文本，默认：`取消`
   */
  cancelButtonText?: string;
  /**
   * 取消按钮CSS类，默认：`btn-default`
   */
  cancelButtonClass?: string;
  /**
   * 显示确认按钮，默认：`true`
   */
  showConfirmButton?: boolean;
  /**
   * 确认按钮文本，默认：`确认`
   */
  confirmButtonText?: string;
  /**
   * 确认按钮CSS类，默认：`btn-primary`
   */
  confirmButtonClass?: string;

  /**
   * 是否包括背景且点击背景会关闭，如果传递的是字符串 'static' 点击背景不会关闭，默认：`true`
   */
  backdrop?: boolean | 'static';

  /**
   * 显示时回调函数
   */
  onShow?: () => void;

  /**
   * 隐藏时回调函数
   */
  onHide?: (data?: any) => void;
  /**
   * 自动关闭时间（单位：ms），默认：不会自动关闭
   */
  timeout?: number;
  /**
   * 背景色，默认：`rgba(0,0,0,.5)`
   */
  backdropColor?: string;
  /**
   * 键盘上的 esc 键被按下时关闭模态框，默认：`true`
   */
  keyboard?: boolean;

  [key: string]: any;
}
