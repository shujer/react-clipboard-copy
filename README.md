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

- Copy Image

```jsx
import { ClipboardImage } from "rc-clipboard-copy";
const App = () => {
  const [imageRef, setImageRef] = React.useState();
  const [canvasRef, setCanvasRef] = React.useState();
  return (
    <div>
      <img ref={(ref) => setImageRef(ref)} src="./assets/logo.png" />
      <canvas ref={(ref) => setCanvasRef(ref)} />
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
      <ClipboardImage
        target={canvasRef}
        onChange={(s, e) => {
          console.log("status", s);
          if (e) {
            console.error(s, e);
          }
        }}
        disabled
      >
        <button>copy canvas</button>
      </ClipboardImage>
    </div>
  );
};
```

- Copy Text

```jsx
import { ClipboardText } from "rc-clipboard-copy";
const App = () => {
  return (
    <div>
      <ClipboardText
        target={"hello world"}
        onChange={(s, e) => {
          console.log("status", s);
          if (e) {
            console.error(s, e);
          }
        }}
      >
        <button>copy text</button>
      </ClipboardText>
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
## Broswer Support

This library relies on [ClipboardItem](https://developer.mozilla.org/en-US/docs/Web/API/ClipboardItem) and [execCommand](https://developer.mozilla.org/en-US/docs/Web/API/Document/execCommand) APIs. See all supports in [Can I Use](https://caniuse.com/mdn-api_clipboarditem)

## Func
- copy image (include image element & image src) 👌
- copy canvas element👌
- copy plain text 👌
- copy both ❌
