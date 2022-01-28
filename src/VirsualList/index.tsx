import React from 'react'
import { useState, useEffect, useRef, useLayoutEffect, useMemo, useCallback, DOMElement } from 'react'
// import "./app.css"


class ObserveTool {
  map: Map<any, any>
  observer: IntersectionObserver
  constructor(moreHeight = "20px") {
    this.map = new Map()
    this.observer = new IntersectionObserver(entries => {
      entries.forEach((entry: any) => {
        if (entry.isIntersecting && !entry.target.__visible__) {
          entry.target.__visible__ = true
          let cb = this.map.get(entry.target)
          if (typeof cb === "function") {
            cb(true)
          }
        }
        if (!entry.isIntersecting && entry.target.__visible__) {
          entry.target.__visible__ = false
          let cb = this.map.get(entry.target)
          if (typeof cb === "function") {
            cb(false)
          }
        }
      })
    }, {
      rootMargin: `0px 0px ${moreHeight} 0px`,
      threshold: 0
    })
  }

  add(ele: Element, callback: (v: Boolean) => void) {
    // 存在的话， 就更新
    if (this.map.has(ele)) {
      this.map.set(ele, callback)
      return
    }
    this.observer.observe(ele)
    this.map.set(ele, callback)
  }
  remove(ele: Element) {
    this.observer.unobserve(ele)
    this.map.delete(ele)
  }
  removeAll() {
    [...this.map.keys()].forEach(key => {
      this.observer.unobserve(key)
    })
    this.map.clear()
  }
  getAllObserveElements() {
    return [...this.map.keys()]
  }
  disconnect() {
    this.observer.disconnect()
  }
}

export interface VirsualListProps {
  /**
   * 需要渲染的数据源
   * @description       数组类型，里面可以放具体模型；
   */
  data: any[]; // 支持识别 TypeScript 可选类型为非必选属性
  /**
   * 需要被渲染的子元素
   * @description       一般写函数：接收 模型， 返回具体的 ReactElement
   */
  children: React.ReactElement | ((item: any) => React.ReactElement);
  /**
   * 初始的页面大小（一页多少条）
   * @description       设置要求：该条数对应的 组件高度 应超过一屏；如果不清楚，也可以给一个小值， 例如 3； 然后开启 自调整：autoAdjustPageCount
   * @default           10
   */
  initPageCount: number;
  /**
   * 容器高度
   * @description       可以是具体像素 500px; 也可以写 100vh 等
   * @default           50vh
   */
  height: string;
  /**
   * 是否开启自调整页大小
   * @description       开启后， 会在翻页过程中， 动态监测并调整（调整过程中，会导致页面轻微抖动）
   * @default           true
   */
  autoAdjustPageCount: boolean;
}

interface VirsualListCache {
  placeholdHeight: number // 标识dom高度(调试时，可设置高度，看到标记dom)
  contentTopBorderWidth: number; // 容器上边框高度
  pageCount: number; // 每一页大小（建议：保证对应个数的cell 高度大于1屏）
  lastPage: number, // 记录上一页； 用来判定是上翻页还是下翻页
  pageHeightInfo: { [key: number]: number }; // 用来缓存每个页面的高度,
  currentTop: number; // 记录偏移top 值
}


// initPageCount 初始页大小， 为0代表自动调整
const VirsualList: React.FC<VirsualListProps> = ({ data = [], children, initPageCount = 10, height = "50vh", autoAdjustPageCount = true }) => {
  const [totalList, setTotalList] = useState(data)
  const [currentPage, setCurrentPage] = useState(0)
  const [renderList, setRenderList] = useState<any[]>([])
  const [resetFlag, setResetFlag] = useState(false)
  const globalObserver = useMemo(() => new ObserveTool(), [])

  const topRef = useRef<HTMLDivElement>(null)
  const midRef = useRef<HTMLDivElement>(null)
  const bottomRef = useRef<HTMLDivElement>(null)


  const rootRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  const dataRef = useRef<VirsualListCache>({
    placeholdHeight: 0, // 标识dom高度(调试时，可设置高度，看到标记dom)
    contentTopBorderWidth: 0, // 容器上边框高度
    pageCount: initPageCount, // 每一页大小（建议：保证对应个数的cell 高度大于1屏）

    lastPage: 0, // 记录上一页； 用来判定是上翻页还是下翻页
    pageHeightInfo: {}, // 用来缓存每个页面的高度,
    currentTop: 0, // 记录偏移top 值
  })

  // 数据变更，设置状态
  useEffect(() => {
    dataRef.current.pageCount <= 0 ? dataRef.current.pageCount = 1 : null
    setTotalList(data)
  }, [data])

  // 监听页码改变
  useLayoutEffect(() => {
    let pageCount = dataRef.current.pageCount
    let start = currentPage * pageCount
    let end = start + pageCount * 2  // 每次加载2页数据
    let temp = totalList.slice(start, end)

    if (temp.length > 0) {
      let topIndex = 0
      temp.splice(topIndex, 0, { __tag__: "__top__" })
    }
    if (temp.length >= pageCount + 1) {
      let midIndex = pageCount + 1
      temp.splice(midIndex, 0, { __tag__: "__mid__" })
    }
    if (temp.length === pageCount * 2 + 2) {
      let bottomIndex = temp.length
      temp.splice(bottomIndex, 0, { __tag__: "__bottom__" })
    }

    // 下一页的滚动偏移
    let transformY = 0
    if (currentPage > dataRef.current.lastPage) {
      // 下一页偏移
      dataRef.current.currentTop += (dataRef.current.pageHeightInfo[currentPage - 1] ?? 0)
    } else if (currentPage < dataRef.current.lastPage) {
      // 上一页滚动偏移
      dataRef.current.currentTop -= (dataRef.current.pageHeightInfo[currentPage] ?? 0)
    }

    transformY = dataRef.current.currentTop

    // contentRef.current.style.transform = `translate(0, ${transformY}px)`
    contentRef.current && (contentRef.current.style.top = `${transformY}px`)

    // console.log(dataRef.current.pageHeightInfo)
    setRenderList(temp)
    // 记录上一页
    dataRef.current.lastPage = currentPage


  }, [currentPage, totalList, resetFlag])


  // 监听上一页 / 下一页触发
  useEffect(() => {
    // 列表改变， 重新监测两个dom的状态
    if (topRef.current && bottomRef.current) {
      globalObserver.removeAll()
      globalObserver.add(topRef.current, (v: Boolean) => {
        // 顶部显示， 且为下拉
        if (v && currentPage !== 0) {
          if (currentPage === 0) {
            return
          }
          setCurrentPage(currentPage - 1)
        }
      })
      globalObserver.add(bottomRef.current, (v) => {
        if (v) {
          if (currentPage >= Math.ceil(totalList.length / dataRef.current.pageCount) - 2) {
            return
          }
          setCurrentPage(currentPage + 1)
        }
      })
    }
  }, [renderList, currentPage, dataRef.current.pageCount])

  // 缓存每一页高度， 用于后续计算； （自动调整页大小：小： 一页不够一屏， 大： 一页大于3屏）
  useEffect(() => {
    if (!topRef.current || !midRef.current || !bottomRef.current || !rootRef.current) return
    dataRef.current.pageHeightInfo[currentPage] = midRef.current.offsetTop - topRef.current.offsetTop - topRef.current.offsetHeight
    dataRef.current.pageHeightInfo[currentPage + 1] = bottomRef.current.offsetTop - midRef.current.offsetTop - midRef.current.offsetHeight
    // 自动修正外界传递错误的页大小
    if ((dataRef.current.pageCount <= 0 || dataRef.current.pageHeightInfo[currentPage] < rootRef.current.offsetHeight)) {
      if (autoAdjustPageCount) {
        // 因为支持不定长cell； 无法通过比例推算出大小， 会导致过大情况， 所以选择累加计算操作
        console.log("%c自动调整页大小(+1)...", "color: green")
        dataRef.current.pageCount += 1
        setResetFlag(!resetFlag)
      } else {
        console.warn("pageCount太小, 会导致闪屏现象！ 请手动调整大小，或设置 autoAdjustPageCount = true 自动调整!");
      }
    }
  }, [renderList, dataRef.current.pageCount])

  return (
    <div ref={rootRef} style={{ height: height, overflowY: "auto", backgroundColor: "grey", position: "relative" }}>
      <div ref={contentRef} style={{ position: "absolute", left: 0, top: 0, width: "100%" }}>
        {renderList.map((item: any) => {
          if (item.__tag__) {
            let ref;
            switch (item.__tag__) {
              case "__top__":
                ref = topRef
                break;
              case "__mid__":
                ref = midRef
                break;
              case "__bottom__":
                ref = bottomRef
                break;
            }
            return <div id={item.__tag__} ref={ref} key={item.__tag__} style={{ height: `${dataRef.current.placeholdHeight}px`, backgroundColor: "transparent" }} />

          }
          if (typeof children === "function") {
            return children(item)
          }
          return children
        })}
      </div>
    </div>
  )
}


export default VirsualList;