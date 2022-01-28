---
nav:
  title: Components
  path: /components
---

## VirsualList

## 组件介绍
- 本组件，主要适用于，长列表滚动性能优化：避免加载过多cell；导致卡屏/白屏现象

## 实现原理
- 通过分页+埋标记；监听加载（上一页/下一页）；动态切换数据后，调整面板视觉位置


## 使用示例:

```tsx
import React from 'react';
import { VirsualList } from 'like-scene-ui';
const {useState, useEffect} = React;


function App() {
  const [totalList, setTotalList] = useState([])
  useEffect(() => {
    setTotalList(Array(50).fill(0).map((v, i) => i + 1))
  }, [])
  return <div>
    <VirsualList data={totalList} initPageCount={5} autoAdjustPageCount={true} height='500px'>
        {
          item => (
            <div 
            key={item} 
            style={{ 
              lineHeight: `${+item % 8 * 40}px`, 
              backgroundColor: "tomato", color: "#fff", 
              borderBottom: "5px solid cyan" 
            }}>
              测试cell-不定高-{item}
            </div>
          )
        }
    </VirsualList>
    <button onClick={() => setTotalList([...totalList, totalList.length+1])}>添加数据</button>
  </div>
}
export default App;
```
<API></API>

更多使用说明：请参考 itlike.com: 
