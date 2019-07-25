import { BuiltInOptions } from './built-in.options';

export interface DialogOptions {
  /**
   * 指定模态顺序，默认：自动叠加
   */
  index?: number;
  /**
   * 自动关闭时间（单位：ms），默认：不会自动关闭
   */
  timeout?: number;
  /**
   * 是否包括背景且点击背景会关闭，如果传递的是字符串 'static' 点击背景不会关闭，默认：`true`
   */
  backdrop?: boolean | 'static';
  /**
   * 背景色，默认：`rgba(0,0,0,.5)`
   */
  backdropColor?: string;
  /**
   * 键盘上的 esc 键被按下时关闭模态框，默认：`true`
   */
  keyboard?: boolean;
  /**
   * 是否对带有 `autofocus` 的元素自动获得焦点，默认：`true`
   */
  autoFocus?: boolean;
}

export class DialogServiceConfig {
  container?: HTMLElement = null;

  builtInOptions?: BuiltInOptions;
}
