import React from "react";
import {
  isSupportClipboardWrite,
  cloneElement,
  isValidElement,
  textToBlob,
  createFakeInput,
  selectFakeTarget,
} from "./utils";

export type ChangeStatus = "loading" | "done" | "error";
export type CopyTextMethod = "clipboard" | "execCommand";

export interface ClipboardTextProps {
  /**
   * copy target
   */
  target: string;
  /**
   * method to copy text，try the next method when it fails
   * default ["clipboard"]
   */
  methods?: CopyTextMethod[];
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
const ClipboardText: React.FC<ClipboardTextProps> = (props) => {
  const {
    target,
    children,
    disabled = false,
    onChange,
    methods = ["clipboard"],
  } = props;

  const copyText = async () => {
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
      const blob = textToBlob(target);
      //@ts-ignore
      const data = [new window.ClipboardItem({ [blob.type]: blob })];
      //@ts-ignore
      await navigator.clipboard.write(data);
      if (onChange) {
        onChange("done");
      }
      console.log("copy text by clipboard");
      return true;
    } catch (err) {
      if (onChange) {
        onChange("error", err);
      }
      return false;
    }
  };

  const copyTarget = async () => {
    try {
      if (onChange) {
        onChange("loading");
      }

      const input = createFakeInput(target);
      const cancel = selectFakeTarget(input);
      let success = document.execCommand("copy");
      if (!success) {
        throw Error("broswer not supported!");
      }
      if (onChange) {
        onChange("done");
        cancel();
      }
      console.log("copy text by execCommand");
      return true;
    } catch (err) {
      if (onChange) {
        onChange("error", err);
      }
      return false;
    }
  };

  const copy = async () => {
    const methodMap = {
      clipboard: copyText,
      execCommand: copyTarget,
    };
    async function* copyGenerator() {
      let i = 0;
      let success = true;
      while (i < methods.length && success) {
        let method = methodMap[methods[i]];
        if (method) {
          yield await method();
        } else {
          yield false;
        }
      }
    }
    for await (let success of copyGenerator()) {
      if (success) {
        return;
      }
    }
  };

  const child = isValidElement(children) ? children : <span>{children}</span>;

  return cloneElement(child, {
    onClick: (e: React.MouseEvent<any>) => {
      child?.props?.onClick?.(e);
      if (!disabled) {
        copy();
      }
    },
  });
};

export default ClipboardText;
