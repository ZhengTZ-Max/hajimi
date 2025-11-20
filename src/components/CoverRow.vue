<template>
  <div class="cover-row" :style="rowStyles">
    <div
      v-for="item in items"
      :key="item.id"
      class="item"
      :class="{ artist: type === 'artist' }"
    >
      <Cover
        :id="item.id"
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
              item.playCount | formatPlayCount
            }}
          </span>
        </div>
        <div class="title" :style="{ fontSize: subTextFontSize }">
          <span
            v-if="useExternalUrl && item.url"
            class="external-title"
            @click="openExternal(item)"
          >
            {{ item.name }}
          </span>
          <router-link v-else :to="getTitleLink(item)">{{
            item.name
          }}</router-link>
        </div>
        <div v-if="useExternalUrl" class="info meta">
          <span v-if="item.author" class="author"
            ><b style="color: #f63c3c">{{ item.author }}</b></span
          >
          <span v-if="item.author && item.creatTime" class="dot">·</span>
          <span v-if="item.creatTime" class="time">{{ item.creatTime }}</span>
        </div>
        <div v-if="useExternalUrl" class="info stats">
          <span v-if="item.playCount" class="stat"
            >播放 {{ item.playCount }}</span
          >
          <span v-if="item.like" class="stat">点赞 {{ item.like }}</span>
          <span v-if="item.share" class="stat">分享 {{ item.share }}</span>
        </div>
        <div v-if="useExternalUrl" class="info">
          <span
            v-html="item?.description"
            style="color: var(--color-description)"
          ></span>
        </div>
      </div>
    </div>
    <div
      v-if="showExternalModal"
      class="external-modal-overlay"
      @click.self="closeExternal"
    >
      <div class="external-modal">
        <div class="external-modal-header">
          <div class="external-modal-title">{{ externalTitle }}</div>
          <button class="external-modal-close" @click="closeExternal">×</button>
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
  </div>
</template>

<script>
import Cover from '@/components/Cover.vue';
import ExplicitSymbol from '@/components/ExplicitSymbol.vue';

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
    };
  },
  computed: {
    rowStyles() {
      return {
        gap: this.gap,
      };
    },
  },
  methods: {
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
      let img = item.img1v1Url || item.picUrl || item.coverImgUrl;
      return img;
    },
    openExternal(item) {
      if (!this.useExternalUrl || !item.url) return;
      this.externalUrl = item.url;
      this.externalTitle = item.name || '';
      this.showExternalModal = true;
    },
    closeExternal() {
      this.showExternalModal = false;
      this.externalUrl = '';
      this.externalTitle = '';
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
