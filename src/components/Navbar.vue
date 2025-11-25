<template>
  <div>
    <nav :class="{ 'has-custom-titlebar': hasCustomTitlebar }">
      <div class="navigation-buttons">
        <!-- <button-icon @click.native="go('back')"
          ><svg-icon icon-class="arrow-left"
        /></button-icon>
        <button-icon @click.native="go('forward')"
          ><svg-icon icon-class="arrow-right"
        /></button-icon> -->
      </div>
      <div class="navigation-links">
        <router-link to="/" :class="{ active: $route.name === 'home' }"
          >哈基米视频</router-link
        >
        <!-- <router-link
          to="/explore"
          :class="{ active: $route.name === 'explore' }"
          >{{ $t('nav.explore') }}</router-link
        > -->
        <router-link
          to="/library"
          :class="{ active: $route.name === 'library' }"
          >哈基米音乐</router-link
        >

        <router-link
          to="/explore"
          :class="{ active: $route.name === 'explore' }"
          >哈基米文化介绍</router-link
        >
      </div>
      <div class="right-part">
        <div class="search-box">
          <div class="container" :class="{ active: inputFocus }">
            <svg-icon icon-class="search" />
            <div class="input">
              <input
                ref="searchInput"
                v-model="keywords"
                type="search"
                placeholder="搜索"
                @keydown.enter="doSearch"
                @focus="inputFocus = true"
                @blur="inputFocus = false"
              />
            </div>
          </div>
        </div>
        <div class="hoverBtn" @click="toOpen('https://x.com/hajimi_CTO_BNB')">
          <svg-icon
            style="
              color: var(--color-text);
              width: 24px;
              height: 24px;
              margin-left: 24px;
              cursor: pointer;
              transition: 0.3s;
            "
            icon-class="tuite"
          />
        </div>
        <div class="hoverBtn" @click="toOpen('https://t.me/BNB_Hajimiiii')">
          <svg-icon
            style="
              color: var(--color-text);
              width: 24px;
              height: 24px;
              margin-left: 24px;
              cursor: pointer;
              transition: 0.3s;
            "
            icon-class="telegram"
          />
        </div>

        <div
          class="hoverBtn"
          @click="
            toOpen(
              'https://gmgn.ai/bsc/token/0x82ec31d69b3c289e541b50e30681fd1acad24444'
            )
          "
        >
          <svg-icon
            style="
              color: var(--color-text);
              width: 24px;
              height: 24px;
              margin-left: 24px;
              cursor: pointer;
              transition: 0.3s;
            "
            icon-class="logo_small2"
          />
        </div>

        <div
          class="hoverBtn"
          @click="
            toOpen(
              'https://pancakeswap.finance/swap?outputCurrency=0x82Ec31D69b3c289E541b50E30681FD1ACAd24444'
            )
          "
        >
          <!-- <span
            style="
              margin-left: 24px;
              color: var(--color-primary);
              font-weight: bold;
              cursor: pointer;
            "
            >Swap</span
          > -->
          <svg-icon
            style="
              color: var(--color-text);
              width: 24px;
              height: 24px;
              margin-left: 24px;
              cursor: pointer;
              transition: 0.3s;
            "
            icon-class="panswap"
          />
        </div>

        <div class="hoverBtn" @click="toggleLang">
          <svg-icon
            style="
              color: var(--color-text);
              width: 24px;
              height: 24px;
              margin-left: 24px;
              cursor: pointer;
              transition: 0.3s;
            "
            :style="{
              transform: currentLang == 'en' ? 'rotate(180deg)' : 'rotate(0)',
            }"
            icon-class="language"
          />
        </div>
        <!-- <div class="hoverBtn" @click="togglePlayChoice">
          <svg-icon
            style="
              color: var(--color-text);
              width: 24px;
              height: 24px;
              margin-left: 24px;
              cursor: pointer;
              transition: 0.3s;
            "
            icon-class="settings"
          />
        </div> -->
      </div>
    </nav>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import { isLooseLoggedIn, doLogout } from '@/utils/auth';

// import icons for win32 title bar
// icons by https://github.com/microsoft/vscode-codicons
import 'vscode-codicons/dist/codicon.css';

import ContextMenu from '@/components/ContextMenu.vue';
import ButtonIcon from '@/components/ButtonIcon.vue';
import translate from 'i18n-jsautotranslate';

export default {
  name: 'Navbar',
  components: {
    ButtonIcon,
    ContextMenu,
  },
  data() {
    return {
      inputFocus: false,
      langs: ['zh-CN', 'en'],
      currentLang: localStorage.getItem('lang'),
      keywords: '',
    };
  },
  computed: {
    ...mapState(['settings', 'data']),
    isLooseLoggedIn() {
      return isLooseLoggedIn();
    },
    avatarUrl() {
      return this.data?.user?.avatarUrl && this.isLooseLoggedIn
        ? `${this.data?.user?.avatarUrl}?param=512y512`
        : 'http://s4.music.126.net/style/web2/img/default/default_avatar.jpg?param=60y60';
    },
    hasCustomTitlebar() {
      return false;
    },
  },
  created() {},
  methods: {
    go(where) {
      if (where === 'back') this.$router.go(-1);
      else this.$router.go(1);
    },
    doSearch() {
      if (!this.keywords) return;
      if (
        this.$route.name === 'search' &&
        this.$route.params.keywords === this.keywords
      ) {
        return;
      }
      this.$router.push({
        name: 'search',
        params: { keywords: this.keywords },
      });
    },

    logout() {
      if (!confirm('确定要退出登录吗？')) return;
      doLogout();
      this.$router.push({ name: 'home' });
    },

    async toggleLang() {
      this.currentLang = this.currentLang == 'zh-CN' ? 'en' : 'zh-CN';
      localStorage.setItem('lang', this.currentLang);
      // this.$i18n.locale = this.currentLang;
      this.$store.commit('changeLang', this.currentLang);

      // 根据当前语言切换 translate.js 的内部语言 ID
      if (this.currentLang !== 'zh-CN') {
        // 简体中文
        translate.changeLanguage('chinese_simplified');
      } else {
        // 英文
        translate.changeLanguage('english');
      }

      // 对当前 DOM 重新执行一次翻译，确保立即生效
      if (typeof translate.execute === 'function') {
        translate.execute();
      }
    },
    togglePlayChoice() {
      const current = this.settings && this.settings.enableVideoPlayChoice;
      this.$store.commit('updateSettings', {
        key: 'enableVideoPlayChoice',
        value: !current,
      });
      localStorage.setItem('settings', JSON.stringify(this.settings));
    },
    toOpen(url) {
      window.open(url);
    },
    toLogin() {
      if (process.env.IS_ELECTRON === true) {
        this.$router.push({ name: 'loginAccount' });
      } else {
        this.$router.push({ name: 'login' });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
nav {
  position: fixed;
  top: 0;
  right: 0;
  left: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 64px;
  padding: {
    right: 10vw;
    left: 10vw;
  }
  backdrop-filter: saturate(180%) blur(20px);

  background-color: var(--color-navbar-bg);
  z-index: 100;
  -webkit-app-region: drag;
}

@media (max-width: 1336px) {
  nav {
    padding: 0 max(5vw, 72px);
  }
}

@media (max-width: 900px) {
  nav {
    padding: 0 20px;
  }
}

@media (max-width: 768px) {
  nav {
    flex-wrap: wrap;
    height: auto;
    padding-top: 10px;
    padding-bottom: 10px;
  }
}

@supports (-moz-appearance: none) {
  nav {
    background-color: var(--color-body-bg);
  }
}

nav.has-custom-titlebar {
  padding-top: 20px;
  -webkit-app-region: no-drag;
}

.navigation-buttons {
  flex: 1;
  display: flex;
  align-items: center;
  .svg-icon {
    height: 24px;
    width: 24px;
  }
  button {
    -webkit-app-region: no-drag;
  }
}
@media (max-width: 970px) {
  .navigation-buttons {
    flex: unset;
  }
}

.navigation-links {
  flex: 1;
  display: flex;
  justify-content: center;
  text-transform: uppercase;
  user-select: none;
  a {
    -webkit-app-region: no-drag;
    font-size: 18px;
    font-weight: 700;
    text-decoration: none;
    border-radius: 6px;
    padding: 6px 10px;
    color: var(--color-text);
    transition: 0.2s;
    text-align: center;
    -webkit-user-drag: none;
    margin: {
      right: 12px;
      left: 12px;
    }
    &:hover {
      background: var(--color-secondary-bg-for-transparent);
    }
    &:active {
      transform: scale(0.92);
      transition: 0.2s;
    }
  }
  a.active {
    color: var(--color-primary);
  }
}

@media (max-width: 768px) {
  .navigation-links {
    flex: 1 1 100%;
    margin: 4px 0 0;
    overflow-x: auto;
    justify-content: flex-start;
    a {
      font-size: 15px;
      margin: {
        right: 6px;
        left: 6px;
      }
      padding: 4px 8px;
    }
  }
}

.search {
  .svg-icon {
    height: 18px;
    width: 18px;
  }
}

.search-box {
  display: flex;
  justify-content: flex-end;
  -webkit-app-region: no-drag;

  .container {
    display: flex;
    align-items: center;
    height: 32px;
    background: var(--color-secondary-bg-for-transparent);
    border-radius: 8px;
    width: 220px;
  }

  .svg-icon {
    height: 15px;
    width: 15px;
    color: var(--color-text);
    opacity: 0.28;
    margin: {
      left: 8px;
      right: 4px;
    }
  }

  input {
    font-size: 16px;
    border: none;
    background: transparent;
    width: 96%;
    font-weight: 600;
    margin-top: -1px;
    color: var(--color-text);
  }

  .active {
    background: var(--color-primary-bg-for-transparent);
    input,
    .svg-icon {
      opacity: 1;
      color: var(--color-primary);
    }
  }
}

[data-theme='dark'] {
  .search-box {
    .container {
      width: 100%;
      max-width: 260px;
    }
    .active {
      input,
      .svg-icon {
        color: var(--color-text);
      }
    }
  }
}

.right-part {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  .avatar {
    user-select: none;
    height: 30px;
    margin-left: 12px;
    vertical-align: -7px;
    border-radius: 50%;
    cursor: pointer;
    -webkit-app-region: no-drag;
    -webkit-user-drag: none;
    &:hover {
      filter: brightness(80%);
    }
  }
  .search-button {
    display: none;
    -webkit-app-region: no-drag;
  }
}

@media (max-width: 768px) {
  .navigation-buttons {
    display: none;
  }
  .right-part {
    flex: 1 1 100%;
    justify-content: flex-start;
    margin-top: 8px;
    .search-box {
      width: 100%;
      .container {
        width: 100%;
        max-width: none;
      }
    }
  }
}
</style>
