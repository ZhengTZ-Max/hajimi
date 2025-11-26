<template>
  <div class="explore-container">
    <div class="view-switch">
      <div
        v-for="item in tabs"
        class="button hoverBtn"
        :class="{ active: item?.value == tabActive }"
        @click="tabActive = item?.value"
        >{{ item?.label }}</div
      >
    </div>

    <div class="showCon">
      <masonry :cols="{ default: 6, 1200: 5, 700: 3, 400: 2 }" :gutter="20">
        <div
          v-for="(item, index) in list"
          :key="index"
          class="card"
          @click="openImage(item)"
        >
          <img :src="item?.src" />
        </div>
      </masonry>
    </div>

    <!-- 查看图片弹层 -->
    <div v-if="showViewer" class="img-viewer-overlay">
      <div class="img-viewer-mask" @click="closeViewer"></div>
      <div class="img-viewer-dialog">
        <img :src="currentImage?.src" class="img-viewer-img" />
        <div class="img-viewer-actions">
          <button type="button" class="btn" @click="downloadImage">
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
import { getBlobUrl, getFolderContents } from '@/utils/common';
console.log(getFolderContents('/material/gif'));
export default {
  name: 'material',
  data() {
    return {
      tabActive: 'photo',
      tabs: [
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
      showViewer: false,
      currentImage: null,
    };
  },
  created() {
    const count = 24;
    this.list = Array.from({ length: count }, (v, i) => ({
      src: getBlobUrl(`material/gif/${i + 1}.gif`),
      id: i,
    }));
  },
  methods: {
    openImage(item) {
      this.currentImage = item;
      this.showViewer = true;
    },
    closeViewer() {
      this.showViewer = false;
      this.currentImage = null;
    },
    async downloadImage() {
      if (!this.currentImage || !this.currentImage.src) return;
      try {
        const res = await fetch(this.currentImage.src, { mode: 'cors' });
        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `hajimi_${this.currentImage.id || ''}.gif`;
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
  padding: 24px;

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
    margin-top: 24px;
    padding: 24px;

    .card {
      text-align: center;
      margin-bottom: 24px;
      cursor: pointer;
      transition: 0.3s;
      background-color: var(--color-secondary-bg);
      img {
        width: 100%;
        display: block;
      }
      &:hover {
        transform: scale(1.05);
        border: 4px solid var(--color-primary);
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
  max-width: 80vw;
  max-height: 70vh;
  border-radius: 12px;
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
