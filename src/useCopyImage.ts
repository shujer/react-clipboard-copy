import { useCallback, useEffect, useState } from "react";
import {
  ChangeStatus,
  ClipboardImageHooksProps,
  ImageCopyTarget,
} from "./interface";
import { imageToBlob, interrupt, isSupportClipboardWrite } from "./utils";

export const useCopyImage = (props: ClipboardImageHooksProps) => {
  const {
    target,
    auto = false,
    methods = ["clipboard"],
    disabled = false,
  } = props;
  const [status, setStatus] = useState<ChangeStatus>();
  const [err, setErr] = useState<Error>();

  const copyImage = useCallback(async (target: ImageCopyTarget) => {
    try {
      setStatus("loading");
      setErr(null);
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
      setStatus("done");
      setErr(null);
      console.log("copy image by clipboard");
      return true;
    } catch (err) {
      setStatus("error");
      setErr(err);
      return false;
    }
  }, []);

  const copy = useCallback(
    async (target: ImageCopyTarget) => {
      const methodMap = {
        clipboard: () => copyImage(target),
      };
      await interrupt<boolean>(
        methods.map((method) => methodMap[method]),
        (e) => e
      );
    },
    [copyImage,auto, disabled]
  );

  useEffect(() => {
    setStatus(null);
    setErr(null);
  }, [target]);

  useEffect(() => {
    if (!target || !auto || disabled) {
      return;
    }
    copy(target);
  }, [target, auto, disabled, copy]);

  return { status, error: err, copy };
};
