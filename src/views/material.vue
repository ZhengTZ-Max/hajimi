<template>
  <div class="explore-container">
    <div class="view-switch">
      <div
        v-for="item in tabs"
        :key="item?.value"
        class="button hoverBtn"
        :class="{ active: item?.value == tabActive }"
        @click="tabActive = item?.value"
        >{{ item?.label }}</div
      >
    </div>

    <div class="showCon">
      <div v-if="loading" class="loading-placeholder">
        <div id="loading">
          <div id="loading-center">
            <div id="loading-center-absolute">
              <div class="object"></div>
              <div class="object"></div>
              <div class="object"></div>
              <div class="object"></div>
              <div class="object"></div>
              <div class="object"></div>
              <div class="object"></div>
              <div class="object"></div>
              <div class="object"></div>
              <div class="object"></div>
            </div>
          </div>
        </div>
      </div>
      <masonry :cols="{ default: 6, 1200: 5, 700: 3, 400: 2 }" :gutter="20">
        <div
          v-for="item in filterList()"
          :key="item?.pathname"
          class="card"
          @click="openAsset(item)"
        >
          <video
            v-if="item?.assetType === 'video'"
            :src="item?.url"
            class="card-video"
            muted
            loop
            playsinline
          ></video>
          <img
            v-else
            :src="item?.url"
            :class="{ 'is-gif': item?.assetType === 'gif' }"
          />
          <div v-if="item?.assetType !== 'image'" class="media-badge">
            {{ item?.assetType === 'gif' ? 'GIF' : '视频' }}
          </div>
        </div>
      </masonry>
    </div>

    <!-- 查看图片弹层 -->
    <div v-if="showViewer" class="img-viewer-overlay">
      <div class="img-viewer-mask" @click="closeViewer"></div>
      <div class="img-viewer-dialog">
        <video
          v-if="currentAsset?.assetType === 'video'"
          :src="currentAsset?.url"
          controls
          autoplay
          loop
          playsinline
          class="viewer-video"
        ></video>
        <img v-else :src="currentAsset?.url" class="img-viewer-img" />
        <div class="img-viewer-actions">
          <button type="button" class="btn" @click="downloadAsset">
            下载到本地
          </button>
          <button type="button" class="btn btn-close" @click="closeViewer">
            关闭
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getBlobFiles } from '@/api/vercel';
export default {
  name: 'material',
  data() {
    return {
      loading: false,
      tabActive: 'all',
      tabs: [
        {
          label: '全部',
          value: 'all',
        },
        {
          label: '图片',
          value: 'photo',
        },
        {
          label: '视频',
          value: 'video',
        },
        // {
        //   label: '文字',
        //   value: 'txt',
        // },
      ],
      list: [],
      originList: [],
      showViewer: false,
      currentAsset: null,
    };
  },
  created() {
    this.getList();
  },
  methods: {
    filterList() {
      if (this.tabActive == 'all') {
        return this.originList;
      } else if (this.tabActive == 'photo') {
        return this.originList?.filter(e =>
          ['gif', 'image']?.includes(e?.assetType)
        );
      } else if (this.tabActive == 'video') {
        return this.originList?.filter(e => ['video']?.includes(e?.assetType));
      }
    },
    getList() {
      this.loading = true;
      getBlobFiles('material')
        .then(res => {
          let newList = [];
          const blobs = res?.blobs || [];
          newList = blobs.map(item => ({
            ...item,
            assetType: this.detectAssetType(item),
          }));

          this.originList = newList?.filter(e => e?.size > 0);
        })
        .finally(() => {
          this.loading = false;
        });
    },
    detectAssetType(item = {}) {
      const pathname = String(item?.pathname || item?.name || '').toLowerCase();
      const contentType = String(item?.contentType || '').toLowerCase();
      if (
        contentType.startsWith('video/') ||
        /\.(mp4|mov|webm|mkv)$/.test(pathname)
      ) {
        return 'video';
      }
      if (contentType === 'image/gif' || pathname.endsWith('.gif')) {
        return 'gif';
      }
      return 'image';
    },
    openAsset(item) {
      this.currentAsset = item;
      this.showViewer = true;
    },
    closeViewer() {
      this.showViewer = false;
      this.currentAsset = null;
    },
    async downloadAsset() {
      if (!this.currentAsset || !this.currentAsset.url) return;
      try {
        const res = await fetch(this.currentAsset.url, { mode: 'cors' });
        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        const filename = this.currentAsset.pathname
          ? this.currentAsset.pathname.split('/').pop()
          : 'material_asset';
        a.download = filename || 'material_asset';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      } catch (e) {
        console.error('download image error', e);
      }
    },
    openPlayer(item) {
      this.findRow = item;
      const fallback = '/video/1.mp4';
      this.currentVideoUrl = item && item.videoUrl ? item.videoUrl : fallback;
      this.showPlayer = true;
    },
    closePlayer() {
      this.showPlayer = false;
    },
    goSource() {
      // window.open('https://space.bilibili.com/9353567');
    },
  },
};
</script>

<style lang="scss" scoped>
.explore-container {
  box-sizing: border-box;
  width: 100%;
  padding: 36px 0;

  .view-switch {
    display: inline-flex;
    padding: 2px;
    .button {
      user-select: none;
      cursor: pointer;
      padding: 8px 16px;
      margin: 10px 16px 6px 10px;
      display: flex;
      justify-content: center;
      align-items: center;
      font-weight: 600;
      font-size: 16px;
      border-radius: 10px;
      background-color: var(--color-secondary-bg);
      color: var(--color-secondary);
      transition: 0.2s;

      &.active {
        background-color: var(--color-primary-bg);
        color: var(--color-primary);
      }
    }
    .switch-btn {
      border: none;
      background: transparent;
      padding: 4px 12px;
      border-radius: 999px;
      font-size: 13px;
      cursor: pointer;
      color: var(--color-text);
      opacity: 0.7;
    }
    .switch-btn.active {
      background: #fff;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
      opacity: 1;
    }
  }
  .showCon {
    margin-top: 8px;
    padding: 24px;

    .card {
      position: relative;
      overflow: hidden;
      text-align: center;
      margin-bottom: 24px;
      cursor: pointer;
      transition: 0.3s;
      background-color: var(--color-secondary-bg);
      border-radius: 10px;
      video,
      img {
        width: 100%;
        display: block;
        border-radius: 8px;
      }
      &:hover {
        transform: scale(1.1);
        border: 4px solid var(--color-primary);
      }
      .media-badge {
        position: absolute;
        top: 8px;
        right: 8px;
        padding: 2px 8px;
        border-radius: 999px;
        font-size: 12px;
        font-weight: 600;
        background: rgba(0, 0, 0, 0.65);
        color: #fff;
      }
    }
  }
}

.img-viewer-overlay {
  position: fixed;
  width: 100vw;
  height: 100vh;
  left: 0;
  top: 0;
  z-index: 3000;
}

.img-viewer-mask {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
}

.img-viewer-dialog {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  max-width: 90vw;
  max-height: 90vh;
  min-width: 30vw;
  min-height: 300px;

  display: flex;
  flex-direction: column;
  align-items: center;
  background: var(--color-body-bg);
  padding: 16px;
  border-radius: 16px;
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.35);
}

.img-viewer-img {
  flex: 1;
  max-width: 100%;
  max-height: 70vh;
  border-radius: 12px;
}

.viewer-video {
  flex: 1;
  min-width: 65vw;
  max-width: 100%;
  max-height: 70vh;
  border-radius: 12px;
  background: #000;
}

.img-viewer-actions {
  margin-top: 16px;
  display: flex;
  justify-content: center;
  gap: 12px;
}

.btn {
  padding: 6px 16px;
  border-radius: 999px;
  border: none;
  outline: none;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  background: var(--color-primary-bg);
  color: var(--color-primary);
  text-decoration: none;
}

.btn.btn-close {
  background: var(--color-secondary-bg);
  color: var(--color-secondary);
}
</style>
