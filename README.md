## 安装

```bash
npm install git+https://github.com/shujer/react-copy-image.git
```

## 使用

```tsx
import CopyImage from "react-copy-image";

const App = () => {
  const ref = useRef();
  return (
    <div>
      <img ref={ref} />
      <CopyImage target={ref}>
        <button>复制</button>
      </CopyImage>
    </div>
  );
};
```
