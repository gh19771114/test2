// 简化版的cn函数，不依赖外部包
export function cn(...inputs: (string | undefined | null | false)[]) {
  return inputs
    .filter(Boolean)
    .join(' ')
    .split(' ')
    .filter((value, index, self) => self.indexOf(value) === index)
    .join(' ')
}

