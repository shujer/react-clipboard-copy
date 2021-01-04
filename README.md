## Install

- module

```bash
npm install rc-clipboard-copy
```

- script

```html
<script src="dist/rc-clipboard-copy.iife.js"></script>
```

## Usage

- use as component

```jsx
import { ClipboardImage, ClipboardText } from "rc-clipboard-copy";
const App = () => {
  const [imageRef, setImageRef] = React.useState();
  return (
    <div>
      <img ref={(ref) => setImageRef(ref)} src="./assets/logo.png" />
      <ClipboardImage
        target={imageRef}
        onChange={(s, e) => {
          console.log("status", s);
          if (e) {
            console.error(s, e);
          }
        }}
      >
        <button>copy image</button>
      </ClipboardImage>
      <ClipboardText
        target={"hello world"}
        methods={["execCommand", "clipboard"]}
        onChange={(s, e) => {
          console.log("status", s);
          if (e) {
            console.error(s, e);
          }
        }}
      >
        <button>copy text by specific methods</button>
      </ClipboardText>
    </div>
  );
};
```

- use hooks

```jsx
import { useCopyText } from "rc-clipboard-copy";
const App = () => {
  const { copy, error, status } = useCopyText({});
  return (
    <div>
      <button onClick={() => copy("hello word 2")}>copy text</button>
    </div>
  );
};
```

## Broswer Support

This library relies on [ClipboardItem](https://developer.mozilla.org/en-US/docs/Web/API/ClipboardItem) and [execCommand](https://developer.mozilla.org/en-US/docs/Web/API/Document/execCommand) APIs. See all supports in [Can I Use](https://caniuse.com/mdn-api_clipboarditem)

## Func

- copy image (include image element & image src) 👌
- copy canvas element👌
- copy plain text 👌
- copy both ❌
