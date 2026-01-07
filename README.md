# 威软音乐下载神器 🎵

[![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)](https://github.com/weiruankeji2025/weiruan-music-download)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![Tampermonkey](https://img.shields.io/badge/Tampermonkey-Ready-brightgreen.svg)](https://www.tampermonkey.net/)

**全网音乐免费下载神器** - 一款强大的油猴脚本，支持主流音乐平台音乐下载，操作简单，一键下载最高音质音乐。

## ✨ 功能特点

- 🎯 **多平台支持**: 网易云音乐、QQ音乐、酷狗音乐、酷我音乐、咪咕音乐、喜马拉雅、B站等
- 🎨 **精美界面**: 现代化UI设计，悬浮按钮+弹窗交互，使用便捷
- 🔊 **音质可选**: 支持标准/高品/无损多种音质选择，默认最高音质
- ⚡ **一键下载**: 自动检测当前播放歌曲，一键即可下载
- 📱 **响应式设计**: 完美适配不同屏幕尺寸
- 🌙 **暗色模式**: 自动适应系统暗色模式

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
2. 播放你想下载的音乐
3. 点击页面右下角的**紫色悬浮按钮**
4. 在弹出的窗口中选择音质
5. 点击「开始下载」按钮

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
│     v1.0.0 by 威软科技               │
├─────────────────────────────────────┤
│  ┌────┐                             │
│  │ 🎵 │  歌曲名称                    │
│  └────┘  歌手名 · 专辑名             │
│                                     │
│  选择音质                            │
│  ┌────────┐  ┌────────┐            │
│  │  标准   │  │  高品   │            │
│  │ 128kbps│  │ 192kbps│            │
│  └────────┘  └────────┘            │
│  ┌────────┐  ┌────────┐            │
│  │  极高   │  │  无损   │            │
│  │ 320kbps│  │  FLAC  │            │
│  └────────┘  └────────┘            │
│                                     │
│  [        开始下载        ]          │
│                                     │
│  ████████████████░░░░ 75%           │
└─────────────────────────────────────┘
```

## ⚠️ 注意事项

1. **仅供学习研究使用**：请支持正版音乐，尊重版权
2. **VIP歌曲**：部分VIP专属歌曲可能无法下载或只能下载试听版本
3. **网络要求**：需要稳定的网络连接
4. **浏览器兼容**：推荐使用 Chrome、Firefox、Edge 等现代浏览器

## 🔧 常见问题

### Q: 为什么有些歌曲无法下载？
A: 部分歌曲因版权限制或需要VIP权限，可能无法获取下载链接。

### Q: 下载的文件在哪里？
A: 默认保存在浏览器的下载目录中。

### Q: 如何更新脚本？
A: 访问脚本页面重新安装即可自动更新。

### Q: 支持哪些浏览器？
A: 支持所有可安装 Tampermonkey/Greasemonkey 扩展的浏览器。

## 📝 更新日志

### v1.0.0 (2024-01)
- 🎉 首次发布
- ✅ 支持网易云音乐、QQ音乐、酷狗音乐、酷我音乐、咪咕音乐
- ✅ 支持喜马拉雅、哔哩哔哩音频下载
- ✅ 多音质选择
- ✅ 现代化UI界面
- ✅ 下载进度显示

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📄 许可证

本项目采用 [MIT](LICENSE) 许可证。

## 👨‍💻 作者

**威软科技** - 威软音乐下载神器

---

⭐ 如果这个项目对你有帮助，请给一个 Star！
