import { useCallback, useState } from "react";
import {
  ChangeStatus,
  ClipboardTextHooksProps,
  TextCopyTarget,
} from "./interface";
import {
  interrupt,
  isSupportClipboardWrite,
  selectFakeInput,
  textToBlob,
} from "./utils";

export const useCopyText = (props: ClipboardTextHooksProps) => {
  const { methods = ["clipboard"] } = props;
  const [status, setStatus] = useState<ChangeStatus>(null);
  const [err, setErr] = useState<Error>(null);

  const copyText = useCallback(async (target: TextCopyTarget) => {
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
      const blob = textToBlob(target);
      //@ts-ignore
      const data = [new window.ClipboardItem({ [blob.type]: blob })];
      //@ts-ignore
      await navigator.clipboard.write(data);
      setStatus("done");
      setErr(null);
      console.log("copy text by clipboard");
      return true;
    } catch (err) {
      setStatus("error");
      setErr(err);
      return false;
    }
  }, []);

  const copyTarget = useCallback(async (target: TextCopyTarget) => {
    try {
      setStatus("loading");
      setErr(null);
      const cancel = selectFakeInput(target);
      let success = document.execCommand("copy");
      if (!success) {
        throw Error("broswer not supported!");
      }
      setStatus("done");
      setErr(null);
      cancel();
      console.log("copy text by execCommand");
      return true;
    } catch (err) {
      setStatus("error");
      setErr(err);
      return false;
    }
  }, []);

  const copy = useCallback(
    async (target: TextCopyTarget) => {
      const methodMap = {
        clipboard: () => copyText(target),
        execCommand: () => copyTarget(target),
      };
      await interrupt<boolean>(
        methods.map((method) => methodMap[method]),
        (e) => e
      );
    },
    [copyText, copyTarget, methods.join("-")]
  );

  return { status, error: err, copy };
};
