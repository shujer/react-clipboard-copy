import { useCallback, useState } from "react";
import {
  ChangeStatus,
  ClipboardImageHooksProps,
  ImageCopyTarget,
} from "./interface";
import { imageToBlob, interrupt, isSupportClipboardWrite } from "./utils";

export const useCopyImage = (props: ClipboardImageHooksProps) => {
  const { methods = ["clipboard"] } = props;
  const [status, setStatus] = useState<ChangeStatus>(null);
  const [err, setErr] = useState<Error>(null);

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
    [copyImage, methods.join("-")]
  );

  return { status, error: err, copy };
};
