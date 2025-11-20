// 纯 Web 版本不需要向 Electron 主进程同步设置，返回一个空插件占位
export function getSendSettingsPlugin() {
  return () => {};
}
