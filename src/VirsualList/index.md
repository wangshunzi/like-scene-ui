---
nav:
  title: Components
  path: /components
---

## 组件介绍
- 本组件，主要适用于，长列表滚动性能优化：避免加载过多cell；导致卡屏/白屏现象



## 使用示例:

```tsx
import React from 'react';
import { VirsualList } from 'like-ui';
const {useState, useEffect} = React;

function Cell({ title }) {
  return <div style={{ lineHeight: `${+title % 8 * 40}px`, backgroundColor: "tomato", color: "#fff", borderBottom: "5px solid cyan" }}>
    条目-{title}
  </div>
}

function App() {
  const [totalList, setTotalList] = useState([])
  useEffect(() => {
    setTotalList(Array(50).fill(0).map((v, i) => i + 1))
  }, [])
  return <div>
    <VirsualList data={totalList} initPageCount={5} autoAdjustPageCount={true} height='500px'>
      {item => <Cell title={item} key={item} />}
    </VirsualList>
    <button onClick={() => setTotalList([...totalList, 666, 7777, 8888])}>添加数据</button>
  </div>
}
export default App;
```
<API></API>
更多使用说明：请参考 itlike.com: 
