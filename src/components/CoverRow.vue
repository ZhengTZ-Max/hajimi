<template>
  <div class="cover-row" :style="rowStyles">
    <div
      v-for="(item, i) in items"
      :key="item.i"
      class="item"
      :class="{ artist: type === 'artist' }"
    >
      <Cover
        :id="item.i"
        :image-url="getImageUrl(item)"
        :type="'open'"
        clickCoverToPlay
        :play-button-size="type === 'artist' ? 26 : playButtonSize"
        @onTo="openExternal(item)"
      />
      <div class="text">
        <div v-if="showPlayCount && !useExternalUrl" class="info">
          <span class="play-count"
            ><svg-icon icon-class="play" />{{
              (item.views || item.playCount) | formatPlayCount
            }}
          </span>
        </div>
        <div class="title" :style="{ fontSize: subTextFontSize }">
          <span
            v-if="useExternalUrl && item.url"
            class="external-title"
            @click="openExternal(item)"
          >
            {{ getDisplayTitle(item) }}
          </span>
          <router-link v-else :to="getTitleLink(item)">{{
            getDisplayTitle(item)
          }}</router-link>
        </div>
        <div v-if="useExternalUrl" class="info meta">
          <span v-if="item.author" class="author"
            ><b style="color: #f63c3c">{{ item.author }}</b></span
          >
          <span
            v-if="item.author && (item.createTime || item.creatTime)"
            class="dot"
            >·</span
          >
          <span v-if="item.createTime || item.creatTime" class="time">{{
            item.createTime || item.creatTime
          }}</span>
        </div>
        <div v-if="useExternalUrl" class="info stats">
          <div v-if="item.views || item.playCount" class="stat">
            <svg-icon
              style="width: 12px; height: 12px; margin-right: 6px"
              icon-class="play"
            />
            <span>{{ (item.views || item.playCount) | formatPlayCount }}</span>
          </div>
          <div v-if="item.thumbupCount || item.like" class="stat">
            <svg-icon
              style="width: 16px; height: 16px; margin-right: 6px"
              icon-class="like"
            />
            <span>{{
              (item.thumbupCount || item.like) | formatPlayCount
            }}</span>
          </div>
          <div v-if="item.collectionCount" class="stat">
            <svg-icon
              style="width: 16px; height: 16px; margin-right: 6px"
              icon-class="mark"
            />
            <span>{{ item.collectionCount | formatPlayCount }}</span>
          </div>
          <!-- <div v-if="item.commentCount" class="stat">
            <svg-icon style="width: 12px;height: 12px;margin-right: 6px;" icon-class="mail" />
            <span>评论 {{ item.commentCount | formatPlayCount }}</span>
          </div> -->
          <!-- <div v-if="item.shareCount || item.share" class="stat">
            <svg-icon style="width: 12px;height: 12px;margin-right: 6px;" icon-class="more" />
            <span>分享 {{ (item.shareCount || item.share) | formatPlayCount }}</span>
          </div> -->
        </div>
        <div v-if="useExternalUrl" class="info">
          <span
            v-html="getDisplayDescription(item)"
            style="color: var(--color-description)"
          ></span>
        </div>
      </div>
    </div>
    <!-- 站内播放 iframe 大弹窗 -->
    <div
      v-if="showExternalModal && !isMiniPlayer"
      class="external-modal-overlay"
      @click.self="closeExternal"
    >
      <div class="external-modal">
        <div class="external-modal-header">
          <div class="external-modal-title">{{ externalTitle }}</div>
          <div class="external-modal-actions">
            <button class="external-modal-minimize" @click="minimizeExternal">
              ┄
            </button>
            <button class="external-modal-close" @click="closeExternal"
              >×</button
            >
          </div>
        </div>
        <div class="external-modal-body">
          <iframe
            v-if="externalUrl"
            :src="externalUrl"
            frameborder="0"
            sandbox="allow-same-origin allow-scripts allow-popups"
            allowfullscreen
          ></iframe>
        </div>
      </div>
    </div>

    <!-- 站内播放 iframe 右下角小窗（240x240） -->
    <div v-if="showExternalModal && isMiniPlayer" class="external-mini">
      <div class="external-mini-header">
        <div class="external-mini-title">{{ externalTitle }}</div>
        <div class="external-mini-actions">
          <button class="external-mini-button" @click="restoreFromMini"
            >⤢</button
          >
          <button class="external-mini-button" @click="closeExternal">×</button>
        </div>
      </div>
      <div class="external-mini-body">
        <iframe
          v-if="externalUrl"
          :src="externalUrl"
          frameborder="0"
          sandbox="allow-same-origin allow-scripts allow-popups"
          allowfullscreen
        ></iframe>
      </div>
    </div>

    <!-- 站内 / 站外 播放选择弹窗 -->
    <div
      v-if="showPlayChoiceModal"
      class="play-choice-overlay"
      @click.self="showPlayChoiceModal = false"
    >
      <div class="play-choice-modal">
        <div class="play-choice-title">选择播放方式</div>
        <div class="play-choice-buttons">
          <button class="play-choice-btn inside" @click="playInside"
            >站内播放</button
          >
          <button class="play-choice-btn outside" @click="playOutside"
            >站外播放</button
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Cover from '@/components/Cover.vue';
import ExplicitSymbol from '@/components/ExplicitSymbol.vue';
import { mapState } from 'vuex';

export default {
  name: 'CoverRow',
  components: {
    Cover,
    ExplicitSymbol,
  },
  props: {
    items: { type: Array, required: true },
    type: { type: String, required: true },
    subText: { type: String, default: 'none' },
    subTextFontSize: { type: String, default: '16px' },
    showPlayCount: { type: Boolean, default: false },
    columnNumber: { type: Number, default: 5 },
    gap: { type: String, default: '44px 50px' },
    playButtonSize: { type: Number, default: 22 },
    useExternalUrl: { type: Boolean, default: false },
  },
  data() {
    return {
      showExternalModal: false,
      externalUrl: '',
      externalTitle: '',
      showPlayChoiceModal: false,
      pendingItem: null,
      isMiniPlayer: false,
    };
  },
  computed: {
    ...mapState(['settings']),
    rowStyles() {
      return {
        gap: this.gap,
      };
    },
  },
  methods: {
    getDisplayTitle(item) {
      const lang = this.settings && this.settings.lang;
      if (lang === 'en' && item.title_en) return item.title_en;
      return item.title || item.name;
    },
    getDisplayDescription(item) {
      const lang = this.settings && this.settings.lang;
      if (lang === 'en' && item.description_en) return item.description_en;
      return item.description;
    },
    getSubText(item) {
      if (this.subText === 'copywriter') return item.copywriter;
      if (this.subText === 'description') return item.description;
      if (this.subText === 'updateFrequency') return item.updateFrequency;
      if (this.subText === 'creator') return 'by ' + item.creator.nickname;
      if (this.subText === 'releaseYear')
        return new Date(item.publishTime).getFullYear();
      if (this.subText === 'artist') {
        if (item.artist !== undefined)
          return `<a href="/artist/${item.artist.id}">${item.artist.name}</a>`;
        if (item.artists !== undefined)
          return `<a href="/artist/${item.artists[0].id}">${item.artists[0].name}</a>`;
      }
      if (this.subText === 'albumType+releaseYear') {
        let albumType = item.type;
        if (item.type === 'EP/Single') {
          albumType = item.size === 1 ? 'Single' : 'EP';
        } else if (item.type === 'Single') {
          albumType = 'Single';
        } else if (item.type === '专辑') {
          albumType = 'Album';
        }
        return `${albumType} · ${new Date(item.publishTime).getFullYear()}`;
      }
      if (this.subText === 'appleMusic') return '来自热心基米';
    },
    isPrivacy(item) {
      return this.type === 'playlist' && item.privacy === 10;
    },
    isExplicit(item) {
      return this.type === 'album' && (item.mark & 1048576) === 1048576;
    },
    getTitleLink(item) {
      return `/${this.type}/${item.id}`;
    },
    getImageUrl(item) {
      if (item.img1v1Url) {
        let img1v1ID = item.img1v1Url.split('/');
        img1v1ID = img1v1ID[img1v1ID.length - 1];
        if (img1v1ID === '5639395138885805.jpg') {
          // 没有头像的歌手，网易云返回的img1v1Url并不是正方形的 😅😅😅
          return 'https://p2.music.126.net/VnZiScyynLG7atLIZ2YPkw==/18686200114669622.jpg?param=512y512';
        }
      }
      let img =
        item.img1v1Url || item.picUrl || item.thumbnail || item.coverImgUrl;
      return img;
    },
    openExternal(item) {
      if (!this.useExternalUrl || !item.url) return;

      const enableChoice =
        this.settings && this.settings.enableVideoPlayChoice !== false;

      this.pendingItem = item;

      // 移动端：直接站外播放
      if (this.isMobile()) {
        this.playOutside(item);
        return;
      }

      // 桌面端：按设置决定是否弹出选择弹窗
      if (enableChoice) {
        this.showPlayChoiceModal = true;
      } else {
        this.playInside();
      }
    },
    playInside() {
      const item = this.pendingItem;
      if (!item || !item.url) return;
      this.externalUrl = item.url;
      this.externalTitle = this.getDisplayTitle(item);
      this.showPlayChoiceModal = false;
      this.showExternalModal = true;
      this.isMiniPlayer = false;
    },
    playOutside(item) {
      const target = item || this.pendingItem;
      if (!target || !target.url) return;
      window.open(target.url, '_blank');
      this.showPlayChoiceModal = false;
    },
    minimizeExternal() {
      if (!this.showExternalModal) return;
      this.isMiniPlayer = true;
    },
    restoreFromMini() {
      if (!this.showExternalModal) return;
      this.isMiniPlayer = false;
    },
    closeExternal() {
      this.showExternalModal = false;
      this.externalUrl = '';
      this.externalTitle = '';
      this.isMiniPlayer = false;
      this.pendingItem = null;
    },
    isMobile() {
      // 简单的移动端判断：优先使用屏幕宽度，其次使用 UA
      if (typeof window !== 'undefined') {
        if (window.innerWidth && window.innerWidth <= 768) return true;
      }
      if (typeof navigator !== 'undefined') {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
          navigator.userAgent
        );
      }
      return false;
    },
  },
};
</script>

<style lang="scss" scoped>
.cover-row {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 44px 50px;
}

.item {
  color: var(--color-text);
  .text {
    margin-top: 8px;
    .title {
      font-size: 16px;
      font-weight: 600;
      line-height: 20px;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
      overflow: hidden;
      word-break: break-all;
      .external-title {
        cursor: pointer;
        &:hover {
          text-decoration-line: underline;
        }
      }
    }
    .info {
      margin-top: 6px;
      font-size: 13px;
      opacity: 0.68;
      line-height: 18px;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
      overflow: hidden;
      word-break: break-word;
    }
    .info.meta {
      display: flex;
      align-items: center;
      opacity: 0.8;
      .author,
      .time {
        white-space: nowrap;
      }
      .dot {
        margin: 0 4px;
      }
    }
    .info.stats {
      display: flex;
      flex-wrap: wrap;
      gap: 4px 12px;
      .stat {
        white-space: nowrap;
        display: flex;
        align-items: center;
      }
    }
  }
}

.external-modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
}

.external-modal {
  background: var(--color-body-bg);
  border-radius: 12px;
  width: 90vw;
  max-width: 960px;
  height: 70vh;
  max-height: 720px;
  display: flex;
  flex-direction: column;
  box-shadow: 0 18px 40px rgba(0, 0, 0, 0.35);
}

.external-modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 16px;
  border-bottom: 1px solid rgba(128, 128, 128, 0.3);
}

.external-modal-title {
  font-size: 14px;
  font-weight: 600;
  color: var(--color-text);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.external-modal-actions {
  display: flex;
  align-items: center;
  gap: 6px;
}

.external-modal-minimize {
  background: transparent;
  border: none;
  font-size: 18px;
  line-height: 1;
  cursor: pointer;
  color: var(--color-text);
}

.external-modal-close {
  background: transparent;
  border: none;
  font-size: 20px;
  line-height: 1;
  cursor: pointer;
  color: var(--color-text);
}

.external-modal-body {
  flex: 1;
  overflow: hidden;
}

.external-modal-body iframe {
  width: 100%;
  height: 100%;
}

.external-mini {
  position: fixed;
  right: 16px;
  bottom: 16px;
  width: 240px;
  height: 240px;
  background: var(--color-body-bg);
  border-radius: 12px;
  box-shadow: 0 12px 28px rgba(0, 0, 0, 0.28);
  display: flex;
  flex-direction: column;
  z-index: 1000;
}

.external-mini-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 6px 10px;
  border-bottom: 1px solid rgba(128, 128, 128, 0.3);
}

.external-mini-title {
  font-size: 12px;
  font-weight: 600;
  color: var(--color-text);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.external-mini-actions {
  display: flex;
  align-items: center;
  gap: 4px;
}

.external-mini-button {
  background: transparent;
  border: none;
  font-size: 14px;
  line-height: 1;
  cursor: pointer;
  color: var(--color-text);
}

.external-mini-body {
  flex: 1;
  overflow: hidden;
}

.external-mini-body iframe {
  width: 100%;
  height: 100%;
}

.play-choice-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.35);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.play-choice-modal {
  background: var(--color-body-bg);
  border-radius: 12px;
  padding: 20px 24px 18px;
  min-width: 260px;
  box-shadow: 0 18px 40px rgba(0, 0, 0, 0.35);
}

.play-choice-title {
  font-size: 14px;
  font-weight: 600;
  color: var(--color-text);
  margin-bottom: 14px;
}

.play-choice-buttons {
  display: flex;
  gap: 12px;
}

.play-choice-btn {
  flex: 1;
  padding: 8px 0;
  border-radius: 999px;
  border: none;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
}

.play-choice-btn.inside {
  background: var(--color-primary);
  color: #fff;
}

.play-choice-btn.outside {
  background: var(--color-secondary-bg);
  color: var(--color-text);
}

@media (max-width: 768px) {
  .external-modal {
    width: 100vw;
    height: 80vh;
    border-radius: 0;
  }
}

.item.artist {
  display: flex;
  flex-direction: column;
  text-align: center;
  .cover {
    display: flex;
  }
  .title {
    margin-top: 4px;
  }
}

@media (max-width: 1024px) {
  .cover-row {
    grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  }
}

@media (max-width: 768px) {
  .cover-row {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: 32px 18px;
  }
  .item .text .title {
    font-size: 14px;
  }
}

.explicit-symbol {
  opacity: 0.28;
  color: var(--color-text);
  float: right;
  .svg-icon {
    margin-bottom: -3px;
  }
}

.lock-icon {
  opacity: 0.28;
  color: var(--color-text);
  margin-right: 4px;
  // float: right;
  .svg-icon {
    height: 12px;
    width: 12px;
  }
}

.play-count {
  font-weight: 600;
  opacity: 0.58;
  color: var(--color-text);
  font-size: 12px;
  .svg-icon {
    margin-right: 3px;
    height: 8px;
    width: 8px;
  }
}
</style>
