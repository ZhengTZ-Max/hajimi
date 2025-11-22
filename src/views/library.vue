<template>
  <div v-show="show" ref="library" class="library">
    <div class="section-one">
      <div class="songs">
        <div class="toolbar">
          <!-- <div class="title">曼波~</div> -->
          <div class="view-switch">
            <div
              class="button hoverBtn"
              :class="{ active: viewMode == 'grid' }"
              @click="viewMode = 'grid'"
              >视图</div
            >
            <div
              class="button hoverBtn"
              :class="{ active: viewMode == 'list' }"
              @click="viewMode = 'list'"
              >列表</div
            >
          </div>
        </div>

        <div v-if="viewMode === 'grid'" class="grid-mode">
          <div class="grid-wrapper" :style="gridStyle">
            <div
              v-for="(track, index) in visibleTracks"
              :key="track.id"
              class="grid-item"
              :class="{ active: index === activeIndex }"
              @click="playMockTrack(index)"
            >
              <div class="cover">
                <div
                  v-if="!imageLoaded[index]"
                  class="cover-skeleton"
                >
                <img src="@/assets/images/hajimi.png" alt="" >
              </div>
                <img
                  :src="track.cover_url || fallbackCover"
                  loading="lazy"
                  @load="onImageLoad(index)"
                />
              </div>
              <div class="info">
                <div class="title" :title="track.title">{{ track.title }}</div>
                <div class="artist">
                  {{ track.description }}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div v-else class="list-mode">
          <div
            v-for="(track, index) in visibleTracks"
            :key="track.id"
            class="list-row"
            :class="{ active: index === activeIndex }"
            @click="playMockTrack(index)"
          >
            <div class="col-title" style="display: flex; align-items: center">
              <span v-if="index !== activeIndex">{{ index + 1 }}</span>
              <svg-icon
                v-else
                style="width: 20px; height: 20px"
                icon-class="volume"
              />
            </div>
            <div class="col-title">{{ track.title }}</div>
            <div class="col-time">{{
              formatDuration(track.duration_seconds)
            }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import MusicJson from '../mock/music.json';
import { mapState } from 'vuex';
export default {
  name: 'Library',
  data() {
    return {
      show: true,
      viewMode: 'grid',
      activeIndex: '',
      gridColumnNumber: 4,
      fallbackCover:
        'https://p2.music.126.net/UeTuwE7pvjBpypWLudqukA==/3132508627578625.jpg',
      mockTracks: MusicJson,
      pageSize: 40,
      visibleCount: 40,
      imageLoaded: {},
      scrollEl: null,
    };
  },
  mounted() {
    this.updateGridColumns();
    window.addEventListener('resize', this.updateGridColumns);
    this.initVisibleCount();
    this.scrollEl = this.$el && this.$el.parentNode;
    if (this.scrollEl) {
      this.scrollEl.addEventListener('scroll', this.handleScroll, {
        passive: true,
      });
    }
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.updateGridColumns);
    if (this.scrollEl) {
      this.scrollEl.removeEventListener('scroll', this.handleScroll);
    }
  },
  computed: {
    gridStyle() {
      return {
        gridTemplateColumns: `repeat(${this.gridColumnNumber}, 1fr)`,
      };
    },
    ...mapState(['playerBar']),
    visibleTracks() {
      return this.mockTracks.slice(0, this.visibleCount);
    },
  },
  watch: {
    playerBar: {
      immediate: true,
      handler(newVal) {
        if (!newVal) return;
        if (typeof newVal.index === 'number') {
          this.activeIndex = newVal.index;
        }
      },
    },
  },
  methods: {
    initVisibleCount() {
      const length = this.mockTracks.length;
      this.visibleCount = Math.min(this.pageSize, length);
    },
    handleScroll() {
      if (!this.scrollEl) return;

      const scrollBottom = this.scrollEl.scrollTop + this.scrollEl.clientHeight;
      const threshold = this.scrollEl.scrollHeight - 300;
      if (scrollBottom < threshold) return;

      const length = this.mockTracks.length;
      if (this.visibleCount >= length) return;
      this.visibleCount = Math.min(this.visibleCount + this.pageSize, length);
    },
    updateGridColumns() {
      const width = window.innerWidth;
      if (width <= 640) {
        this.gridColumnNumber = 1;
      } else if (width <= 1024) {
        this.gridColumnNumber = 2;
      } else {
        this.gridColumnNumber = 4;
      }
    },
    formatDuration(ms) {
      const totalSeconds = ms;
      const minutes = Math.floor(totalSeconds / 60);
      const seconds = totalSeconds % 60;
      return `${minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
    },
    onImageLoad(index) {
      this.$set(this.imageLoaded, index, true);
    },
    playMockTrack(index) {
      this.activeIndex = index;
      const track = this.mockTracks[index];
      if (!track) return;
      this.$store.commit('updatePlayerBar', {
        index,
        audioUrl: track.audio_url,
        title: track.title,
        description: track.description,
        cover: track.cover_url,
        durationSeconds: track.duration_seconds,
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.library {
  width: 100%;
}

.section-one {
  display: flex;
  margin-top: 24px;
  .songs {
    flex: 7;
    margin-top: 8px;
    margin-left: 36px;
    overflow: hidden;

    .toolbar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;
      .title {
        font-size: 20px;
        font-weight: 600;
        color: var(--color-text);
      }
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
    }

    .grid-mode {
      margin-top: 8px;
      .grid-wrapper {
        display: grid;
        gap: 18px 36px;
      }
      .grid-item {
        display: flex;
        align-items: center;
        cursor: pointer;
        padding: 6px 12px;
        border-radius: 8px;
        transition: 0.3s;

        &.active {
          background-color: var(--color-primary-bg);
        }
      }
      .grid-item:hover {
        background-color: var(--color-primary-bg);
      }
      .cover img {
        width: 64px;
        height: 64px;
        object-fit: cover;
        border-radius: 8px;
        margin-right: 14px;
      }
      .cover {
        position: relative;
      }
      .cover-skeleton {
        position: absolute;
        top: 0;
        left: 0;
        width: 64px;
        height: 64px;
        border-radius: 8px;
        margin-right: 14px;
        background: linear-gradient(90deg, #e5e7eb 0%, #f3f4f6 40%, #e5e7eb 80%);
        background-size: 200% 100%;
        animation: skeleton-loading 1.2s ease-in-out infinite;
      }
      .info {
        display: flex;
        flex-direction: column;
      }
      .info .title {
        font-size: 15px;
        font-weight: 600;
        color: var(--color-text);
        line-height: 1.3;
        max-width: 230px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .info .artist {
        margin-top: 2px;
        font-size: 13px;
        opacity: 0.7;
        color: var(--color-text);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        max-width: 200px;
      }
    }

    .list-mode {
      margin-top: 8px;
      border-radius: 999px;
      .list-header {
        display: grid;
        grid-template-columns: 40px 150px 1fr;
        padding: 8px 16px;
        font-size: 12px;
        text-transform: uppercase;
        letter-spacing: 0.06em;
        opacity: 0.6;
        color: var(--color-text);
      }
      .list-row {
        display: grid;
        grid-template-columns: 40px 150px 1fr;
        align-items: center;
        padding: 10px 18px;
        font-size: 16px;
        color: var(--color-text);
        cursor: pointer;
        transition: background 0.15s ease, color 0.15s ease;
        border-radius: 8px;
      }
      .list-row:hover {
        background: rgba(0, 0, 0, 0.03);
      }
      .list-row.active {
        background: var(--color-primary-bg);
        color: var(--color-primary);
      }
      .col-title {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        font-weight: 600;
      }
      .col-time {
        text-align: right;
        font-variant-numeric: tabular-nums;
      }
    }

    @media (max-width: 640px) {
      margin-left: 16px;
      .toolbar {
        flex-direction: column;
        align-items: flex-start;
        gap: 8px;
      }
      .grid-mode {
        .grid-wrapper {
          gap: 14px 16px;
        }
        .cover img {
          width: 40px;
          height: 40px;
          margin-right: 12px;
        }
        .info .title {
          max-width: 160px;
          font-size: 14px;
        }
        .info .artist {
          font-size: 12px;
        }
      }
      .list-mode {
        .list-header,
        .list-row {
          grid-template-columns: 32px 1fr 48px;
          padding: 6px 12px;
        }
      }
    }
  }
}

@keyframes skeleton-loading {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}
</style>
