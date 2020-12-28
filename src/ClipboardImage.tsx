import React from "react";
import {
  isSupportClipboardWrite,
  imageToBlob,
  cloneElement,
  isValidElement,
} from "./utils";

export type ChangeStatus = "loading" | "done" | "error";

export interface ClipboardImageProps {
  /**
   * copy target
   */
  target: HTMLImageElement | HTMLCanvasElement | string;
  /**
   * can use
   */
  disabled?: boolean;
  /**
   * children
   */
  children: React.ReactElement;
  /**
   * callback when status change
   */
  onChange?(status: ChangeStatus, error?: Error): any;
}
/**
 * mack sure children element can receive "onClick" event props
 */
const ClipboardImage: React.FC<ClipboardImageProps> = (props) => {
  const { target, children, disabled = false, onChange } = props;
  const copyImage = async () => {
    try {
      if (onChange) {
        onChange("loading");
      }
      const canWrite = await isSupportClipboardWrite();
      if (
        !canWrite ||
        //@ts-ignore
        !window.ClipboardItem ||
        //@ts-ignore
        !navigator.clipboard?.write
      ) {
        throw Error("broswer not supported!");
      }
      const blob = await imageToBlob(target);
      //@ts-ignore
      const data = [new window.ClipboardItem({ [blob.type]: blob })];
      //@ts-ignore
      await navigator.clipboard.write(data);
      if (onChange) {
        onChange("done");
      }
    } catch (err) {
      if (onChange) {
        onChange("error", err);
      }
    }
  };

  const child = isValidElement(children) ? children : <span>{children}</span>;

  return cloneElement(child, {
    onClick: (e: React.MouseEvent<any>) => {
      child?.props?.onClick?.(e);
      if (!disabled) {
        copyImage();
      }
    },
  });
};

export default ClipboardImage;
