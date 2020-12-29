import React from "react";

export const isValidElement = React.isValidElement;

export function cloneElement(
  element: React.ReactNode,
  props?: any
): React.ReactElement {
  if (!isValidElement(element)) return element as React.ReactElement;
  return React.cloneElement(
    element,
    typeof props === "function" ? props() : props
  );
}

export async function isSupportClipboardWrite() {
  try {
    const permission = await navigator.permissions?.query?.({
      //@ts-ignore
      name: "clipboard-write",
      allowWithoutGesture: false,
    });
    return permission?.state === "granted";
  } catch (error) {
    return false;
  }
}

export function dataURItoBlob(dataURI: string) {
  let mime = dataURI.split(",")[0].split(":")[1].split(";")[0];
  let dataStr = atob(dataURI.split(",")[1]);
  let arrayBuffer = new ArrayBuffer(dataStr.length);
  let intArray = new Uint8Array(arrayBuffer);
  for (var i = 0; i < dataStr.length; i++) {
    intArray[i] = dataStr.charCodeAt(i);
  }
  return new Blob([intArray], { type: mime });
}

export async function imageToBlob(
  target: HTMLImageElement | HTMLCanvasElement | string
) {
  if (isDataURI(target)) {
    return dataURItoBlob(target);
  }
  if (isImageElement(target)) {
    const response = await fetch(target.src);
    return await response.blob();
  }
  if (isImageSrc(target)) {
    const response = await fetch(target);
    return await response.blob();
  }
  if (isCanvasElement(target)) {
    const toBlob = new Promise((resolve, reject) => {
      try {
        target.toBlob((blob) => {
          resolve(blob);
        });
      } catch (err) {
        reject(err);
      }
    });
    return await toBlob;
  }
  throw Error(
    '[props target] only support "HTMLImageElement | HTMLCanvasElement | string"'
  );
}

export function isDataURI(target: unknown): target is string {
  return (
    typeof target === "string" &&
    /^data:image\/(?:gif|png|jpeg|bmp|webp)(?:;charset=utf-8)?;base64,*/.test(
      target.slice(0, 50)
    )
  );
}

export function isImageElement(target: unknown): target is HTMLImageElement {
  return target && !!(target as HTMLImageElement).src;
}

export function isCanvasElement(target: unknown): target is HTMLCanvasElement {
  return target && !!(target as HTMLCanvasElement).toBlob;
}

export function isImageSrc(target: unknown): target is string {
  return typeof target === "string" && /^(http)/.test(target);
}

export function textToBlob(target: string = "") {
  return new Blob([target], { type: "text/plain" });
}

export function selectFakeInput(text: string) {
  const input = document.createElement("textarea");
  input.value = text;
  input.style.position = "absolute";
  input.style.left = "-9999px";
  document.body.appendChild(input);
  let selection = window.getSelection();
  let range = document.createRange();
  range.selectNode(input);
  selection!.removeAllRanges();
  selection!.addRange(range);
  return () => {
    selection!.removeAllRanges();
    document.body.removeChild(input);
  };
}

const noop = <T>(_result: T) => false;

export async function interrupt<T>(
  promises: (() => Promise<T>)[],
  checking: (result: T) => boolean = noop
) {
  for (let promise of promises) {
    let result = await promise();
    let isEnd = checking(result);
    if (isEnd) {
      return;
    }
  }
}
