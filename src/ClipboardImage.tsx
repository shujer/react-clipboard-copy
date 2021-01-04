import React, { useEffect, useRef, useState } from "react";
import { ClipboardImageProps, ImageCopyTarget } from "./interface";
import { useCopyImage } from "./useCopyImage";
import { cloneElement, isValidElement } from "./utils";

/**
 * mack sure children element can receive "onClick" event props
 */
const ClipboardImage: React.FC<ClipboardImageProps> = (props) => {
  const {
    target: propsTarget,
    children,
    disabled = false,
    onChange,
    methods = ["clipboard"],
  } = props;
  const [target, setTarget] = useState<ImageCopyTarget>(propsTarget);
  const { copy, error, status } = useCopyImage({
    methods,
  });
  const change = useRef<ClipboardImageProps["onChange"]>(onChange);
  change.current = onChange;

  useEffect(() => {
    if (propsTarget) {
      setTarget(propsTarget);
    }
  }, [propsTarget]);

  useEffect(() => {
    if (change.current && target && status) {
      change.current(status, error);
    }
  }, [status, error, target]);

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

export default ClipboardImage;
