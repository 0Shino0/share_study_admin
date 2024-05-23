import { getToken } from "@/utils/auth";
import { UserInfoMember } from "@/store/user";

/**
 * @param {null} 
 * @return {*}
 */
export function getTokenData(): UserInfoMember | null {
  let token: string | null = getToken();

  if (token === null) return token;
  let data = JSON.parse(token);
  return data;
}


type DebouncedFn<T extends (...args: any[]) => any> = (this: ThisParameterType<T>, ...args: Parameters<T>) => void;

type ThrottledFn<T extends (...args: any[]) => any> = (this: ThisParameterType<T>, ...args: Parameters<T>) => void;

/**
 * @param {T} fn
 * @param {number} delay
 * @param {boolean} immediate
 * @return {ThrottledFn<T>}
 * @description 节流
 */
export function debounce<T extends (...args: any[]) => any>(fn: T, delay: number, immediate: boolean = false): DebouncedFn<T> {
  let timer: NodeJS.Timeout | null = null;

  /**
   * @param { ThisParameterType<T>} this
   * @param {Parameters<T>} ...args
   * @return {*}
   * @description 闭包函数
   */
  return function (this: ThisParameterType<T>, ...args: Parameters<T>): any {
    // if (timer !== null) clearTimeout(timer);
    timer && clearTimeout(timer)
    if (immediate) {
      // 立即防抖
      const callNow = !timer;
      timer = setTimeout(() => {
        timer = null;
      }, delay);
      callNow && fn.apply(this, args);
    } else {
      // 非立即防抖
      timer = setTimeout(() => {
        fn.apply(this, args);
      }, delay);
    }
  };
}

/**
 * @param {T} fn
 * @param {number} delay
 * @param {boolean} immediate
 * @return {ThrottledFn<T>}
 * @description 节流函数
 */
export function throttle<T extends (...args: any[]) => any>(fn: T, delay: number, immediate: boolean = false): ThrottledFn<T> {
  let lastCall = 0;

  /**
   * @param {this} this
   * @param {...args} ...args
   * @return {*}
   * @description 闭包函数
   */
  return function (this: ThisParameterType<T>, ...args: Parameters<T>): any {
    const now = new Date().getTime();
    // immediate 不为 true 时, 不立即执行
    lastCall === 0 && !immediate && (lastCall = now)
    const diff = now - lastCall;
    if (diff >= delay) {
      lastCall = now;
      fn.apply(this, args);
    }
  };
}

// 锚点跳转
/**
 * @description 锚点跳转
 * @param {string} anchorName - 锚点名
 * @return {TYPE}
 *  */
export const anchor = (anchorName: string) => {
  if (typeof document === "undefined" || typeof window === "undefined") return;
  // catalogActive.value = anchorName
  /* 找到锚点 */
  const anchorElement = document.getElementById(anchorName);
  let elemTop = 0;

  // padding margin
  let paddingTop = 0;
  let marginTop = 0;

  // 根字体
  const fontSize = document.documentElement.style.fontSize || "0px";
  const fontSizeFilterPx = parseInt(fontSize.replace("px", ""));

  // 根字体
  const navHeightStr =
    getComputedStyle(document.documentElement).getPropertyValue("--nav-height") || "0rem";
  const navHeightFilterPx = parseFloat(navHeightStr.replace("rem", "")) * fontSizeFilterPx;


  /* 如果对应id的锚点存在，就跳转到锚点 */
  if (anchorElement) {
    // 计算 anchorElement到body的距离
    let anchorElemOffsetParent = anchorElement.offsetParent as HTMLElement;

    if (anchorElemOffsetParent) {
      elemTop += anchorElement.offsetTop; // 获取高度
      if (anchorElemOffsetParent.nodeName.toLowerCase() === "body") {
        // 当节点为body可直接使用offsetTop获取距离
      } else {
        while (anchorElemOffsetParent) {
          // 循环获取当前对象与body的高度
          elemTop += anchorElemOffsetParent.offsetTop;
          anchorElemOffsetParent = anchorElemOffsetParent.offsetParent as HTMLElement;
        }
      }
    } else {
      elemTop += anchorElement.offsetTop; // 获取高度
    }

    const paddingTop_ =
      window.getComputedStyle(anchorElement, null).getPropertyValue("padding-top") || "0px";
    const marginTop_ =
      window.getComputedStyle(anchorElement, null).getPropertyValue("margin-top") || "0px";

    paddingTop = parseInt(paddingTop_.replace("px", ""));
    marginTop = parseInt(marginTop_.replace("px", ""));

    // anchorElement?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "nearest" });
    document.documentElement.scrollTo({
      top: elemTop - navHeightFilterPx - (paddingTop + marginTop),
      behavior: "smooth",
    });
  }
};