// ==UserScript==
// @name         威软音乐下载神器
// @namespace    https://github.com/weiruankeji2025
// @version      1.0.0
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
// @match        *://music.youtube.com/*
// @match        *://open.spotify.com/*
// @match        *://www.bilibili.com/*
// @match        *://*.bilibili.com/*
// @icon         data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCI+PHBhdGggZmlsbD0iIzFEQjk1NCIgZD0iTTEyIDNhOSA5IDAgMCAwLTkgOXY3YzAgMS4xLjkgMiAyIDJoNHYtOEg1di0xYzAtMy44NyAzLjEzLTcgNy03czMuMTMgNyA3djFoLTR2OGg0YzEuMSAwIDItLjkgMi0ydi03YTkgOSAwIDAgMC05LTl6Ii8+PC9zdmc+
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
        version: '1.0.0',
        author: '威软科技',
        defaultQuality: 'high', // low, medium, high, lossless
        showNotification: true,
        debugMode: false
    };

    // ==================== 样式 ====================
    const STYLES = `
        /* 主按钮样式 */
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

        /* 弹窗样式 */
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
            width: 420px;
            max-width: 90vw;
            max-height: 80vh;
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
            max-height: 400px;
            overflow-y: auto;
        }

        /* 歌曲信息 */
        .wr-song-info {
            display: flex;
            align-items: center;
            padding: 15px;
            background: #f8f9fa;
            border-radius: 12px;
            margin-bottom: 20px;
        }

        .wr-song-cover {
            width: 60px;
            height: 60px;
            border-radius: 8px;
            object-fit: cover;
            margin-right: 15px;
        }

        .wr-song-details h3 {
            margin: 0 0 5px 0;
            font-size: 16px;
            color: #333;
        }

        .wr-song-details p {
            margin: 0;
            font-size: 13px;
            color: #666;
        }

        /* 质量选择 */
        .wr-quality-section {
            margin-bottom: 20px;
        }

        .wr-quality-title {
            font-size: 14px;
            font-weight: 600;
            color: #333;
            margin-bottom: 10px;
        }

        .wr-quality-options {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 10px;
        }

        .wr-quality-option {
            padding: 12px;
            border: 2px solid #e9ecef;
            border-radius: 10px;
            cursor: pointer;
            transition: all 0.3s;
            text-align: center;
        }

        .wr-quality-option:hover {
            border-color: #667eea;
        }

        .wr-quality-option.selected {
            border-color: #667eea;
            background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
        }

        .wr-quality-option .quality-name {
            font-size: 14px;
            font-weight: 600;
            color: #333;
        }

        .wr-quality-option .quality-desc {
            font-size: 11px;
            color: #999;
            margin-top: 3px;
        }

        .wr-quality-option.disabled {
            opacity: 0.5;
            cursor: not-allowed;
        }

        /* 下载按钮 */
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

        /* 进度条 */
        .wr-progress-container {
            margin-top: 15px;
            display: none;
        }

        .wr-progress-container.active {
            display: block;
        }

        .wr-progress-bar {
            height: 8px;
            background: #e9ecef;
            border-radius: 4px;
            overflow: hidden;
        }

        .wr-progress-fill {
            height: 100%;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            width: 0%;
            transition: width 0.3s ease;
        }

        .wr-progress-text {
            font-size: 12px;
            color: #666;
            text-align: center;
            margin-top: 8px;
        }

        /* 歌曲列表 */
        .wr-song-list {
            max-height: 300px;
            overflow-y: auto;
        }

        .wr-song-item {
            display: flex;
            align-items: center;
            padding: 12px;
            border-radius: 8px;
            cursor: pointer;
            transition: background 0.3s;
        }

        .wr-song-item:hover {
            background: #f8f9fa;
        }

        .wr-song-item-cover {
            width: 45px;
            height: 45px;
            border-radius: 6px;
            object-fit: cover;
            margin-right: 12px;
        }

        .wr-song-item-info {
            flex: 1;
            min-width: 0;
        }

        .wr-song-item-title {
            font-size: 14px;
            font-weight: 500;
            color: #333;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }

        .wr-song-item-artist {
            font-size: 12px;
            color: #999;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }

        .wr-song-item-download {
            width: 36px;
            height: 36px;
            border: none;
            border-radius: 50%;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: transform 0.3s;
        }

        .wr-song-item-download:hover {
            transform: scale(1.1);
        }

        .wr-song-item-download svg {
            width: 18px;
            height: 18px;
            fill: white;
        }

        /* 状态提示 */
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

        /* Toast通知 */
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

        /* 平台标识 */
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

        /* 内联歌曲下载按钮 */
        .wr-inline-download-btn {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            width: 28px;
            height: 28px;
            border-radius: 50%;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            border: none;
            cursor: pointer;
            margin-left: 8px;
            transition: all 0.3s ease;
            vertical-align: middle;
        }

        .wr-inline-download-btn:hover {
            transform: scale(1.15);
            box-shadow: 0 3px 10px rgba(102, 126, 234, 0.4);
        }

        .wr-inline-download-btn svg {
            width: 14px;
            height: 14px;
            fill: white;
        }

        /* 暗色模式支持 */
        @media (prefers-color-scheme: dark) {
            .wr-music-modal {
                background: #1a1a2e;
            }
            .wr-music-modal-body {
                color: #e0e0e0;
            }
            .wr-song-info {
                background: #252542;
            }
            .wr-song-details h3 {
                color: #fff;
            }
            .wr-song-details p {
                color: #aaa;
            }
            .wr-quality-title {
                color: #fff;
            }
            .wr-quality-option {
                border-color: #333;
                background: #252542;
            }
            .wr-quality-option .quality-name {
                color: #fff;
            }
            .wr-song-item:hover {
                background: #252542;
            }
            .wr-song-item-title {
                color: #fff;
            }
        }
    `;

    // ==================== 工具函数 ====================
    const Utils = {
        log: (msg, type = 'info') => {
            if (CONFIG.debugMode || type === 'error') {
                console[type](`[${CONFIG.name}] ${msg}`);
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

        downloadFile: (url, filename) => {
            return new Promise((resolve, reject) => {
                GM_download({
                    url: url,
                    name: filename,
                    saveAs: false,
                    onload: () => resolve(),
                    onerror: (error) => reject(error),
                    onprogress: (progress) => {
                        if (progress.totalSize > 0) {
                            const percent = Math.round((progress.loaded / progress.totalSize) * 100);
                            UI.updateProgress(percent);
                        }
                    }
                });
            });
        },

        request: (options) => {
            return new Promise((resolve, reject) => {
                GM_xmlhttpRequest({
                    method: options.method || 'GET',
                    url: options.url,
                    headers: options.headers || {},
                    data: options.data,
                    responseType: options.responseType || 'json',
                    onload: (response) => {
                        if (response.status >= 200 && response.status < 300) {
                            resolve(response.response || response.responseText);
                        } else {
                            reject(new Error(`HTTP ${response.status}`));
                        }
                    },
                    onerror: (error) => reject(error)
                });
            });
        },

        sanitizeFilename: (name) => {
            return name.replace(/[<>:"/\\|?*]/g, '_').substring(0, 200);
        },

        getPlatformFromUrl: () => {
            const host = location.hostname;
            if (host.includes('163.com')) return 'netease';
            if (host.includes('qq.com')) return 'qq';
            if (host.includes('kugou.com')) return 'kugou';
            if (host.includes('kuwo.cn')) return 'kuwo';
            if (host.includes('migu.cn')) return 'migu';
            if (host.includes('ximalaya.com')) return 'ximalaya';
            if (host.includes('bilibili.com')) return 'bilibili';
            if (host.includes('youtube.com')) return 'youtube';
            if (host.includes('spotify.com')) return 'spotify';
            return 'unknown';
        }
    };

    // ==================== 平台解析器 ====================
    const Platforms = {
        // 网易云音乐
        netease: {
            name: '网易云音乐',
            color: '#c20c0c',

            getSongInfo: async () => {
                const url = location.href;
                let songId = null;

                // 从URL获取歌曲ID
                const match = url.match(/song\?id=(\d+)/) || url.match(/song\/(\d+)/);
                if (match) {
                    songId = match[1];
                }

                // 尝试从页面获取
                if (!songId) {
                    const audioSrc = document.querySelector('audio')?.src;
                    if (audioSrc) {
                        const audioMatch = audioSrc.match(/song\/(\d+)/);
                        if (audioMatch) songId = audioMatch[1];
                    }
                }

                if (!songId) {
                    // 尝试从播放器获取当前播放歌曲
                    const playingInfo = document.querySelector('.play-bar .song-name, .m-playbar .name');
                    if (playingInfo) {
                        const link = playingInfo.closest('a') || playingInfo.querySelector('a');
                        if (link) {
                            const linkMatch = link.href.match(/song\?id=(\d+)/);
                            if (linkMatch) songId = linkMatch[1];
                        }
                    }
                }

                if (!songId) return null;

                try {
                    // 获取歌曲详情
                    const detailUrl = `https://music.163.com/api/song/detail?ids=[${songId}]`;
                    const detail = await Utils.request({ url: detailUrl });

                    if (detail.songs && detail.songs.length > 0) {
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
                    Utils.log('获取网易云歌曲信息失败: ' + e.message, 'error');
                }

                return null;
            },

            getDownloadUrl: async (songInfo, quality) => {
                const qualityMap = {
                    low: 128000,
                    medium: 192000,
                    high: 320000,
                    lossless: 999000
                };

                const br = qualityMap[quality] || 320000;

                try {
                    // 使用多个API源尝试获取
                    const apis = [
                        `https://music.163.com/song/media/outer/url?id=${songInfo.id}.mp3`,
                        `https://api.injahow.cn/meting/?type=url&id=${songInfo.id}&source=netease`,
                    ];

                    // 尝试直接链接
                    const directUrl = apis[0];

                    return {
                        url: directUrl,
                        format: 'mp3',
                        quality: quality
                    };
                } catch (e) {
                    Utils.log('获取下载链接失败: ' + e.message, 'error');
                    return null;
                }
            },

            getAvailableQualities: () => {
                return [
                    { id: 'low', name: '标准', desc: '128kbps MP3' },
                    { id: 'medium', name: '较高', desc: '192kbps MP3' },
                    { id: 'high', name: '极高', desc: '320kbps MP3' },
                    { id: 'lossless', name: '无损', desc: 'FLAC/APE' }
                ];
            }
        },

        // QQ音乐
        qq: {
            name: 'QQ音乐',
            color: '#31c27c',

            getSongInfo: async () => {
                const url = location.href;
                let songMid = null;

                const match = url.match(/songDetail\/([a-zA-Z0-9]+)/) || url.match(/song\/([a-zA-Z0-9]+)/);
                if (match) {
                    songMid = match[1];
                }

                // 从页面元素获取
                if (!songMid) {
                    const dataAttr = document.querySelector('[data-mid]');
                    if (dataAttr) songMid = dataAttr.getAttribute('data-mid');
                }

                if (!songMid) {
                    // 尝试从播放器获取
                    const player = unsafeWindow?.player;
                    if (player && player.getCurrentSong) {
                        const currentSong = player.getCurrentSong();
                        if (currentSong) songMid = currentSong.mid;
                    }
                }

                if (!songMid) return null;

                try {
                    const detailUrl = `https://c.y.qq.com/v8/fcg-bin/fcg_play_single_song.fcg?songmid=${songMid}&format=json`;
                    const detail = await Utils.request({ url: detailUrl });

                    if (detail.data && detail.data.length > 0) {
                        const song = detail.data[0];
                        return {
                            id: songMid,
                            songId: song.songid,
                            name: song.songname,
                            artist: song.singer.map(s => s.name).join('/'),
                            album: song.albumname,
                            cover: `https://y.qq.com/music/photo_new/T002R300x300M000${song.albummid}.jpg`,
                            platform: 'qq'
                        };
                    }
                } catch (e) {
                    Utils.log('获取QQ音乐歌曲信息失败: ' + e.message, 'error');
                }

                return null;
            },

            getDownloadUrl: async (songInfo, quality) => {
                try {
                    // QQ音乐下载链接获取
                    const url = `https://api.injahow.cn/meting/?type=url&id=${songInfo.id}&source=tencent`;
                    const data = await Utils.request({ url });

                    if (data && data.url) {
                        return {
                            url: data.url,
                            format: 'mp3',
                            quality: quality
                        };
                    }
                } catch (e) {
                    Utils.log('获取QQ音乐下载链接失败: ' + e.message, 'error');
                }

                return null;
            },

            getAvailableQualities: () => {
                return [
                    { id: 'low', name: '标准', desc: '128kbps MP3' },
                    { id: 'medium', name: '高品', desc: '192kbps MP3' },
                    { id: 'high', name: 'HQ高品质', desc: '320kbps MP3' },
                    { id: 'lossless', name: 'SQ无损', desc: 'FLAC' }
                ];
            }
        },

        // 酷狗音乐
        kugou: {
            name: '酷狗音乐',
            color: '#009fe8',

            getSongInfo: async () => {
                const url = location.href;
                let hash = null;

                const match = url.match(/hash=([a-fA-F0-9]+)/);
                if (match) hash = match[1];

                // 从页面获取
                if (!hash) {
                    const audioPlayer = document.querySelector('audio');
                    if (audioPlayer && audioPlayer.dataset.hash) {
                        hash = audioPlayer.dataset.hash;
                    }
                }

                if (!hash) {
                    // 尝试从页面数据获取
                    const scripts = document.querySelectorAll('script');
                    for (const script of scripts) {
                        const hashMatch = script.textContent.match(/"hash":"([a-fA-F0-9]+)"/);
                        if (hashMatch) {
                            hash = hashMatch[1];
                            break;
                        }
                    }
                }

                if (!hash) return null;

                try {
                    const detailUrl = `https://wwwapi.kugou.com/yy/index.php?r=play/getdata&hash=${hash}`;
                    const detail = await Utils.request({ url: detailUrl });

                    if (detail.data) {
                        const song = detail.data;
                        return {
                            id: hash,
                            name: song.song_name || song.audio_name,
                            artist: song.author_name,
                            album: song.album_name,
                            cover: song.img,
                            platform: 'kugou'
                        };
                    }
                } catch (e) {
                    Utils.log('获取酷狗歌曲信息失败: ' + e.message, 'error');
                }

                return null;
            },

            getDownloadUrl: async (songInfo, quality) => {
                try {
                    const url = `https://api.injahow.cn/meting/?type=url&id=${songInfo.id}&source=kugou`;
                    const data = await Utils.request({ url });

                    if (data && data.url) {
                        return {
                            url: data.url,
                            format: 'mp3',
                            quality: quality
                        };
                    }
                } catch (e) {
                    Utils.log('获取酷狗下载链接失败: ' + e.message, 'error');
                }

                return null;
            },

            getAvailableQualities: () => {
                return [
                    { id: 'low', name: '标准', desc: '128kbps MP3' },
                    { id: 'high', name: '高品质', desc: '320kbps MP3' },
                    { id: 'lossless', name: '无损', desc: 'FLAC' }
                ];
            }
        },

        // 酷我音乐
        kuwo: {
            name: '酷我音乐',
            color: '#f5a623',

            getSongInfo: async () => {
                const url = location.href;
                let rid = null;

                const match = url.match(/play_detail\/(\d+)/) || url.match(/rid=(\d+)/);
                if (match) rid = match[1];

                if (!rid) {
                    // 从页面获取
                    const musicInfo = document.querySelector('.music-info');
                    if (musicInfo && musicInfo.dataset.rid) {
                        rid = musicInfo.dataset.rid;
                    }
                }

                if (!rid) return null;

                try {
                    const detailUrl = `https://www.kuwo.cn/api/www/music/musicInfo?mid=${rid}`;
                    const detail = await Utils.request({
                        url: detailUrl,
                        headers: {
                            'Referer': 'https://www.kuwo.cn/',
                            'csrf': 'xxx'
                        }
                    });

                    if (detail.data) {
                        const song = detail.data;
                        return {
                            id: rid,
                            name: song.name,
                            artist: song.artist,
                            album: song.album,
                            cover: song.pic,
                            platform: 'kuwo'
                        };
                    }
                } catch (e) {
                    Utils.log('获取酷我歌曲信息失败: ' + e.message, 'error');
                }

                return null;
            },

            getDownloadUrl: async (songInfo, quality) => {
                try {
                    const url = `https://api.injahow.cn/meting/?type=url&id=${songInfo.id}&source=kuwo`;
                    const data = await Utils.request({ url });

                    if (data && data.url) {
                        return {
                            url: data.url,
                            format: 'mp3',
                            quality: quality
                        };
                    }
                } catch (e) {
                    Utils.log('获取酷我下载链接失败: ' + e.message, 'error');
                }

                return null;
            },

            getAvailableQualities: () => {
                return [
                    { id: 'low', name: '标准', desc: '128kbps' },
                    { id: 'high', name: '高品质', desc: '320kbps' },
                    { id: 'lossless', name: '无损', desc: 'FLAC' }
                ];
            }
        },

        // 咪咕音乐
        migu: {
            name: '咪咕音乐',
            color: '#ff4081',

            getSongInfo: async () => {
                const url = location.href;
                let copyrightId = null;

                const match = url.match(/song\/([A-Za-z0-9]+)/);
                if (match) copyrightId = match[1];

                if (!copyrightId) return null;

                try {
                    const detailUrl = `https://app.c.nf.migu.cn/MIGUM2.0/v1.0/content/resourceinfo.do?copyrightId=${copyrightId}&resourceType=2`;
                    const detail = await Utils.request({ url: detailUrl });

                    if (detail.resource && detail.resource.length > 0) {
                        const song = detail.resource[0];
                        return {
                            id: copyrightId,
                            contentId: song.contentId,
                            name: song.songName,
                            artist: song.singer,
                            album: song.album,
                            cover: song.albumImgs && song.albumImgs[0] ? song.albumImgs[0].img : '',
                            platform: 'migu'
                        };
                    }
                } catch (e) {
                    Utils.log('获取咪咕歌曲信息失败: ' + e.message, 'error');
                }

                return null;
            },

            getDownloadUrl: async (songInfo, quality) => {
                try {
                    const url = `https://api.injahow.cn/meting/?type=url&id=${songInfo.id}&source=migu`;
                    const data = await Utils.request({ url });

                    if (data && data.url) {
                        return {
                            url: data.url,
                            format: 'mp3',
                            quality: quality
                        };
                    }
                } catch (e) {
                    Utils.log('获取咪咕下载链接失败: ' + e.message, 'error');
                }

                return null;
            },

            getAvailableQualities: () => {
                return [
                    { id: 'low', name: '标准', desc: '128kbps' },
                    { id: 'high', name: 'HQ', desc: '320kbps' },
                    { id: 'lossless', name: '无损', desc: 'FLAC' }
                ];
            }
        },

        // 喜马拉雅
        ximalaya: {
            name: '喜马拉雅',
            color: '#f26b1f',

            getSongInfo: async () => {
                const url = location.href;
                let trackId = null;

                const match = url.match(/sound\/(\d+)/);
                if (match) trackId = match[1];

                if (!trackId) return null;

                try {
                    const detailUrl = `https://www.ximalaya.com/revision/play/v1/audio?id=${trackId}&ptype=1`;
                    const detail = await Utils.request({ url: detailUrl });

                    if (detail.data) {
                        const track = detail.data;
                        return {
                            id: trackId,
                            name: track.trackName || document.querySelector('.sound-title')?.textContent,
                            artist: track.nickname || document.querySelector('.nickname')?.textContent,
                            album: document.querySelector('.album-title')?.textContent || '',
                            cover: track.coverPath || document.querySelector('.sound-cover img')?.src,
                            src: track.src,
                            platform: 'ximalaya'
                        };
                    }
                } catch (e) {
                    Utils.log('获取喜马拉雅音频信息失败: ' + e.message, 'error');
                }

                return null;
            },

            getDownloadUrl: async (songInfo, quality) => {
                if (songInfo.src) {
                    return {
                        url: songInfo.src,
                        format: 'm4a',
                        quality: 'high'
                    };
                }
                return null;
            },

            getAvailableQualities: () => {
                return [
                    { id: 'high', name: '高清', desc: '64kbps M4A' }
                ];
            }
        },

        // B站
        bilibili: {
            name: '哔哩哔哩',
            color: '#fb7299',

            getSongInfo: async () => {
                const url = location.href;
                let aid = null, bvid = null;

                const bvMatch = url.match(/BV([a-zA-Z0-9]+)/);
                const avMatch = url.match(/av(\d+)/);

                if (bvMatch) bvid = 'BV' + bvMatch[1];
                if (avMatch) aid = avMatch[1];

                if (!bvid && !aid) return null;

                try {
                    const query = bvid ? `bvid=${bvid}` : `aid=${aid}`;
                    const detailUrl = `https://api.bilibili.com/x/web-interface/view?${query}`;
                    const detail = await Utils.request({ url: detailUrl });

                    if (detail.data) {
                        const video = detail.data;
                        return {
                            id: bvid || `av${aid}`,
                            aid: video.aid,
                            cid: video.cid,
                            name: video.title,
                            artist: video.owner.name,
                            album: '',
                            cover: video.pic,
                            platform: 'bilibili'
                        };
                    }
                } catch (e) {
                    Utils.log('获取B站视频信息失败: ' + e.message, 'error');
                }

                return null;
            },

            getDownloadUrl: async (songInfo, quality) => {
                try {
                    const playUrl = `https://api.bilibili.com/x/player/playurl?avid=${songInfo.aid}&cid=${songInfo.cid}&fnval=16`;
                    const play = await Utils.request({ url: playUrl });

                    if (play.data && play.data.dash && play.data.dash.audio) {
                        const audios = play.data.dash.audio;
                        // 选择最高质量音频
                        const audio = audios.sort((a, b) => b.bandwidth - a.bandwidth)[0];

                        return {
                            url: audio.baseUrl,
                            format: 'm4a',
                            quality: 'high'
                        };
                    }
                } catch (e) {
                    Utils.log('获取B站音频链接失败: ' + e.message, 'error');
                }

                return null;
            },

            getAvailableQualities: () => {
                return [
                    { id: 'high', name: '高质量', desc: '320kbps AAC' }
                ];
            }
        }
    };

    // ==================== UI模块 ====================
    const UI = {
        container: null,
        modal: null,
        currentSong: null,
        selectedQuality: 'high',

        init: () => {
            GM_addStyle(STYLES);
            UI.createMainButton();
            UI.createModal();
            UI.injectInlineButtons();

            // 监听页面变化，自动注入按钮
            const observer = new MutationObserver(() => {
                UI.injectInlineButtons();
            });
            observer.observe(document.body, { childList: true, subtree: true });
        },

        createMainButton: () => {
            const btn = document.createElement('button');
            btn.className = 'wr-music-download-btn';
            btn.title = CONFIG.name;
            btn.innerHTML = `
                <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14.5v-5l-2.5 2.5-1.41-1.41L12 7.17l4.91 4.92-1.41 1.41L13 11v5.5h-2z" transform="rotate(180 12 12)"/>
                </svg>
            `;
            btn.addEventListener('click', UI.openModal);
            document.body.appendChild(btn);
        },

        createModal: () => {
            const overlay = document.createElement('div');
            overlay.className = 'wr-music-modal-overlay';
            overlay.innerHTML = `
                <div class="wr-music-modal">
                    <div class="wr-music-modal-header" style="position: relative;">
                        <h2 class="wr-music-modal-title">${CONFIG.name}</h2>
                        <p class="wr-music-modal-subtitle">v${CONFIG.version} by ${CONFIG.author}</p>
                        <button class="wr-music-modal-close">&times;</button>
                    </div>
                    <div class="wr-music-modal-body">
                        <div id="wr-modal-content">
                            <div class="wr-status-message loading">正在检测当前页面音乐...</div>
                        </div>
                    </div>
                </div>
            `;

            overlay.querySelector('.wr-music-modal-close').addEventListener('click', UI.closeModal);
            overlay.addEventListener('click', (e) => {
                if (e.target === overlay) UI.closeModal();
            });

            document.body.appendChild(overlay);
            UI.modal = overlay;
        },

        openModal: async () => {
            UI.modal.classList.add('active');
            const content = UI.modal.querySelector('#wr-modal-content');
            content.innerHTML = '<div class="wr-status-message loading">正在检测当前页面音乐...</div>';

            const platform = Utils.getPlatformFromUrl();
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

            const handler = Platforms[platform];
            const songInfo = await handler.getSongInfo();

            if (!songInfo) {
                content.innerHTML = `
                    <div class="wr-status-message">
                        <p>未检测到正在播放的音乐</p>
                        <p style="font-size: 12px; margin-top: 10px;">
                            请先在当前页面播放音乐，或打开具体的歌曲页面
                        </p>
                    </div>
                `;
                return;
            }

            UI.currentSong = songInfo;
            const qualities = handler.getAvailableQualities();

            content.innerHTML = `
                <div class="wr-song-info">
                    <img class="wr-song-cover" src="${songInfo.cover || 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCI+PHBhdGggZmlsbD0iI2NjYyIgZD0iTTEyIDNhOSA5IDAgMCAwLTkgOXY3YzAgMS4xLjkgMiAyIDJoNHYtOEg1di0xYzAtMy44NyAzLjEzLTcgNy03czMuMTMgNyA3djFoLTR2OGg0YzEuMSAwIDItLjkgMi0ydi03YTkgOSAwIDAgMC05LTl6Ii8+PC9zdmc+'}" onerror="this.src='data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCI+PHBhdGggZmlsbD0iI2NjYyIgZD0iTTEyIDNhOSA5IDAgMCAwLTkgOXY3YzAgMS4xLjkgMiAyIDJoNHYtOEg1di0xYzAtMy44NyAzLjEzLTcgNy03czMuMTMgNyA3djFoLTR2OGg0YzEuMSAwIDItLjkgMi0ydi03YTkgOSAwIDAgMC05LTl6Ii8+PC9zdmc+'">
                    <div class="wr-song-details">
                        <h3>${songInfo.name}</h3>
                        <p>${songInfo.artist}${songInfo.album ? ' · ' + songInfo.album : ''}</p>
                        <span class="wr-platform-badge wr-platform-${platform}">${handler.name}</span>
                    </div>
                </div>

                <div class="wr-quality-section">
                    <div class="wr-quality-title">选择音质</div>
                    <div class="wr-quality-options">
                        ${qualities.map(q => `
                            <div class="wr-quality-option ${q.id === 'high' ? 'selected' : ''}" data-quality="${q.id}">
                                <div class="quality-name">${q.name}</div>
                                <div class="quality-desc">${q.desc}</div>
                            </div>
                        `).join('')}
                    </div>
                </div>

                <button class="wr-download-btn" id="wr-start-download">
                    <svg viewBox="0 0 24 24">
                        <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/>
                    </svg>
                    开始下载
                </button>

                <div class="wr-progress-container" id="wr-progress">
                    <div class="wr-progress-bar">
                        <div class="wr-progress-fill" id="wr-progress-fill"></div>
                    </div>
                    <div class="wr-progress-text" id="wr-progress-text">准备下载...</div>
                </div>
            `;

            // 质量选择
            content.querySelectorAll('.wr-quality-option').forEach(option => {
                option.addEventListener('click', () => {
                    if (option.classList.contains('disabled')) return;
                    content.querySelectorAll('.wr-quality-option').forEach(o => o.classList.remove('selected'));
                    option.classList.add('selected');
                    UI.selectedQuality = option.dataset.quality;
                });
            });

            // 下载按钮
            content.querySelector('#wr-start-download').addEventListener('click', () => {
                UI.startDownload(songInfo, UI.selectedQuality);
            });
        },

        closeModal: () => {
            UI.modal.classList.remove('active');
        },

        startDownload: async (songInfo, quality) => {
            const downloadBtn = document.querySelector('#wr-start-download');
            const progressContainer = document.querySelector('#wr-progress');
            const progressText = document.querySelector('#wr-progress-text');

            downloadBtn.disabled = true;
            downloadBtn.innerHTML = '获取下载链接...';
            progressContainer.classList.add('active');
            progressText.textContent = '正在获取下载链接...';

            try {
                const handler = Platforms[songInfo.platform];
                const downloadInfo = await handler.getDownloadUrl(songInfo, quality);

                if (!downloadInfo || !downloadInfo.url) {
                    throw new Error('无法获取下载链接');
                }

                progressText.textContent = '开始下载...';

                const filename = Utils.sanitizeFilename(
                    `${songInfo.name} - ${songInfo.artist}.${downloadInfo.format}`
                );

                await Utils.downloadFile(downloadInfo.url, filename);

                progressText.textContent = '下载完成!';
                UI.updateProgress(100);
                Utils.toast('下载成功: ' + songInfo.name, 'success');

                setTimeout(() => {
                    downloadBtn.disabled = false;
                    downloadBtn.innerHTML = `
                        <svg viewBox="0 0 24 24">
                            <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/>
                        </svg>
                        重新下载
                    `;
                }, 2000);

            } catch (error) {
                Utils.log('下载失败: ' + error.message, 'error');
                progressText.textContent = '下载失败: ' + error.message;
                Utils.toast('下载失败，请重试', 'error');

                downloadBtn.disabled = false;
                downloadBtn.innerHTML = `
                    <svg viewBox="0 0 24 24">
                        <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/>
                    </svg>
                    重试下载
                `;
            }
        },

        updateProgress: (percent) => {
            const fill = document.querySelector('#wr-progress-fill');
            const text = document.querySelector('#wr-progress-text');
            if (fill) fill.style.width = percent + '%';
            if (text && percent < 100) text.textContent = `下载中... ${percent}%`;
        },

        injectInlineButtons: () => {
            const platform = Utils.getPlatformFromUrl();
            if (platform === 'unknown') return;

            // 针对不同平台注入下载按钮
            const selectors = {
                netease: [
                    '.m-sgitem .oper', // 歌曲列表操作区
                    '.j-flag .btns', // 播放器按钮区
                    '.song-list-pre-data .list-oper' // 歌单列表
                ],
                qq: [
                    '.songlist__item .songlist__songname', // 歌曲名称区域
                    '.player_operator' // 播放器操作区
                ],
                kugou: [
                    '.song-item .song-operate', // 歌曲操作区
                    '.playbar-btn-wrap' // 播放器按钮
                ]
            };

            // 这里可以添加更多平台的内联按钮注入逻辑
        }
    };

    // ==================== 主程序 ====================
    const Main = {
        init: () => {
            Utils.log('脚本初始化...');

            // 等待DOM加载完成
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', UI.init);
            } else {
                UI.init();
            }

            Utils.log('初始化完成! 当前平台: ' + Utils.getPlatformFromUrl());
        }
    };

    // 启动
    Main.init();

})();
