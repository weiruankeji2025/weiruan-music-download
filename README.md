# 威软音乐下载神器

[![Version](https://img.shields.io/badge/version-1.4.0-blue.svg)](https://github.com/weiruankeji2025/weiruan-music-download)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![Tampermonkey](https://img.shields.io/badge/Tampermonkey-Ready-brightgreen.svg)](https://www.tampermonkey.net/)

**全网音乐免费下载神器** - 一款强大的油猴脚本，支持主流音乐平台音乐下载，操作简单，一键下载最高音质音乐。

## ✨ 功能特点

- **多平台支持**: 网易云音乐、QQ音乐、酷狗音乐、酷我音乐、咪咕音乐、喜马拉雅、B站等
- **智能捕获**: 自动从页面网络请求中捕获音频URL，支持XHR/Fetch/Blob
- **精美界面**: 现代化UI设计，悬浮按钮+弹窗交互，使用便捷
- **智能推荐**: 自动检测文件大小，推荐最高质量的音频文件
- **一键下载**: 自动检测当前播放歌曲，一键即可下载
- **暗色模式**: 自动适应系统暗色模式

## 📦 安装方法

### 1. 安装浏览器扩展

首先需要安装油猴扩展（任选其一）：

| 浏览器 | 推荐扩展 |
|--------|----------|
| Chrome | [Tampermonkey](https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo) |
| Firefox | [Greasemonkey](https://addons.mozilla.org/firefox/addon/greasemonkey/) |
| Edge | [Tampermonkey](https://microsoftedge.microsoft.com/addons/detail/tampermonkey/iikmkjmpaadaobahmlepeloendndfphd) |
| Safari | [Userscripts](https://apps.apple.com/app/userscripts/id1463298887) |

### 2. 安装脚本

点击下方链接安装脚本：

- **[点击安装脚本](weiruan-music-downloader.user.js)** (直接安装)

或者手动安装：
1. 打开 `weiruan-music-downloader.user.js` 文件
2. 复制全部内容
3. 打开 Tampermonkey 管理面板
4. 创建新脚本，粘贴代码并保存

## 🎯 使用方法

### 基本使用

1. 打开支持的音乐网站
2. **先播放**你想下载的音乐（脚本会自动捕获播放的音频链接）
3. 点击页面右下角的**紫色悬浮按钮**
4. 在弹出的窗口中查看捕获到的音频链接
5. 选择文件大小最大的链接下载（推荐标记为★的链接）

### 支持的平台

| 平台 | 网址 | 状态 |
|------|------|------|
| 网易云音乐 | music.163.com | ✅ 支持 |
| QQ音乐 | y.qq.com | ✅ 支持 |
| 酷狗音乐 | www.kugou.com | ✅ 支持 |
| 酷我音乐 | www.kuwo.cn | ✅ 支持 |
| 咪咕音乐 | music.migu.cn | ✅ 支持 |
| 喜马拉雅 | www.ximalaya.com | ✅ 支持 |
| 哔哩哔哩 | www.bilibili.com | ✅ 支持 |

### 音质说明

| 音质等级 | 码率 | 格式 | 说明 |
|----------|------|------|------|
| 标准 | 128kbps | MP3 | 节省流量，音质一般 |
| 高品 | 192kbps | MP3 | 平衡选择 |
| 极高 | 320kbps | MP3 | 高音质推荐 |
| 无损 | 800-1400kbps | FLAC | 发烧友首选 |

## 📷 界面截图

```
┌─────────────────────────────────────┐
│     威软音乐下载神器                  │
│     v1.4.0 by 威软科技               │
├─────────────────────────────────────┤
│  ┌────┐                             │
│  │    │  歌曲名称                    │
│  └────┘  歌手名 · 专辑名             │
│                                     │
│  可用下载链接 [3]      [刷新页面]     │
│  ┌─────────────────────────────────┐│
│  │ FLAC ★推荐        8.5MB  [下载] ││
│  │ MP3              3.2MB  [下载] ││
│  │ M4A              2.8MB  [下载] ││
│  └─────────────────────────────────┘│
│                                     │
│  [    下载最佳音质 (8.5MB)    ]      │
└─────────────────────────────────────┘
```

## ⚠️ 注意事项

1. **仅供学习研究使用**：请支持正版音乐，尊重版权
2. **VIP歌曲**：部分VIP专属歌曲可能无法下载或只能下载试听版本
3. **网络要求**：需要稳定的网络连接
4. **浏览器兼容**：推荐使用 Chrome、Firefox、Edge 等现代浏览器

## 🔧 常见问题

### Q: 为什么显示"未捕获到音频链接"？
A: 请确保音乐正在播放。脚本需要先播放音乐才能捕获音频链接。如果已在播放，尝试刷新页面后重新播放。

### Q: 为什么有些歌曲无法下载？
A: 部分歌曲因版权限制或需要VIP权限，可能无法获取下载链接。

### Q: 下载的文件在哪里？
A: 默认保存在浏览器的下载目录中。

### Q: 如何选择最佳音质？
A: 脚本会自动检测文件大小并推荐（标记★）。一般来说，文件越大音质越好。

### Q: QQ音乐无法捕获怎么办？
A: 请确保：1) 刷新页面后再播放音乐；2) 检查控制台是否显示"XHR Hook已注入到realWindow"。

### Q: 支持哪些浏览器？
A: 支持所有可安装 Tampermonkey/Greasemonkey 扩展的浏览器（Chrome、Firefox、Edge等）。

## 📝 更新日志

### v1.4.0 (2025-01)
- 修复QQ音乐无法捕获音频的问题
- 使用unsafeWindow绕过Tampermonkey沙箱限制
- 所有网络Hook注入到页面真实window对象

### v1.3.0 (2025-01)
- 增强音频捕获功能
- 添加XHR/Fetch响应内容深度解析
- 支持QQ音乐sip+purl组合URL提取
- 添加Blob音频捕获
- 添加AudioContext Hook
- 脚本运行时机改为document-start

### v1.2.0 (2025-01)
- 优化下载体验，防止重复下载
- 添加文件大小检测功能
- 过滤无效小文件（<100KB）
- 按文件大小排序，推荐最大文件

### v1.1.1 (2025-01)
- 修复Tampermonkey沙箱隔离导致的下载按钮失效问题
- 使用事件委托替代内联onclick

### v1.1.0 (2025-01)
- 添加音频捕获模块(AudioCapture)
- 支持从页面网络请求中捕获音频URL
- 改进下载链接获取机制

### v1.0.0 (2025-01)
- 首次发布
- 支持网易云音乐、QQ音乐、酷狗音乐、酷我音乐、咪咕音乐
- 支持喜马拉雅、哔哩哔哩音频下载
- 多音质选择
- 现代化UI界面

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📄 许可证

本项目采用 [MIT](LICENSE) 许可证。

## 👨‍💻 作者

**威软科技** - 威软音乐下载神器

---

⭐ 如果这个项目对你有帮助，请给一个 Star！
