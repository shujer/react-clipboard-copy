export type ChangeStatus = "loading" | "done" | "error";
export type TextCopyMethod = "clipboard" | "execCommand";
export type ImageCopyMethod = "clipboard";
export type ImageCopyTarget = HTMLImageElement | HTMLCanvasElement | string;
export type TextCopyTarget = string;

export interface ClipboardProps<Target, Method> {
  target: Target;
  /**
   * method to copy text，try the next method when it fails
   * default ["clipboard"]
   */
  methods?: Method[];
  disabled?: boolean;
  children: React.ReactElement;
  onChange?(status: ChangeStatus, error?: Error): any;
}

export interface ClipboardImageProps
  extends ClipboardProps<ImageCopyTarget, ImageCopyMethod> {}

export interface ClipboardTextProps
  extends ClipboardProps<TextCopyTarget, TextCopyMethod> {}

export interface ClipboardHooksProps<Method> {
  /**
   * method to copy text，try the next method when it fails
   * default ["clipboard"]
   */
  methods?: Method[];
}

export interface ClipboardTextHooksProps
  extends ClipboardHooksProps<TextCopyMethod> {}

export interface ClipboardImageHooksProps
  extends ClipboardHooksProps<ImageCopyMethod> {}
