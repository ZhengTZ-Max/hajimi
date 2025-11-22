<template>
  <div class="player-bar" @click="onToggleLyrics">
    <div class="progress-line" @click.stop>
      <vue-slider
        v-model="currentTime"
        :min="0"
        :max="duration"
        :interval="1"
        :drag-on-click="true"
        :duration="0"
        :dot-size="12"
        :height="6"
        :tooltip-formatter="formatTimeLocal"
        :lazy="true"
        :silent="true"
        @change="onProgressChange"
      />
    </div>

    <div class="content">
      <div class="left" @click.stop>
        <img class="cover" :src="cover || fallbackCover" loading="lazy" />
        <div class="meta" :title="title">
          <div class="title">{{ title }}</div>
          <div class="artist">
            {{ description }}
          </div>
        </div>
      </div>

      <div class="center" @click.stop>
        <button-icon class="icon-btn" @click.native.stop="handlePrev">
          <svg-icon icon-class="previous" />
        </button-icon>
        <button-icon class="icon-btn play" @click.native.stop="playOrPause">
          <svg-icon :icon-class="isPlaying ? 'pause' : 'play'" />
        </button-icon>
        <button-icon class="icon-btn" @click.native.stop="handleNext">
          <svg-icon icon-class="next" />
        </button-icon>
      </div>

      <div class="right" @click.stop>
        <!-- <button-icon
          class="icon-btn playlist-btn"
          @click.native.stop="togglePlaylistDrawer"
        >
          <svg-icon icon-class="list" />
        </button-icon> -->
        <button-icon
          class="icon-btn repeat-btn"
          :class="{ active: repeatMode !== 'off' }"
          @click.native.stop="toggleRepeatMode"
        >
          <svg-icon v-show="repeatMode !== 'one'" icon-class="repeat" />
          <svg-icon v-show="repeatMode === 'one'" icon-class="repeat-1" />
        </button-icon>
        <button-icon
          class="icon-btn shuffle-btn"
          :class="{ active: shuffle }"
          @click.native.stop="toggleShuffle"
        >
          <svg-icon icon-class="shuffle" />
        </button-icon>
        <!-- 音量 -->
        <div class="volume">
          <button-icon class="icon-btn" @click.native.stop="mute">
            <svg-icon v-show="volume > 0.5" icon-class="volume" />
            <svg-icon v-show="volume === 0" icon-class="volume-mute" />
            <svg-icon
              v-show="volume <= 0.5 && volume !== 0"
              icon-class="volume-half"
            />
          </button-icon>
          <div class="bar">
            <vue-slider
              v-model="volume"
              :min="0"
              :max="1"
              :interval="0.01"
              :drag-on-click="true"
              :duration="0"
              tooltip="none"
              :dot-size="12"
            />
          </div>
        </div>

        <!-- 展示弹层播放器 -->
        <button-icon
          class="icon-btn chevron"
          @click.native.stop="onToggleLyrics"
        >
          <svg-icon icon-class="arrow-up" />
        </button-icon>
      </div>
    </div>

    <audio ref="audio" :src="audioUrl" preload="metadata"></audio>
    <div v-if="showPlaylistDrawer" class="playlist-drawer" @click.stop>
      <div class="playlist-header">
        <div class="playlist-title">当前歌单</div>
        <div class="playlist-subtitle">来自 mock music.json</div>
      </div>
      <div class="playlist-body">
        <div
          v-for="(track, index) in playlist"
          :key="track.id || index"
          class="playlist-item"
          :class="{ active: index === currentIndex }"
          @click="playTrackFromPlaylist(index)"
        >
          <img class="playlist-cover" :src="track.cover_url" loading="lazy" />
          <div class="playlist-meta">
            <div class="playlist-track-title">{{ track.title }}</div>
            <div class="playlist-track-desc">{{ track.description }}</div>
          </div>
          <div class="playlist-duration">
            {{ formatTimeLocal(track.duration_seconds || 0) }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import VueSlider from 'vue-slider-component';
import ButtonIcon from '@/components/ButtonIcon.vue';
import { formatTrackTime } from '@/utils/common';
import '@/assets/css/slider.css';
import playlistData from '@/mock/music.json';

export default {
  name: 'PlayerBar',
  components: { VueSlider, ButtonIcon },
  props: {
    audioUrl: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      default: '',
    },
    cover: {
      type: String,
      default: '',
    },
    durationSeconds: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      isPlaying: false,
      currentTime: 0,
      duration: this.durationSeconds || 0,
      volume: 1,
      lastNonZeroVolume: 1,
      repeatMode: 'off', // off | all | one
      shuffle: false,
      playlist: playlistData,
      currentIndex: -1,
      showPlaylistDrawer: false,
      latestUrl: null,
      fallbackCover:
        'https://p2.music.126.net/UeTuwE7pvjBpypWLudqukA==/3132508627578625.jpg',
    };
  },
  watch: {
    audioUrl: {
      immediate: true,
      handler(newUrl) {
        if (!newUrl) return;
        this.latestUrl = newUrl;
        // 重置进度/时长并同步当前索引
        this.isPlaying = false;
        this.currentTime = 0;
        this.duration = this.durationSeconds || 0;
        this.syncCurrentIndexFromAudioUrl(newUrl);

        this.$nextTick(() => {
          // 等 DOM / audio 已经挂载之后再处理，解决第一次创建组件时 ref 还不存在的问题
          if (this.latestUrl !== newUrl) return;
          const audio = this.$refs.audio;
          if (!audio) return;

          audio.pause();
          audio.src = newUrl;
          audio.load();
          const playPromise = audio.play();
          if (playPromise && playPromise.then) {
            playPromise
              .then(() => {
                this.isPlaying = true;
              })
              .catch(() => {});
          } else {
            this.isPlaying = true;
          }
        });
      },
    },
    volume(val) {
      const audio = this.$refs.audio;
      if (!audio) return;
      audio.volume = val;
      if (val > 0) this.lastNonZeroVolume = val;
    },
  },
  mounted() {
    const audio = this.$refs.audio;
    if (!audio) return;

    audio.volume = this.volume;

    audio.addEventListener('loadedmetadata', () => {
      if (!this.durationSeconds && audio.duration) {
        this.duration = audio.duration;
      }
    });

    audio.addEventListener('timeupdate', () => {
      this.currentTime = audio.currentTime || 0;
    });

    audio.addEventListener('ended', () => {
      this.handleTrackEnd();
    });
  },
  beforeDestroy() {
    const audio = this.$refs.audio;
    if (!audio) return;
    audio.pause();
  },
  methods: {
    formatTimeLocal(value) {
      return formatTrackTime(Math.floor(value));
    },
    syncCurrentIndexFromAudioUrl(url) {
      if (!url || !Array.isArray(this.playlist)) return;
      const index = this.playlist.findIndex(item => item.audio_url === url);
      this.currentIndex = index;
    },
    getPayloadByIndex(index) {
      if (!Array.isArray(this.playlist) || index < 0) return null;
      const track = this.playlist[index];
      if (!track) return null;
      return {
        index,
        audioUrl: track.audio_url,
        title: track.title,
        description: track.description,
        cover: track.cover_url,
        durationSeconds: track.duration_seconds,
      };
    },
    playOrPause() {
      const audio = this.$refs.audio;
      if (!audio || !this.audioUrl) return;

      if (this.isPlaying) {
        audio.pause();
        this.isPlaying = false;
      } else {
        audio.play();
        this.isPlaying = true;
      }
    },
    onProgressChange(val) {
      const audio = this.$refs.audio;
      if (!audio) return;
      audio.currentTime = val;
      this.currentTime = val;
    },
    mute() {
      const audio = this.$refs.audio;
      if (!audio) return;

      if (this.volume === 0) {
        this.volume = this.lastNonZeroVolume || 1;
      } else {
        this.lastNonZeroVolume = this.volume;
        this.volume = 0;
      }
    },
    toggleRepeatMode() {
      if (this.repeatMode === 'off') this.repeatMode = 'all';
      else this.repeatMode = 'off';
      this.$emit('change-repeat', this.repeatMode);
    },
    toggleShuffle() {
      this.shuffle = !this.shuffle;
      this.$emit('change-shuffle', this.shuffle);
    },
    handlePrev() {
      const length = Array.isArray(this.playlist) ? this.playlist.length : 0;
      if (!length) return;

      if (this.shuffle && length > 1) {
        let randomIndex = this.currentIndex;
        while (randomIndex === this.currentIndex) {
          randomIndex = Math.floor(Math.random() * length);
        }
        this.playTrackFromPlaylist(randomIndex);
        return;
      }

      if (this.repeatMode === 'one' && this.currentIndex !== -1) {
        this.playTrackFromPlaylist(this.currentIndex);
        return;
      }

      if (this.currentIndex <= 0) {
        if (this.repeatMode === 'all') {
          this.playTrackFromPlaylist(length - 1);
        }
        return;
      }

      this.playTrackFromPlaylist(this.currentIndex - 1);
    },
    handleNext() {
      const length = Array.isArray(this.playlist) ? this.playlist.length : 0;
      if (!length) return;

      if (this.shuffle && length > 1) {
        let randomIndex = this.currentIndex;
        while (randomIndex === this.currentIndex) {
          randomIndex = Math.floor(Math.random() * length);
        }
        this.playTrackFromPlaylist(randomIndex);
        return;
      }

      if (this.repeatMode === 'one' && this.currentIndex !== -1) {
        this.playTrackFromPlaylist(this.currentIndex);
        return;
      }

      if (this.currentIndex >= length - 1) {
        if (this.repeatMode === 'all') {
          this.playTrackFromPlaylist(0);
        }
        return;
      }

      this.playTrackFromPlaylist(this.currentIndex + 1);
    },
    handleTrackEnd() {
      const audio = this.$refs.audio;
      if (this.repeatMode == 'all') {
        this.isPlaying = true;
        audio.play();
      } else {
        this.isPlaying = false;
        this.handleNext();
      }
    },
    playTrackFromPlaylist(index) {
      const payload = this.getPayloadByIndex(index);
      if (!payload) return;
      this.currentIndex = index;
      if (this.$store && this.$store.commit) {
        this.$store.commit('updatePlayerBar', payload);
      }
    },
    togglePlaylistDrawer() {
      this.showPlaylistDrawer = !this.showPlaylistDrawer;
    },
    onToggleLyrics() {
      this.$emit('toggle-lyrics');
    },
  },
};
</script>

<style lang="scss" scoped>
.player-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 100;
  display: flex;
  flex-direction: column;
  height: 64px;
  backdrop-filter: saturate(180%) blur(30px);
  background: linear-gradient(90deg, #ffffff 0%, #f5f7ff 100%);
  box-shadow: 0 -8px 24px rgba(15, 23, 42, 0.12);
}

.progress-line {
  margin-top: -6px;
  margin-bottom: -6px;
  width: calc(100% - 24px);
  padding: 0 12px;
}

.content {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  height: 100%;
  padding: 0 10vw;
}

.left {
  display: flex;
  align-items: center;
  .cover {
    width: 40px;
    height: 40px;
    border-radius: 8px;
    object-fit: cover;
    box-shadow: 0 8px 18px rgba(0, 0, 0, 0.16);
  }
  .meta {
    margin-left: 12px;
    display: flex;
    flex-direction: column;
    .title {
      max-width: 150px;
      font-size: 14px;
      font-weight: 600;
      color: #111827;
      line-height: 1.3;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .artist {
      max-width: 150px;
      margin-top: 2px;
      font-size: 12px;
      color: #6b7280;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
}

.center {
  display: flex;
  align-items: center;
  justify-content: center;
  .icon-btn {
    margin: 0 8px;
  }
  .play {
    height: 38px;
    width: 38px;
    .svg-icon {
      width: 22px;
      height: 22px;
    }
  }
}

.right {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  .icon-btn {
    margin-left: 8px;
  }
  .icon-btn.active .svg-icon {
    color: var(--color-primary);
  }
  .volume {
    display: flex;
    align-items: center;
    margin-left: 8px;
    .bar {
      width: 90px;
      margin-left: 4px;
    }
  }
  .chevron {
    margin-left: 12px;
  }
}

@media (max-width: 1024px) {
  .progress-line {
    padding: 0 5vw;
  }
  .content {
    padding: 0 5vw;
  }
}

@media (max-width: 640px) {
  .player-bar {
    box-shadow: 0 -4px 14px rgba(15, 23, 42, 0.16);
  }
  .progress-line {
    padding: 0 16px;
  }
  .content {
    padding: 0 12px;
  }
  .right .playlist-btn,
  .right .repeat-btn,
  .right .shuffle-btn,
  .right .volume {
    display: none;
  }
  .right .volume .bar {
    width: 70px;
  }
}

.playlist-drawer {
  position: fixed;
  top: 80px;
  right: 0;
  bottom: 64px;
  width: 360px;
  background: rgba(15, 23, 42, 0.96);
  box-shadow: -12px 0 24px rgba(15, 23, 42, 0.55);
  display: flex;
  flex-direction: column;
  color: #f9fafb;
}

.playlist-header {
  padding: 16px 18px 8px;
}

.playlist-title {
  font-size: 16px;
  font-weight: 600;
}

.playlist-subtitle {
  margin-top: 4px;
  font-size: 12px;
  color: #9ca3af;
}

.playlist-body {
  flex: 1;
  overflow-y: auto;
  padding: 4px 8px 8px;
}

.playlist-item {
  display: flex;
  align-items: center;
  padding: 6px 8px;
  border-radius: 8px;
  cursor: pointer;
}

.playlist-item:hover {
  background: rgba(55, 65, 81, 0.9);
}

.playlist-item.active {
  background: rgba(129, 140, 248, 0.9);
}

.playlist-cover {
  width: 36px;
  height: 36px;
  border-radius: 6px;
  object-fit: cover;
}

.playlist-meta {
  flex: 1;
  margin: 0 8px;
  overflow: hidden;
}

.playlist-track-title {
  font-size: 13px;
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.playlist-track-desc {
  margin-top: 2px;
  font-size: 11px;
  color: #d1d5db;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.playlist-duration {
  font-size: 12px;
  color: #9ca3af;
}
</style>
