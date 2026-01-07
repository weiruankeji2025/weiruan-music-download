// ==UserScript==
// @name         威软音乐下载神器
// @namespace    https://github.com/weiruankeji2025
// @version      1.1.0
// @description  全网音乐免费下载神器 - 支持网易云音乐、QQ音乐、酷狗音乐、酷我音乐、咪咕音乐等主流平台，一键下载最高音质音乐
// @author       威软科技
// @match        *://music.163.com/*
// @match        *://*.music.163.com/*
// @match        *://y.qq.com/*
// @match        *://*.y.qq.com/*
// @match        *://www.kugou.com/*
// @match        *://*.kugou.com/*
// @match        *://www.kuwo.cn/*
// @match        *://*.kuwo.cn/*
// @match        *://music.migu.cn/*
// @match        *://*.migu.cn/*
// @match        *://www.ximalaya.com/*
// @match        *://*.ximalaya.com/*
// @match        *://www.bilibili.com/*
// @match        *://*.bilibili.com/*
// @icon         data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCI+PHBhdGggZmlsbD0iIzY2N2VlYSIgZD0iTTEyIDNhOSA5IDAgMCAwLTkgOXY3YzAgMS4xLjkgMiAyIDJoNHYtOEg1di0xYzAtMy44NyAzLjEzLTcgNy03czMuMTMgNyA3djFoLTR2OGg0YzEuMSAwIDItLjkgMi0ydi03YTkgOSAwIDAgMC05LTl6Ii8+PC9zdmc+
// @grant        GM_xmlhttpRequest
// @grant        GM_download
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_notification
// @grant        unsafeWindow
// @connect      *
// @run-at       document-end
// @license      MIT
// ==/UserScript==

(function() {
    'use strict';

    // ==================== 配置 ====================
    const CONFIG = {
        name: '威软音乐下载神器',
        version: '1.1.0',
        author: '威软科技',
        debugMode: true
    };

    // 存储捕获到的音频URL
    let capturedAudioUrls = [];
    let currentSongInfo = null;

    // ==================== 样式 ====================
    const STYLES = `
        .wr-music-download-btn {
            position: fixed;
            right: 20px;
            bottom: 100px;
            width: 60px;
            height: 60px;
            border-radius: 50%;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
            cursor: pointer;
            z-index: 999999;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.3s ease;
            border: none;
            outline: none;
        }
        .wr-music-download-btn:hover {
            transform: scale(1.1);
            box-shadow: 0 6px 25px rgba(102, 126, 234, 0.6);
        }
        .wr-music-download-btn svg {
            width: 30px;
            height: 30px;
            fill: white;
        }
        .wr-music-modal-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.6);
            z-index: 9999999;
            display: flex;
            align-items: center;
            justify-content: center;
            opacity: 0;
            visibility: hidden;
            transition: all 0.3s ease;
        }
        .wr-music-modal-overlay.active {
            opacity: 1;
            visibility: visible;
        }
        .wr-music-modal {
            background: #fff;
            border-radius: 16px;
            width: 450px;
            max-width: 90vw;
            max-height: 85vh;
            overflow: hidden;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
            transform: scale(0.9);
            transition: transform 0.3s ease;
        }
        .wr-music-modal-overlay.active .wr-music-modal {
            transform: scale(1);
        }
        .wr-music-modal-header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            padding: 20px;
            color: white;
            position: relative;
        }
        .wr-music-modal-title {
            font-size: 20px;
            font-weight: 600;
            margin: 0 0 5px 0;
        }
        .wr-music-modal-subtitle {
            font-size: 12px;
            opacity: 0.8;
        }
        .wr-music-modal-close {
            position: absolute;
            top: 15px;
            right: 15px;
            width: 30px;
            height: 30px;
            background: rgba(255, 255, 255, 0.2);
            border: none;
            border-radius: 50%;
            color: white;
            font-size: 20px;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: background 0.3s;
        }
        .wr-music-modal-close:hover {
            background: rgba(255, 255, 255, 0.3);
        }
        .wr-music-modal-body {
            padding: 20px;
            max-height: 500px;
            overflow-y: auto;
        }
        .wr-song-info {
            display: flex;
            align-items: center;
            padding: 15px;
            background: #f8f9fa;
            border-radius: 12px;
            margin-bottom: 20px;
        }
        .wr-song-cover {
            width: 70px;
            height: 70px;
            border-radius: 8px;
            object-fit: cover;
            margin-right: 15px;
            background: #ddd;
        }
        .wr-song-details h3 {
            margin: 0 0 5px 0;
            font-size: 16px;
            color: #333;
            max-width: 280px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }
        .wr-song-details p {
            margin: 0;
            font-size: 13px;
            color: #666;
        }
        .wr-audio-list {
            margin-bottom: 15px;
        }
        .wr-audio-list-title {
            font-size: 14px;
            font-weight: 600;
            color: #333;
            margin-bottom: 10px;
            display: flex;
            align-items: center;
            gap: 8px;
        }
        .wr-audio-list-title .count {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 2px 8px;
            border-radius: 10px;
            font-size: 12px;
        }
        .wr-audio-item {
            display: flex;
            align-items: center;
            padding: 12px;
            background: #f8f9fa;
            border-radius: 8px;
            margin-bottom: 8px;
            transition: all 0.3s;
        }
        .wr-audio-item:hover {
            background: #eef0f5;
        }
        .wr-audio-item-info {
            flex: 1;
            min-width: 0;
        }
        .wr-audio-item-name {
            font-size: 13px;
            color: #333;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            margin-bottom: 3px;
        }
        .wr-audio-item-meta {
            font-size: 11px;
            color: #999;
        }
        .wr-audio-item-btn {
            padding: 8px 16px;
            border: none;
            border-radius: 6px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            font-size: 12px;
            cursor: pointer;
            transition: all 0.3s;
            white-space: nowrap;
        }
        .wr-audio-item-btn:hover {
            transform: scale(1.05);
            box-shadow: 0 3px 10px rgba(102, 126, 234, 0.4);
        }
        .wr-download-btn {
            width: 100%;
            padding: 15px;
            border: none;
            border-radius: 10px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            font-size: 16px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 10px;
        }
        .wr-download-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 5px 20px rgba(102, 126, 234, 0.4);
        }
        .wr-download-btn:disabled {
            opacity: 0.6;
            cursor: not-allowed;
            transform: none;
        }
        .wr-download-btn svg {
            width: 20px;
            height: 20px;
            fill: white;
        }
        .wr-status-message {
            text-align: center;
            padding: 40px 20px;
            color: #666;
        }
        .wr-status-message.loading::before {
            content: '';
            display: block;
            width: 40px;
            height: 40px;
            margin: 0 auto 15px;
            border: 3px solid #e9ecef;
            border-top-color: #667eea;
            border-radius: 50%;
            animation: wr-spin 1s linear infinite;
        }
        @keyframes wr-spin {
            to { transform: rotate(360deg); }
        }
        .wr-toast {
            position: fixed;
            bottom: 180px;
            right: 20px;
            padding: 12px 24px;
            background: #333;
            color: white;
            border-radius: 8px;
            font-size: 14px;
            z-index: 99999999;
            opacity: 0;
            transform: translateY(20px);
            transition: all 0.3s ease;
        }
        .wr-toast.show {
            opacity: 1;
            transform: translateY(0);
        }
        .wr-toast.success {
            background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);
        }
        .wr-toast.error {
            background: linear-gradient(135deg, #eb3349 0%, #f45c43 100%);
        }
        .wr-tips {
            background: #fff3cd;
            border: 1px solid #ffc107;
            border-radius: 8px;
            padding: 12px;
            margin-bottom: 15px;
            font-size: 12px;
            color: #856404;
        }
        .wr-tips strong {
            display: block;
            margin-bottom: 5px;
        }
        .wr-platform-badge {
            display: inline-block;
            padding: 3px 8px;
            border-radius: 4px;
            font-size: 11px;
            font-weight: 600;
            margin-left: 10px;
        }
        .wr-platform-netease { background: #c20c0c; color: white; }
        .wr-platform-qq { background: #31c27c; color: white; }
        .wr-platform-kugou { background: #009fe8; color: white; }
        .wr-platform-kuwo { background: #f5a623; color: white; }
        .wr-platform-migu { background: #ff4081; color: white; }
        .wr-platform-ximalaya { background: #f26b1f; color: white; }
        .wr-platform-bilibili { background: #fb7299; color: white; }
        .wr-refresh-btn {
            background: none;
            border: 1px solid #667eea;
            color: #667eea;
            padding: 5px 12px;
            border-radius: 5px;
            font-size: 12px;
            cursor: pointer;
            margin-left: auto;
        }
        .wr-refresh-btn:hover {
            background: #667eea;
            color: white;
        }
        .wr-quality-select {
            margin-bottom: 15px;
        }
        .wr-quality-select label {
            display: block;
            font-size: 14px;
            font-weight: 600;
            color: #333;
            margin-bottom: 8px;
        }
        .wr-quality-select select {
            width: 100%;
            padding: 10px;
            border: 2px solid #e9ecef;
            border-radius: 8px;
            font-size: 14px;
            outline: none;
            cursor: pointer;
        }
        .wr-quality-select select:focus {
            border-color: #667eea;
        }
        @media (prefers-color-scheme: dark) {
            .wr-music-modal {
                background: #1a1a2e;
            }
            .wr-music-modal-body {
                color: #e0e0e0;
            }
            .wr-song-info, .wr-audio-item {
                background: #252542;
            }
            .wr-audio-item:hover {
                background: #2d2d4a;
            }
            .wr-song-details h3, .wr-audio-list-title, .wr-audio-item-name {
                color: #fff;
            }
            .wr-song-details p, .wr-audio-item-meta {
                color: #aaa;
            }
            .wr-tips {
                background: #3d3d00;
                border-color: #666600;
                color: #ffff99;
            }
            .wr-quality-select label {
                color: #fff;
            }
            .wr-quality-select select {
                background: #252542;
                color: #fff;
                border-color: #444;
            }
        }
    `;

    // ==================== 工具函数 ====================
    const Utils = {
        log: (msg, data = '') => {
            if (CONFIG.debugMode) {
                console.log(`[${CONFIG.name}] ${msg}`, data);
            }
        },

        toast: (message, type = 'info') => {
            const existing = document.querySelector('.wr-toast');
            if (existing) existing.remove();

            const toast = document.createElement('div');
            toast.className = `wr-toast ${type}`;
            toast.textContent = message;
            document.body.appendChild(toast);

            setTimeout(() => toast.classList.add('show'), 10);
            setTimeout(() => {
                toast.classList.remove('show');
                setTimeout(() => toast.remove(), 300);
            }, 3000);
        },

        request: (options) => {
            return new Promise((resolve, reject) => {
                GM_xmlhttpRequest({
                    method: options.method || 'GET',
                    url: options.url,
                    headers: options.headers || {},
                    data: options.data,
                    responseType: options.responseType || 'json',
                    timeout: 15000,
                    onload: (response) => {
                        try {
                            let data = response.response;
                            if (typeof data === 'string') {
                                try { data = JSON.parse(data); } catch(e) {}
                            }
                            resolve(data);
                        } catch (e) {
                            resolve(response.responseText);
                        }
                    },
                    onerror: (error) => reject(error),
                    ontimeout: () => reject(new Error('请求超时'))
                });
            });
        },

        sanitizeFilename: (name) => {
            return name.replace(/[<>:"/\\|?*\x00-\x1f]/g, '_').substring(0, 200);
        },

        getPlatform: () => {
            const host = location.hostname;
            if (host.includes('163.com')) return 'netease';
            if (host.includes('qq.com')) return 'qq';
            if (host.includes('kugou.com')) return 'kugou';
            if (host.includes('kuwo.cn')) return 'kuwo';
            if (host.includes('migu.cn')) return 'migu';
            if (host.includes('ximalaya.com')) return 'ximalaya';
            if (host.includes('bilibili.com')) return 'bilibili';
            return 'unknown';
        },

        getPlatformName: (platform) => {
            const names = {
                netease: '网易云音乐',
                qq: 'QQ音乐',
                kugou: '酷狗音乐',
                kuwo: '酷我音乐',
                migu: '咪咕音乐',
                ximalaya: '喜马拉雅',
                bilibili: '哔哩哔哩'
            };
            return names[platform] || '未知平台';
        },

        formatFileSize: (bytes) => {
            if (!bytes) return '未知大小';
            const sizes = ['B', 'KB', 'MB', 'GB'];
            const i = Math.floor(Math.log(bytes) / Math.log(1024));
            return (bytes / Math.pow(1024, i)).toFixed(2) + ' ' + sizes[i];
        },

        downloadWithFetch: async (url, filename) => {
            try {
                // 使用GM_download
                return new Promise((resolve, reject) => {
                    GM_download({
                        url: url,
                        name: filename,
                        saveAs: true,
                        onload: () => {
                            Utils.toast('下载成功: ' + filename, 'success');
                            resolve();
                        },
                        onerror: (err) => {
                            Utils.log('GM_download失败，尝试备用方案', err);
                            // 备用方案：打开新窗口
                            window.open(url, '_blank');
                            Utils.toast('已在新窗口打开下载链接', 'success');
                            resolve();
                        }
                    });
                });
            } catch (e) {
                // 最后的备用方案
                const a = document.createElement('a');
                a.href = url;
                a.download = filename;
                a.target = '_blank';
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                Utils.toast('已开始下载', 'success');
            }
        }
    };

    // ==================== 音频捕获器 ====================
    const AudioCapture = {
        captured: [],

        init: () => {
            // 监听所有XHR请求
            AudioCapture.hookXHR();
            // 监听fetch请求
            AudioCapture.hookFetch();
            // 监听audio/video元素
            AudioCapture.watchMediaElements();

            Utils.log('音频捕获器已初始化');
        },

        hookXHR: () => {
            const originalOpen = XMLHttpRequest.prototype.open;
            const originalSend = XMLHttpRequest.prototype.send;

            XMLHttpRequest.prototype.open = function(method, url) {
                this._url = url;
                return originalOpen.apply(this, arguments);
            };

            XMLHttpRequest.prototype.send = function() {
                this.addEventListener('load', function() {
                    AudioCapture.checkUrl(this._url, 'xhr');
                });
                return originalSend.apply(this, arguments);
            };
        },

        hookFetch: () => {
            const originalFetch = window.fetch;
            window.fetch = function(url, options) {
                if (typeof url === 'string') {
                    AudioCapture.checkUrl(url, 'fetch');
                }
                return originalFetch.apply(this, arguments);
            };
        },

        watchMediaElements: () => {
            // 监听现有的audio/video元素
            const checkMedia = () => {
                document.querySelectorAll('audio, video').forEach(el => {
                    if (el.src) {
                        AudioCapture.checkUrl(el.src, 'media-element');
                    }
                    // 检查source子元素
                    el.querySelectorAll('source').forEach(source => {
                        if (source.src) {
                            AudioCapture.checkUrl(source.src, 'source-element');
                        }
                    });
                });
            };

            checkMedia();

            // 监听DOM变化
            const observer = new MutationObserver(() => {
                checkMedia();
            });
            observer.observe(document.body, { childList: true, subtree: true });
        },

        checkUrl: (url, source) => {
            if (!url || typeof url !== 'string') return;

            // 检查是否是音频URL
            const audioPatterns = [
                /\.mp3(\?|$)/i,
                /\.m4a(\?|$)/i,
                /\.flac(\?|$)/i,
                /\.wav(\?|$)/i,
                /\.aac(\?|$)/i,
                /\.ogg(\?|$)/i,
                /\.wma(\?|$)/i,
                /audio/i,
                /music/i,
                /song/i,
                /vod.*m3u8/i,
                /m4s.*audio/i
            ];

            const isAudio = audioPatterns.some(pattern => pattern.test(url));

            // 排除一些不需要的URL
            const excludePatterns = [
                /\.js(\?|$)/i,
                /\.css(\?|$)/i,
                /\.png(\?|$)/i,
                /\.jpg(\?|$)/i,
                /\.gif(\?|$)/i,
                /\.svg(\?|$)/i,
                /analytics/i,
                /tracking/i,
                /advertisement/i
            ];

            const isExcluded = excludePatterns.some(pattern => pattern.test(url));

            if (isAudio && !isExcluded) {
                // 避免重复添加
                if (!AudioCapture.captured.find(item => item.url === url)) {
                    const info = {
                        url: url,
                        source: source,
                        time: new Date().toLocaleTimeString(),
                        format: AudioCapture.getFormat(url)
                    };
                    AudioCapture.captured.push(info);
                    Utils.log('捕获到音频:', info);
                }
            }
        },

        getFormat: (url) => {
            const match = url.match(/\.(mp3|m4a|flac|wav|aac|ogg|wma)/i);
            return match ? match[1].toUpperCase() : 'MP3';
        },

        getCaptured: () => {
            return AudioCapture.captured;
        },

        clear: () => {
            AudioCapture.captured = [];
        }
    };

    // ==================== 平台解析器 ====================
    const Platforms = {
        // 网易云音乐
        netease: {
            getSongInfo: async () => {
                const url = location.href;
                let songId = null;

                // 从URL获取
                const match = url.match(/song[\/\?].*?(\d+)/) || url.match(/id=(\d+)/);
                if (match) songId = match[1];

                // 从iframe获取 (网易云使用iframe)
                if (!songId) {
                    try {
                        const iframe = document.querySelector('iframe[name="contentFrame"]');
                        if (iframe && iframe.contentWindow) {
                            const iframeUrl = iframe.contentWindow.location.href;
                            const iframeMatch = iframeUrl.match(/song[\/\?].*?(\d+)/) || iframeUrl.match(/id=(\d+)/);
                            if (iframeMatch) songId = iframeMatch[1];
                        }
                    } catch (e) {}
                }

                // 从播放器获取
                if (!songId) {
                    const player = document.querySelector('.m-player, .g-btmbar');
                    if (player) {
                        const songLink = player.querySelector('a[href*="song"]');
                        if (songLink) {
                            const linkMatch = songLink.href.match(/id=(\d+)/);
                            if (linkMatch) songId = linkMatch[1];
                        }
                    }
                }

                if (!songId) return null;

                try {
                    const detail = await Utils.request({
                        url: `https://music.163.com/api/song/detail?ids=[${songId}]`
                    });

                    if (detail && detail.songs && detail.songs[0]) {
                        const song = detail.songs[0];
                        return {
                            id: songId,
                            name: song.name,
                            artist: song.artists.map(a => a.name).join('/'),
                            album: song.album.name,
                            cover: song.album.picUrl,
                            platform: 'netease'
                        };
                    }
                } catch (e) {
                    Utils.log('获取网易云歌曲详情失败', e);
                }

                // 从页面元素获取信息
                const nameEl = document.querySelector('.tit .name, .f-ff2.f-brk, h1.name');
                const artistEl = document.querySelector('.des .name, .singer, span.name a');

                if (nameEl) {
                    return {
                        id: songId,
                        name: nameEl.textContent.trim(),
                        artist: artistEl ? artistEl.textContent.trim() : '未知歌手',
                        album: '',
                        cover: document.querySelector('.u-cover img, .j-img')?.src || '',
                        platform: 'netease'
                    };
                }

                return { id: songId, name: '未知歌曲', artist: '未知歌手', platform: 'netease' };
            },

            getDownloadUrls: async (songInfo) => {
                const urls = [];

                // 方法1: 官方外链
                urls.push({
                    url: `https://music.163.com/song/media/outer/url?id=${songInfo.id}.mp3`,
                    quality: '标准音质',
                    format: 'MP3'
                });

                // 方法2: 尝试其他API
                try {
                    const apis = [
                        `https://api.paugram.com/netease/?id=${songInfo.id}`,
                        `https://autumnfish.cn/song/url?id=${songInfo.id}`,
                    ];

                    for (const api of apis) {
                        try {
                            const data = await Utils.request({ url: api });
                            if (data && data.data && data.data[0] && data.data[0].url) {
                                urls.push({
                                    url: data.data[0].url,
                                    quality: '高音质',
                                    format: 'MP3'
                                });
                                break;
                            }
                        } catch (e) {}
                    }
                } catch (e) {}

                return urls;
            }
        },

        // QQ音乐
        qq: {
            getSongInfo: async () => {
                const url = location.href;
                let songMid = null;

                const match = url.match(/songDetail\/([a-zA-Z0-9]+)/) || url.match(/song\/([a-zA-Z0-9]+)/);
                if (match) songMid = match[1];

                // 从页面获取
                if (!songMid) {
                    const el = document.querySelector('[data-stat*="songid"], [data-id]');
                    if (el) songMid = el.getAttribute('data-stat')?.match(/songid=([^&]+)/)?.[1] || el.getAttribute('data-id');
                }

                if (!songMid) return null;

                try {
                    const detail = await Utils.request({
                        url: `https://c.y.qq.com/v8/fcg-bin/fcg_play_single_song.fcg?songmid=${songMid}&format=json`
                    });

                    if (detail && detail.data && detail.data[0]) {
                        const song = detail.data[0];
                        return {
                            id: songMid,
                            mid: songMid,
                            name: song.songname,
                            artist: song.singer.map(s => s.name).join('/'),
                            album: song.albumname,
                            cover: `https://y.qq.com/music/photo_new/T002R300x300M000${song.albummid}.jpg`,
                            platform: 'qq'
                        };
                    }
                } catch (e) {
                    Utils.log('获取QQ音乐详情失败', e);
                }

                // 从页面元素获取
                const nameEl = document.querySelector('.data__name, .song_name h1');
                const artistEl = document.querySelector('.data__singer, .singer_name');

                if (nameEl) {
                    return {
                        id: songMid,
                        name: nameEl.textContent.trim(),
                        artist: artistEl ? artistEl.textContent.trim() : '未知歌手',
                        platform: 'qq'
                    };
                }

                return { id: songMid, name: '未知歌曲', artist: '未知歌手', platform: 'qq' };
            },

            getDownloadUrls: async (songInfo) => {
                const urls = [];

                // QQ音乐需要复杂的签名，这里提供一些可能的方案
                // 主要依赖页面上的音频捕获

                return urls;
            }
        },

        // 酷狗音乐
        kugou: {
            getSongInfo: async () => {
                const url = location.href;
                let hash = null;

                const match = url.match(/hash=([a-fA-F0-9]+)/);
                if (match) hash = match[1];

                // 从页面获取
                if (!hash) {
                    const scripts = document.querySelectorAll('script');
                    for (const script of scripts) {
                        const hashMatch = script.textContent.match(/"hash":\s*"([a-fA-F0-9]+)"/);
                        if (hashMatch) {
                            hash = hashMatch[1];
                            break;
                        }
                    }
                }

                if (!hash) return null;

                try {
                    const detail = await Utils.request({
                        url: `https://wwwapi.kugou.com/yy/index.php?r=play/getdata&hash=${hash}`
                    });

                    if (detail && detail.data) {
                        return {
                            id: hash,
                            name: detail.data.song_name || detail.data.audio_name,
                            artist: detail.data.author_name,
                            album: detail.data.album_name,
                            cover: detail.data.img,
                            playUrl: detail.data.play_url,
                            platform: 'kugou'
                        };
                    }
                } catch (e) {
                    Utils.log('获取酷狗歌曲详情失败', e);
                }

                return { id: hash, name: '未知歌曲', artist: '未知歌手', platform: 'kugou' };
            },

            getDownloadUrls: async (songInfo) => {
                const urls = [];

                if (songInfo.playUrl) {
                    urls.push({
                        url: songInfo.playUrl,
                        quality: '标准音质',
                        format: 'MP3'
                    });
                }

                return urls;
            }
        },

        // 酷我音乐
        kuwo: {
            getSongInfo: async () => {
                const url = location.href;
                let rid = null;

                const match = url.match(/play_detail\/(\d+)/) || url.match(/rid=(\d+)/) || url.match(/\/(\d+)$/);
                if (match) rid = match[1];

                if (!rid) return null;

                // 从页面获取信息
                const nameEl = document.querySelector('.name, .song_name h1');
                const artistEl = document.querySelector('.artist, .singer_name');

                return {
                    id: rid,
                    name: nameEl ? nameEl.textContent.trim() : '未知歌曲',
                    artist: artistEl ? artistEl.textContent.trim() : '未知歌手',
                    cover: document.querySelector('.album_img img, .cover img')?.src || '',
                    platform: 'kuwo'
                };
            },

            getDownloadUrls: async (songInfo) => {
                const urls = [];

                try {
                    // 酷我API
                    const response = await Utils.request({
                        url: `https://www.kuwo.cn/api/v1/www/music/playUrl?mid=${songInfo.id}&type=convert_url3&br=320kmp3`,
                        headers: {
                            'Referer': 'https://www.kuwo.cn/',
                            'Cookie': 'kw_token=xxx'
                        }
                    });

                    if (response && response.data && response.data.url) {
                        urls.push({
                            url: response.data.url,
                            quality: '320kbps',
                            format: 'MP3'
                        });
                    }
                } catch (e) {
                    Utils.log('获取酷我下载链接失败', e);
                }

                return urls;
            }
        },

        // 咪咕音乐
        migu: {
            getSongInfo: async () => {
                const url = location.href;
                let songId = null;

                const match = url.match(/song\/([A-Za-z0-9]+)/);
                if (match) songId = match[1];

                if (!songId) return null;

                const nameEl = document.querySelector('.song-info .song-name, .song_name');
                const artistEl = document.querySelector('.song-info .singer-name, .singer_name');

                return {
                    id: songId,
                    name: nameEl ? nameEl.textContent.trim() : '未知歌曲',
                    artist: artistEl ? artistEl.textContent.trim() : '未知歌手',
                    cover: document.querySelector('.song-cover img, .cover img')?.src || '',
                    platform: 'migu'
                };
            },

            getDownloadUrls: async (songInfo) => {
                return [];
            }
        },

        // 喜马拉雅
        ximalaya: {
            getSongInfo: async () => {
                const url = location.href;
                let trackId = null;

                const match = url.match(/sound\/(\d+)/);
                if (match) trackId = match[1];

                if (!trackId) return null;

                try {
                    const detail = await Utils.request({
                        url: `https://www.ximalaya.com/revision/play/v1/audio?id=${trackId}&ptype=1`
                    });

                    if (detail && detail.data) {
                        return {
                            id: trackId,
                            name: detail.data.trackName || document.querySelector('.sound-title, .title-wrapper h1')?.textContent || '未知音频',
                            artist: detail.data.nickname || document.querySelector('.username')?.textContent || '未知主播',
                            cover: detail.data.coverPath,
                            playUrl: detail.data.src,
                            platform: 'ximalaya'
                        };
                    }
                } catch (e) {
                    Utils.log('获取喜马拉雅音频详情失败', e);
                }

                return {
                    id: trackId,
                    name: document.querySelector('.sound-title, .title-wrapper h1')?.textContent || '未知音频',
                    artist: document.querySelector('.username')?.textContent || '未知主播',
                    platform: 'ximalaya'
                };
            },

            getDownloadUrls: async (songInfo) => {
                const urls = [];

                if (songInfo.playUrl) {
                    urls.push({
                        url: songInfo.playUrl,
                        quality: '高清音质',
                        format: 'M4A'
                    });
                }

                return urls;
            }
        },

        // B站
        bilibili: {
            getSongInfo: async () => {
                const url = location.href;
                let bvid = null;

                const match = url.match(/BV([a-zA-Z0-9]+)/);
                if (match) bvid = 'BV' + match[1];

                if (!bvid) return null;

                try {
                    const detail = await Utils.request({
                        url: `https://api.bilibili.com/x/web-interface/view?bvid=${bvid}`
                    });

                    if (detail && detail.data) {
                        return {
                            id: bvid,
                            aid: detail.data.aid,
                            cid: detail.data.cid,
                            name: detail.data.title,
                            artist: detail.data.owner.name,
                            cover: detail.data.pic,
                            platform: 'bilibili'
                        };
                    }
                } catch (e) {
                    Utils.log('获取B站视频详情失败', e);
                }

                return {
                    id: bvid,
                    name: document.querySelector('.video-title, h1.title')?.textContent || '未知视频',
                    artist: document.querySelector('.username')?.textContent || '未知UP主',
                    platform: 'bilibili'
                };
            },

            getDownloadUrls: async (songInfo) => {
                const urls = [];

                if (!songInfo.aid || !songInfo.cid) return urls;

                try {
                    const playInfo = await Utils.request({
                        url: `https://api.bilibili.com/x/player/playurl?avid=${songInfo.aid}&cid=${songInfo.cid}&fnval=16`
                    });

                    if (playInfo && playInfo.data && playInfo.data.dash && playInfo.data.dash.audio) {
                        const audios = playInfo.data.dash.audio.sort((a, b) => b.bandwidth - a.bandwidth);
                        if (audios[0]) {
                            urls.push({
                                url: audios[0].baseUrl,
                                quality: '高质量音频',
                                format: 'M4A',
                                needReferer: true
                            });
                        }
                    }
                } catch (e) {
                    Utils.log('获取B站音频失败', e);
                }

                return urls;
            }
        }
    };

    // ==================== UI ====================
    const UI = {
        modal: null,

        init: () => {
            GM_addStyle(STYLES);
            UI.createButton();
            UI.createModal();
            AudioCapture.init();
        },

        createButton: () => {
            const btn = document.createElement('button');
            btn.className = 'wr-music-download-btn';
            btn.title = CONFIG.name;
            btn.innerHTML = `
                <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14.5v-5l-2.5 2.5-1.41-1.41L12 7.17l4.91 4.92-1.41 1.41L13 11v5.5h-2z" transform="rotate(180 12 12)"/>
                </svg>
            `;
            btn.onclick = () => UI.openModal();
            document.body.appendChild(btn);
        },

        createModal: () => {
            const overlay = document.createElement('div');
            overlay.className = 'wr-music-modal-overlay';
            overlay.innerHTML = `
                <div class="wr-music-modal">
                    <div class="wr-music-modal-header">
                        <h2 class="wr-music-modal-title">${CONFIG.name}</h2>
                        <p class="wr-music-modal-subtitle">v${CONFIG.version} by ${CONFIG.author}</p>
                        <button class="wr-music-modal-close">&times;</button>
                    </div>
                    <div class="wr-music-modal-body" id="wr-modal-content">
                    </div>
                </div>
            `;

            overlay.querySelector('.wr-music-modal-close').onclick = () => UI.closeModal();
            overlay.onclick = (e) => {
                if (e.target === overlay) UI.closeModal();
            };

            document.body.appendChild(overlay);
            UI.modal = overlay;
        },

        openModal: async () => {
            UI.modal.classList.add('active');
            const content = document.getElementById('wr-modal-content');
            content.innerHTML = '<div class="wr-status-message loading">正在分析页面...</div>';

            const platform = Utils.getPlatform();
            const platformName = Utils.getPlatformName(platform);

            if (platform === 'unknown' || !Platforms[platform]) {
                content.innerHTML = `
                    <div class="wr-status-message">
                        <p>当前网站暂不支持</p>
                        <p style="font-size: 12px; margin-top: 10px;">
                            支持的平台: 网易云音乐、QQ音乐、酷狗音乐、酷我音乐、咪咕音乐、喜马拉雅、B站
                        </p>
                    </div>
                `;
                return;
            }

            // 获取歌曲信息
            const handler = Platforms[platform];
            const songInfo = await handler.getSongInfo();
            const apiUrls = songInfo ? await handler.getDownloadUrls(songInfo) : [];
            const capturedUrls = AudioCapture.getCaptured();

            Utils.log('歌曲信息:', songInfo);
            Utils.log('API URLs:', apiUrls);
            Utils.log('捕获的URLs:', capturedUrls);

            // 构建UI
            let html = '';

            // 提示信息
            html += `
                <div class="wr-tips">
                    <strong>使用提示：</strong>
                    请先播放音乐，脚本会自动捕获播放的音频链接。如果没有捕获到，请刷新页面后重新播放。
                </div>
            `;

            // 歌曲信息
            if (songInfo) {
                html += `
                    <div class="wr-song-info">
                        <img class="wr-song-cover" src="${songInfo.cover || 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCI+PHBhdGggZmlsbD0iI2NjYyIgZD0iTTEyIDNhOSA5IDAgMCAwLTkgOXY3YzAgMS4xLjkgMiAyIDJoNHYtOEg1di0xYzAtMy44NyAzLjEzLTcgNy03czMuMTMgNyA3djFoLTR2OGg0YzEuMSAwIDItLjkgMi0ydi03YTkgOSAwIDAgMC05LTl6Ii8+PC9zdmc+'}"
                             onerror="this.style.background='#ddd'">
                        <div class="wr-song-details">
                            <h3>${songInfo.name || '未知歌曲'}</h3>
                            <p>${songInfo.artist || '未知歌手'}${songInfo.album ? ' · ' + songInfo.album : ''}</p>
                            <span class="wr-platform-badge wr-platform-${platform}">${platformName}</span>
                        </div>
                    </div>
                `;
            }

            // 合并所有可用的下载链接
            const allUrls = [];

            // 添加API获取的链接
            apiUrls.forEach(item => {
                allUrls.push({
                    ...item,
                    source: 'API'
                });
            });

            // 添加捕获的链接
            capturedUrls.forEach(item => {
                allUrls.push({
                    url: item.url,
                    quality: '捕获音频',
                    format: item.format,
                    source: '页面捕获'
                });
            });

            if (allUrls.length > 0) {
                html += `
                    <div class="wr-audio-list">
                        <div class="wr-audio-list-title">
                            可用下载链接 <span class="count">${allUrls.length}</span>
                            <button class="wr-refresh-btn" onclick="location.reload()">刷新页面</button>
                        </div>
                `;

                allUrls.forEach((item, index) => {
                    const filename = songInfo
                        ? Utils.sanitizeFilename(`${songInfo.name} - ${songInfo.artist}.${item.format.toLowerCase()}`)
                        : `music_${index + 1}.${item.format.toLowerCase()}`;

                    html += `
                        <div class="wr-audio-item">
                            <div class="wr-audio-item-info">
                                <div class="wr-audio-item-name">${item.quality} (${item.format})</div>
                                <div class="wr-audio-item-meta">来源: ${item.source}</div>
                            </div>
                            <button class="wr-audio-item-btn" onclick="window.wrDownload('${encodeURIComponent(item.url)}', '${encodeURIComponent(filename)}')">
                                下载
                            </button>
                        </div>
                    `;
                });

                html += `</div>`;

                // 主下载按钮
                if (allUrls.length > 0 && songInfo) {
                    const bestUrl = allUrls[0];
                    const filename = Utils.sanitizeFilename(`${songInfo.name} - ${songInfo.artist}.${bestUrl.format.toLowerCase()}`);

                    html += `
                        <button class="wr-download-btn" onclick="window.wrDownload('${encodeURIComponent(bestUrl.url)}', '${encodeURIComponent(filename)}')">
                            <svg viewBox="0 0 24 24">
                                <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/>
                            </svg>
                            下载最佳音质
                        </button>
                    `;
                }
            } else {
                html += `
                    <div class="wr-audio-list">
                        <div class="wr-audio-list-title">
                            可用下载链接 <span class="count">0</span>
                            <button class="wr-refresh-btn" onclick="location.reload()">刷新页面</button>
                        </div>
                        <div class="wr-status-message">
                            <p>未捕获到音频链接</p>
                            <p style="font-size: 12px; margin-top: 10px;">
                                请确保音乐正在播放，或尝试刷新页面后重新播放
                            </p>
                        </div>
                    </div>
                `;
            }

            content.innerHTML = html;
        },

        closeModal: () => {
            UI.modal.classList.remove('active');
        }
    };

    // 全局下载函数
    window.wrDownload = async (encodedUrl, encodedFilename) => {
        const url = decodeURIComponent(encodedUrl);
        const filename = decodeURIComponent(encodedFilename);

        Utils.log('开始下载:', { url, filename });
        Utils.toast('正在下载...', 'info');

        try {
            await Utils.downloadWithFetch(url, filename);
        } catch (e) {
            Utils.log('下载失败:', e);
            Utils.toast('下载失败，请重试', 'error');
        }
    };

    // ==================== 初始化 ====================
    const init = () => {
        Utils.log('脚本初始化中...');

        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', UI.init);
        } else {
            UI.init();
        }

        Utils.log(`初始化完成! 平台: ${Utils.getPlatformName(Utils.getPlatform())}`);
    };

    init();
})();
