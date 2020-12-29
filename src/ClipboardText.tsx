import React, { useEffect, useRef, useState } from "react";
import { ClipboardTextProps } from "./interface";
import { useCopyText } from "./useCopyText";
import { cloneElement, isValidElement } from "./utils";

/**
 * mack sure children element can receive "onClick" event props
 */
const ClipboardText: React.FC<ClipboardTextProps> = (props) => {
  const {
    target: propsTarget,
    children,
    disabled = false,
    onChange,
    methods = ["clipboard"],
  } = props;
  const [target, setTarget] = useState<ClipboardTextProps["target"]>(
    propsTarget
  );
  const { copy, error, status } = useCopyText({
    target,
    auto: false,
    disabled,
    methods,
  });
  const change = useRef<ClipboardTextProps["onChange"]>(onChange);
  change.current = onChange;

  useEffect(() => {
    setTarget(propsTarget);
  }, [propsTarget]);

  useEffect(() => {
    if (change.current) {
      change.current(status, error);
    }
  }, [status, error]);

  const child = isValidElement(children) ? children : <span>{children}</span>;

  return cloneElement(child, {
    onClick: (e: React.MouseEvent<any>) => {
      child?.props?.onClick?.(e);
      if (!disabled) {
        copy(target);
      }
    },
  });
};

export default ClipboardText;
