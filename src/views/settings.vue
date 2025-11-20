<template>
  <div class="settings-page" @click="clickOutside">
    <div class="container">
      <div class="item">
        <div class="left">
          <div class="title"> {{ $t('settings.language') }} </div>
        </div>
        <div class="right">
          <select v-model="lang">
            <option value="en">🇬🇧 English</option>
            <option value="zh-CN">🇨🇳 简体中文</option>
          </select>
        </div>
      </div>
      <div class="item">
        <div class="left">
          <div class="title"> {{ $t('settings.appearance.text') }} </div>
        </div>
        <div class="right">
          <select v-model="appearance">
            <option value="auto">{{ $t('settings.appearance.auto') }}</option>
            <option value="light"
              >🌞 {{ $t('settings.appearance.light') }}</option
            >
            <option value="dark"
              >🌚 {{ $t('settings.appearance.dark') }}</option
            >
          </select>
        </div>
      </div>

      <div class="footer">
        <p class="author"
          >MADE BY
          <a href="https://t.me/hajimi_bnb" target="_blank"
            >哈基米官方频道</a
          ></p
        >
        <p class="version">v{{ version }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import { isLooseLoggedIn, doLogout } from '@/utils/auth';
import { auth as lastfmAuth } from '@/api/lastfm';
import { changeAppearance, bytesToSize } from '@/utils/common';
import { countDBSize, clearDB } from '@/utils/db';
import pkg from '../../package.json';

// 纯 Web 版本中不再使用 Electron，这里提供一个空的 ipcRenderer 占位，避免调用时报错
const electron = null;
const ipcRenderer = {
  send() {},
  invoke() {
    return Promise.resolve();
  },
  on() {},
};

const validShortcutCodes = ['=', '-', '~', '[', ']', ';', "'", ',', '.', '/'];

export default {
  name: 'Settings',
  data() {
    return {
      tracksCache: {
        size: '0KB',
        length: 0,
      },
      allOutputDevices: [
        {
          deviceId: 'default',
          label: 'settings.permissionRequired',
        },
      ],
      shortcutInput: {
        id: '',
        type: '',
        recording: false,
      },
      recordedShortcut: [],
    };
  },
  computed: {
    ...mapState(['player', 'settings', 'data', 'lastfm']),
    isElectron() {
      return false;
    },
    isMac() {
      return /macintosh|mac os x/i.test(navigator.userAgent);
    },
    isLinux() {
      return process.platform === 'linux';
    },
    version() {
      return pkg.version;
    },
    showUserInfo() {
      return isLooseLoggedIn() && this.data.user.nickname;
    },
    recordedShortcutComputed() {
      let shortcut = [];
      this.recordedShortcut.map(e => {
        if (e.keyCode >= 65 && e.keyCode <= 90) {
          // A-Z
          shortcut.push(e.code.replace('Key', ''));
        } else if (e.key === 'Meta') {
          // ⌘ Command on macOS
          shortcut.push('Command');
        } else if (['Alt', 'Control', 'Shift'].includes(e.key)) {
          shortcut.push(e.key);
        } else if (e.keyCode >= 48 && e.keyCode <= 57) {
          // 0-9
          shortcut.push(e.code.replace('Digit', ''));
        } else if (e.keyCode >= 112 && e.keyCode <= 123) {
          // F1-F12
          shortcut.push(e.code);
        } else if (
          ['ArrowRight', 'ArrowLeft', 'ArrowUp', 'ArrowDown'].includes(e.key)
        ) {
          // Arrows
          shortcut.push(e.code.replace('Arrow', ''));
        } else if (validShortcutCodes.includes(e.key)) {
          shortcut.push(e.key);
        }
      });
      const sortTable = {
        Control: 1,
        Shift: 2,
        Alt: 3,
        Command: 4,
      };
      shortcut = shortcut.sort((a, b) => {
        if (!sortTable[a] || !sortTable[b]) return 0;
        if (sortTable[a] - sortTable[b] <= -1) {
          return -1;
        } else if (sortTable[a] - sortTable[b] >= 1) {
          return 1;
        } else {
          return 0;
        }
      });
      shortcut = shortcut.join('+');
      return shortcut;
    },

    lang: {
      get() {
        return this.settings.lang;
      },
      set(lang) {
        this.$i18n.locale = lang;
        this.$store.commit('changeLang', lang);
      },
    },
    musicLanguage: {
      get() {
        return this.settings.musicLanguage ?? 'all';
      },
      set(value) {
        this.$store.commit('updateSettings', {
          key: 'musicLanguage',
          value,
        });
      },
    },
    appearance: {
      get() {
        if (this.settings.appearance === undefined) return 'auto';
        return this.settings.appearance;
      },
      set(value) {
        this.$store.commit('updateSettings', {
          key: 'appearance',
          value,
        });
        changeAppearance(value);
      },
    },
    trayIconTheme: {
      get() {
        if (this.settings.trayIconTheme === undefined) return 'auto';
        return this.settings.trayIconTheme;
      },
      set(value) {
        this.$store.commit('updateSettings', {
          key: 'trayIconTheme',
          value,
        });
        if (this.isElectron) {
          ipcRenderer.send('updateTrayIcon', value);
        }
      },
    },
    musicQuality: {
      get() {
        return this.settings.musicQuality ?? 320000;
      },
      set(value) {
        if (value === this.settings.musicQuality) return;
        this.$store.commit('changeMusicQuality', value);
        this.clearCache();
      },
    },
    lyricFontSize: {
      get() {
        if (this.settings.lyricFontSize === undefined) return 28;
        return this.settings.lyricFontSize;
      },
      set(value) {
        this.$store.commit('changeLyricFontSize', value);
      },
    },
    outputDevice: {
      get() {
        const isValidDevice = this.allOutputDevices.find(
          device => device.deviceId === this.settings.outputDevice
        );
        if (
          this.settings.outputDevice === undefined ||
          isValidDevice === undefined
        )
          return 'default'; // Default deviceId
        return this.settings.outputDevice;
      },
      set(deviceId) {
        if (deviceId === this.settings.outputDevice || deviceId === undefined)
          return;
        this.$store.commit('changeOutputDevice', deviceId);
        this.player.setOutputDevice();
      },
    },
    enableUnblockNeteaseMusic: {
      get() {
        const value = this.settings.enableUnblockNeteaseMusic;
        return value !== undefined ? value : true;
      },
      set(value) {
        this.$store.commit('updateSettings', {
          key: 'enableUnblockNeteaseMusic',
          value,
        });
      },
    },
    showPlaylistsByAppleMusic: {
      get() {
        if (this.settings.showPlaylistsByAppleMusic === undefined) return true;
        return this.settings.showPlaylistsByAppleMusic;
      },
      set(value) {
        this.$store.commit('updateSettings', {
          key: 'showPlaylistsByAppleMusic',
          value,
        });
      },
    },
    nyancatStyle: {
      get() {
        if (this.settings.nyancatStyle === undefined) return false;
        return this.settings.nyancatStyle;
      },
      set(value) {
        this.$store.commit('updateSettings', {
          key: 'nyancatStyle',
          value,
        });
      },
    },
    automaticallyCacheSongs: {
      get() {
        if (this.settings.automaticallyCacheSongs === undefined) return false;
        return this.settings.automaticallyCacheSongs;
      },
      set(value) {
        this.$store.commit('updateSettings', {
          key: 'automaticallyCacheSongs',
          value,
        });
        if (value === false) {
          this.clearCache();
        }
      },
    },
    showLyricsTranslation: {
      get() {
        return this.settings.showLyricsTranslation;
      },
      set(value) {
        this.$store.commit('updateSettings', {
          key: 'showLyricsTranslation',
          value,
        });
      },
    },
    lyricsBackground: {
      get() {
        return this.settings.lyricsBackground || false;
      },
      set(value) {
        this.$store.commit('updateSettings', {
          key: 'lyricsBackground',
          value,
        });
      },
    },
    showLyricsTime: {
      get() {
        return this.settings.showLyricsTime;
      },
      set(value) {
        this.$store.commit('updateSettings', {
          key: 'showLyricsTime',
          value,
        });
      },
    },
    enableOsdlyricsSupport: {
      get() {
        return this.settings.enableOsdlyricsSupport;
      },
      set(value) {
        this.$store.commit('updateSettings', {
          key: 'enableOsdlyricsSupport',
          value,
        });
      },
    },
    closeAppOption: {
      get() {
        return this.settings.closeAppOption;
      },
      set(value) {
        this.$store.commit('updateSettings', {
          key: 'closeAppOption',
          value,
        });
      },
    },
    enableDiscordRichPresence: {
      get() {
        return this.settings.enableDiscordRichPresence;
      },
      set(value) {
        this.$store.commit('updateSettings', {
          key: 'enableDiscordRichPresence',
          value,
        });
      },
    },
    subTitleDefault: {
      get() {
        return this.settings.subTitleDefault;
      },
      set(value) {
        this.$store.commit('updateSettings', {
          key: 'subTitleDefault',
          value,
        });
      },
    },
    enableReversedMode: {
      get() {
        if (this.settings.enableReversedMode === undefined) return false;
        return this.settings.enableReversedMode;
      },
      set(value) {
        this.$store.commit('updateSettings', {
          key: 'enableReversedMode',
          value,
        });
        if (value === false) {
          this.$store.state.player.reversed = false;
        }
      },
    },
    enableGlobalShortcut: {
      get() {
        return this.settings.enableGlobalShortcut;
      },
      set(value) {
        this.$store.commit('updateSettings', {
          key: 'enableGlobalShortcut',
          value,
        });
      },
    },
    showLibraryDefault: {
      get() {
        return this.settings.showLibraryDefault || false;
      },
      set(value) {
        this.$store.commit('updateSettings', {
          key: 'showLibraryDefault',
          value,
        });
      },
    },
    cacheLimit: {
      get() {
        return this.settings.cacheLimit || false;
      },
      set(value) {
        this.$store.commit('updateSettings', {
          key: 'cacheLimit',
          value,
        });
      },
    },
    proxyProtocol: {
      get() {
        return this.settings.proxyConfig?.protocol || 'noProxy';
      },
      set(value) {
        let config = this.settings.proxyConfig || {};
        config.protocol = value;
        if (value === 'noProxy') {
          ipcRenderer.send('removeProxy');
          this.showToast('已关闭代理');
        }
        this.$store.commit('updateSettings', {
          key: 'proxyConfig',
          value: config,
        });
      },
    },
    proxyServer: {
      get() {
        return this.settings.proxyConfig?.server || '';
      },
      set(value) {
        let config = this.settings.proxyConfig || {};
        config.server = value;
        this.$store.commit('updateSettings', {
          key: 'proxyConfig',
          value: config,
        });
      },
    },
    enableRealIP: {
      get() {
        return this.settings.enableRealIP || false;
      },
      set(value) {
        this.$store.commit('updateSettings', {
          key: 'enableRealIP',
          value: value,
        });
      },
    },
    realIP: {
      get() {
        return this.settings.realIP || '';
      },
      set(value) {
        this.$store.commit('updateSettings', {
          key: 'realIP',
          value: value,
        });
      },
    },
    proxyPort: {
      get() {
        return this.settings.proxyConfig?.port || '';
      },
      set(value) {
        let config = this.settings.proxyConfig || {};
        config.port = value;
        this.$store.commit('updateSettings', {
          key: 'proxyConfig',
          value: config,
        });
      },
    },
    unmSource: {
      /**
       * @returns {string}
       */
      get() {
        return this.settings.unmSource || '';
      },
      /** @param {string?} value */
      set(value) {
        this.$store.commit('updateSettings', {
          key: 'unmSource',
          value: value.length && value,
        });
      },
    },
    unmSearchMode: {
      get() {
        return this.settings.unmSearchMode || 'fast-first';
      },
      set(value) {
        this.$store.commit('updateSettings', {
          key: 'unmSearchMode',
          value: value,
        });
      },
    },
    unmEnableFlac: {
      get() {
        return this.settings.unmEnableFlac || false;
      },
      set(value) {
        this.$store.commit('updateSettings', {
          key: 'unmEnableFlac',
          value: value || false,
        });
      },
    },
    unmProxyUri: {
      get() {
        return this.settings.unmProxyUri || '';
      },
      set(value) {
        this.$store.commit('updateSettings', {
          key: 'unmProxyUri',
          value: value.length && value,
        });
      },
    },
    unmJooxCookie: {
      get() {
        return this.settings.unmJooxCookie || '';
      },
      set(value) {
        this.$store.commit('updateSettings', {
          key: 'unmJooxCookie',
          value: value.length && value,
        });
      },
    },
    unmQQCookie: {
      get() {
        return this.settings.unmQQCookie || '';
      },
      set(value) {
        this.$store.commit('updateSettings', {
          key: 'unmQQCookie',
          value: value.length && value,
        });
      },
    },
    unmYtDlExe: {
      get() {
        return this.settings.unmYtDlExe || '';
      },
      set(value) {
        this.$store.commit('updateSettings', {
          key: 'unmYtDlExe',
          value: value.length && value,
        });
      },
    },
    enableCustomTitlebar: {
      get() {
        return this.settings.linuxEnableCustomTitlebar;
      },
      set(value) {
        this.$store.commit('updateSettings', {
          key: 'linuxEnableCustomTitlebar',
          value,
        });
      },
    },
    isLastfmConnected() {
      return this.lastfm.key !== undefined;
    },
  },
  created() {
    this.countDBSize('tracks');
    if (process.env.IS_ELECTRON) this.getAllOutputDevices();
  },
  activated() {
    this.countDBSize('tracks');
    if (process.env.IS_ELECTRON) this.getAllOutputDevices();
  },
  methods: {
    ...mapActions(['showToast']),
    getAllOutputDevices() {
      navigator.mediaDevices.enumerateDevices().then(devices => {
        this.allOutputDevices = devices.filter(device => {
          return device.kind == 'audiooutput';
        });
        if (
          this.allOutputDevices.length > 0 &&
          this.allOutputDevices[0].label !== ''
        ) {
          this.withoutAudioPriviledge = false;
        } else {
          this.allOutputDevices = [
            {
              deviceId: 'default',
              label: 'settings.permissionRequired',
            },
          ];
        }
      });
    },
    logout() {
      doLogout();
      this.$router.push({ name: 'home' });
    },
    countDBSize() {
      countDBSize().then(data => {
        if (data === undefined) {
          this.tracksCache = {
            size: '0KB',
            length: 0,
          };
          return;
        }
        this.tracksCache.size = bytesToSize(data.bytes);
        this.tracksCache.length = data.length;
      });
    },
    clearCache() {
      clearDB().then(() => {
        this.countDBSize();
      });
    },
    lastfmConnect() {
      lastfmAuth();
      let lastfmChecker = setInterval(() => {
        const session = localStorage.getItem('lastfm');
        if (session) {
          this.$store.commit('updateLastfm', JSON.parse(session));
          clearInterval(lastfmChecker);
        }
      }, 1000);
    },
    lastfmDisconnect() {
      localStorage.removeItem('lastfm');
      this.$store.commit('updateLastfm', {});
    },
    sendProxyConfig() {
      if (this.proxyProtocol === 'noProxy') return;
      const config = this.settings.proxyConfig;
      if (
        config.server === '' ||
        !config.port ||
        config.protocol === 'noProxy'
      ) {
        ipcRenderer.send('removeProxy');
      } else {
        ipcRenderer.send('setProxy', config);
      }
      this.showToast('已更新代理设置');
    },
    clickOutside() {
      this.exitRecordShortcut();
    },
    formatShortcut(shortcut) {
      shortcut = shortcut
        .replaceAll('+', ' + ')
        .replace('Up', '↑')
        .replace('Down', '↓')
        .replace('Right', '→')
        .replace('Left', '←');
      if (this.settings.lang === 'zh-CN') {
        shortcut = shortcut.replace('Space', '空格');
      } else if (this.settings.lang === 'zh-TW') {
        shortcut = shortcut.replace('Space', '空白鍵');
      }
      if (process.platform === 'darwin') {
        return shortcut
          .replace('CommandOrControl', '⌘')
          .replace('Command', '⌘')
          .replace('Alt', '⌥')
          .replace('Control', '⌃')
          .replace('Shift', '⇧');
      }
      return shortcut.replace('CommandOrControl', 'Ctrl');
    },
    readyToRecordShortcut(id, type) {
      if (type === 'globalShortcut' && this.enableGlobalShortcut === false) {
        return;
      }
      this.shortcutInput = { id, type, recording: true };
      this.recordedShortcut = [];
      ipcRenderer.send('switchGlobalShortcutStatusTemporary', 'disable');
    },
    handleShortcutKeydown(e) {
      if (this.shortcutInput.recording === false) return;
      e.preventDefault();
      if (this.recordedShortcut.find(s => s.keyCode === e.keyCode)) return;
      this.recordedShortcut.push(e);
      if (
        (e.keyCode >= 65 && e.keyCode <= 90) || // A-Z
        (e.keyCode >= 48 && e.keyCode <= 57) || // 0-9
        (e.keyCode >= 112 && e.keyCode <= 123) || // F1-F12
        ['ArrowRight', 'ArrowLeft', 'ArrowUp', 'ArrowDown'].includes(e.key) || // Arrows
        validShortcutCodes.includes(e.key)
      ) {
        this.saveShortcut();
      }
    },
    handleShortcutKeyup(e) {
      if (this.recordedShortcut.find(s => s.keyCode === e.keyCode)) {
        this.recordedShortcut = this.recordedShortcut.filter(
          s => s.keyCode !== e.keyCode
        );
      }
    },
    saveShortcut() {
      const { id, type } = this.shortcutInput;
      const payload = {
        id,
        type,
        shortcut: this.recordedShortcutComputed,
      };
      this.$store.commit('updateShortcut', payload);
      ipcRenderer.send('updateShortcut', payload);
      this.showToast('快捷键已保存');
      this.recordedShortcut = [];
    },
    exitRecordShortcut() {
      if (this.shortcutInput.recording === false) return;
      this.shortcutInput = { id: '', type: '', recording: false };
      this.recordedShortcut = [];
      ipcRenderer.send('switchGlobalShortcutStatusTemporary', 'enable');
    },
    restoreDefaultShortcuts() {
      this.$store.commit('restoreDefaultShortcuts');
      ipcRenderer.send('restoreDefaultShortcuts');
    },
  },
};
</script>

<style lang="scss" scoped>
.settings-page {
  display: flex;
  justify-content: center;
  margin-top: 32px;
}
.container {
  margin-top: 24px;
  width: 720px;
}
h2 {
  margin-top: 48px;
  font-size: 36px;
  color: var(--color-text);
}

h3 {
  margin-top: 48px;
  padding-bottom: 12px;
  font-size: 26px;
  color: var(--color-text);
  border-bottom: 1px solid rgba(128, 128, 128, 0.18);
}

.user {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: var(--color-secondary-bg);
  color: var(--color-text);
  padding: 16px 20px;
  border-radius: 16px;
  margin-bottom: 48px;
  img.avatar {
    border-radius: 50%;
    height: 64px;
    width: 64px;
  }
  img.cvip {
    height: 13px;
    margin-right: 4px;
  }
  .left {
    display: flex;
    align-items: center;
    .info {
      margin-left: 24px;
    }
    .nickname {
      font-size: 20px;
      font-weight: 600;
      margin-bottom: 2px;
    }
    .extra-info {
      font-size: 13px;
      .text {
        opacity: 0.68;
      }
      .vip {
        display: flex;
        align-items: center;
      }
    }
  }
  .right {
    .svg-icon {
      height: 18px;
      width: 18px;
      margin-right: 4px;
    }
    button {
      display: flex;
      align-items: center;
      font-size: 18px;
      font-weight: 600;
      text-decoration: none;
      border-radius: 10px;
      padding: 8px 12px;
      opacity: 0.68;
      color: var(--color-text);
      transition: 0.2s;
      margin: {
        right: 12px;
        left: 12px;
      }
      &:hover {
        opacity: 1;
        background: #eaeffd;
        color: #335eea;
      }
      &:active {
        opacity: 1;
        transform: scale(0.92);
        transition: 0.2s;
      }
    }
  }
}

.item {
  margin: 24px 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: var(--color-text);

  .title {
    font-size: 16px;
    font-weight: 500;
    opacity: 0.78;
  }

  .description {
    font-size: 14px;
    margin-top: 0.5em;
    opacity: 0.7;
  }
}

select {
  min-width: 192px;
  max-width: 600px;
  font-weight: 600;
  border: none;
  padding: 8px 12px 8px 12px;
  border-radius: 8px;
  color: var(--color-text);
  background: var(--color-secondary-bg);
  appearance: none;
  &:focus {
    outline: none;
    color: var(--color-primary);
    background: var(--color-primary-bg);
  }
}

button {
  color: var(--color-text);
  background: var(--color-secondary-bg);
  padding: 8px 12px 8px 12px;
  font-weight: 600;
  border-radius: 8px;
  transition: 0.2s;
  &:hover {
    transform: scale(1.06);
  }
  &:active {
    transform: scale(0.94);
  }
}

input.text-input.margin-right-0 {
  margin-right: 0;
}
input.text-input {
  background: var(--color-secondary-bg);
  border: none;
  margin-right: 22px;
  padding: 8px 12px 8px 12px;
  border-radius: 8px;
  color: var(--color-text);
  font-weight: 600;
  font-size: 16px;
}
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
}
input[type='number'] {
  -moz-appearance: textfield;
}

#proxy-form,
#real-ip {
  display: flex;
  align-items: center;
}
#proxy-form.disabled,
#real-ip.disabled {
  opacity: 0.47;
  button:hover {
    transform: unset;
  }
}

#shortcut-table {
  font-size: 14px;
  /* border: 1px solid black; */
  user-select: none;
  color: var(--color-text);
  .row {
    display: flex;
  }
  .row.row-head {
    opacity: 0.58;
    font-size: 13px;
    font-weight: 500;
  }
  .col {
    min-width: 192px;
    padding: 8px;
    display: flex;
    align-items: center;
    /* border: 1px solid red; */
    &:first-of-type {
      padding-left: 0;
      min-width: 128px;
    }
  }
  .keyboard-input {
    font-weight: 600;
    background-color: var(--color-secondary-bg);
    padding: 8px 12px 8px 12px;
    border-radius: 0.5rem;
    min-width: 146px;
    min-height: 34px;
    box-sizing: border-box;
    &.active {
      color: var(--color-primary);
      background-color: var(--color-primary-bg);
    }
  }
  .restore-default-shortcut {
    margin-top: 12px;
  }
  &.global-disabled {
    .row .col:last-child {
      opacity: 0.48;
    }
    .row.row-head .col:last-child {
      opacity: 1;
    }
  }
  &:focus {
    outline: none;
  }
}

.footer {
  text-align: center;
  margin-top: 6rem;
  color: var(--color-text);
  font-weight: 600;
  .author {
    font-size: 0.9rem;
  }
  .version {
    font-size: 0.88rem;
    opacity: 0.58;
    margin-top: -10px;
  }
}

.beforeAnimation {
  -webkit-transition: 0.2s cubic-bezier(0.24, 0, 0.5, 1);
  transition: 0.2s cubic-bezier(0.24, 0, 0.5, 1);
}
.afterAnimation {
  box-shadow: 0 0 0 1px hsla(0, 0%, 0%, 0.1), 0 4px 0px 0 hsla(0, 0%, 0%, 0.04),
    0 4px 9px hsla(0, 0%, 0%, 0.13), 0 3px 3px hsla(0, 0%, 0%, 0.05);
  -webkit-transition: 0.35s cubic-bezier(0.54, 1.6, 0.5, 1);
  transition: 0.35s cubic-bezier(0.54, 1.6, 0.5, 1);
}
.toggle {
  margin: auto;
}
.toggle input {
  opacity: 0;
  position: absolute;
}
.toggle input + label {
  position: relative;
  display: inline-block;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  -webkit-transition: 0.4s ease;
  transition: 0.4s ease;
  height: 32px;
  width: 52px;
  background: var(--color-secondary-bg);
  border-radius: 8px;
}
.toggle input + label:before {
  content: '';
  position: absolute;
  display: block;
  -webkit-transition: 0.2s cubic-bezier(0.24, 0, 0.5, 1);
  transition: 0.2s cubic-bezier(0.24, 0, 0.5, 1);
  height: 32px;
  width: 52px;
  top: 0;
  left: 0;
  border-radius: 8px;
}
.toggle input + label:after {
  content: '';
  position: absolute;
  display: block;
  box-shadow: 0 0 0 1px hsla(0, 0%, 0%, 0.02), 0 4px 0px 0 hsla(0, 0%, 0%, 0.01),
    0 4px 9px hsla(0, 0%, 0%, 0.08), 0 3px 3px hsla(0, 0%, 0%, 0.03);
  -webkit-transition: 0.35s cubic-bezier(0.54, 1.6, 0.5, 1);
  transition: 0.35s cubic-bezier(0.54, 1.6, 0.5, 1);
  background: #fff;
  height: 20px;
  width: 20px;
  top: 6px;
  left: 6px;
  border-radius: 6px;
}
.toggle input:checked + label:before {
  background: var(--color-primary);
  -webkit-transition: width 0.2s cubic-bezier(0, 0, 0, 0.1);
  transition: width 0.2s cubic-bezier(0, 0, 0, 0.1);
}
.toggle input:checked + label:after {
  left: 26px;
}
</style>
