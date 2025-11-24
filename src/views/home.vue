<template>
  <div class="home">
    <div class="index-row first-row">
      <div class="title">
        分类：
        <div
          class="button hoverBtn"
          :class="{ active: active == 'bili' }"
          @click="onTab('bili')"
          >Bilibili</div
        >
        <div
          class="button hoverBtn"
          :class="{ active: active == 'douyin' }"
          @click="onTab('douyin')"
          >Tiktok · CN</div
        >
        <!-- <div class="button hoverBtn" :class="{ active: active == '2' }"
          >Tiktok</div
        > -->
      </div>
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
      <CoverRow
        v-else
        :type="'playlist'"
        :items="visibleHotList"
        :use-external-url="true"
        :activeType="active"
      />
    </div>
  </div>
</template>

<script>
import CoverRow from '@/components/CoverRow.vue';

import HotList from '@/mock/hot.json';
import DouyinList from '@/mock/douyin.json';
export default {
  name: 'Home',
  components: { CoverRow },

  data() {
    return {
      HotList,
      DouyinList,
      active: 'bili',
      pageSize: 12,
      visibleCount: 12,
      scrollEl: null,
      loading: false,
      loadingTimer: null,
    };
  },
  computed: {
    currentList() {
      return this.active === 'douyin' ? this.DouyinList : this.HotList;
    },
    visibleHotList() {
      return this.currentList.slice(0, this.visibleCount);
    },
  },
  mounted() {
    this.initVisibleCount();
    this.scrollEl = this.$el && this.$el.parentNode;
    if (this.scrollEl) {
      this.scrollEl.addEventListener('scroll', this.handleScroll, {
        passive: true,
      });
    }
  },
  beforeDestroy() {
    if (this.scrollEl) {
      this.scrollEl.removeEventListener('scroll', this.handleScroll);
    }
  },
  methods: {
    onTab(type) {
      if (this.loading) {
        clearTimeout(this.loadingTimer);
        this.loading = false;
      }
      this.active = type;
      // 切换分类时显示加载状态并在 3 秒后初始化列表
      this.loading = true;
      this.visibleCount = 0;
      if (this.scrollEl) {
        this.scrollEl.scrollTop = 0;
      }
      this.loadingTimer = setTimeout(() => {
        this.initVisibleCount();
        this.loading = false;
      }, 500);
    },
    initVisibleCount() {
      const length = this.currentList.length;
      this.visibleCount = Math.min(this.pageSize, length);
    },
    handleScroll() {
      if (!this.scrollEl) return;

      const scrollBottom = this.scrollEl.scrollTop + this.scrollEl.clientHeight;
      const threshold = this.scrollEl.scrollHeight - 100;
      if (scrollBottom < threshold) return;

      const length = this.currentList.length;
      if (this.visibleCount >= length) return;
      this.visibleCount = Math.min(this.visibleCount + this.pageSize, length);
    },
  },
};
</script>

<style lang="scss" scoped>
.index-row {
  margin-top: 54px;
}
.index-row.first-row {
  margin-top: 32px;
}
.title {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  margin-bottom: 20px;
  font-size: 28px;
  font-weight: 700;
  color: var(--color-text);
  a {
    font-size: 13px;
    font-weight: 600;
    opacity: 0.68;
  }
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
}

@media (max-width: 768px) {
  .index-row {
    margin-top: 32px;
  }
  .title {
    margin-bottom: 16px;
    font-size: 22px;
    a {
      font-size: 12px;
    }
  }
}

.immersive-translate-input {
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  z-index: 2147483647;
  display: flex;
  justify-content: center;
  align-items: center;
}
.immersive-translate-attach-loading::after {
  content: ' ';

  --loading-color: #f78fb6;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  display: block;
  margin: 12px auto;
  position: relative;
  color: white;
  left: -100px;
  box-sizing: border-box;
  animation: immersiveTranslateShadowRolling 1.5s linear infinite;

  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-2000%, -50%);
  z-index: 100;
}

.immersive-translate-loading-spinner {
  vertical-align: middle !important;
  width: 10px !important;
  height: 10px !important;
  display: inline-block !important;
  margin: 0 4px !important;
  border: 2px rgba(221, 244, 255, 0.6) solid !important;
  border-top: 2px rgba(0, 0, 0, 0.375) solid !important;
  border-left: 2px rgba(0, 0, 0, 0.375) solid !important;
  border-radius: 50% !important;
  padding: 0 !important;
  -webkit-animation: immersive-translate-loading-animation 0.6s infinite linear !important;
  animation: immersive-translate-loading-animation 0.6s infinite linear !important;
}

@-webkit-keyframes immersive-translate-loading-animation {
  from {
    -webkit-transform: rotate(0deg);
  }

  to {
    -webkit-transform: rotate(359deg);
  }
}

@keyframes immersive-translate-loading-animation {
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(359deg);
  }
}

#loading {
  height: 30vh;
  width: 100%;
}
#loading-center {
  width: 100%;
  height: 100%;
  position: relative;
}
#loading-center-absolute {
  position: absolute;
  left: 50%;
  top: 50%;
  height: 50px;
  width: 150px;
  margin-top: -25px;
  margin-left: -75px;
}
.object {
  width: 8px;
  height: 50px;
  margin-right: 5px;
  background-color: var(--color-primary);
  -webkit-animation: animate 1s infinite;
  animation: animate 1s infinite;
  float: left;
}

.object:last-child {
  margin-right: 0px;
}

.object:nth-child(10) {
  -webkit-animation-delay: 0.9s;
  animation-delay: 0.9s;
}
.object:nth-child(9) {
  -webkit-animation-delay: 0.8s;
  animation-delay: 0.8s;
}
.object:nth-child(8) {
  -webkit-animation-delay: 0.7s;
  animation-delay: 0.7s;
}
.object:nth-child(7) {
  -webkit-animation-delay: 0.6s;
  animation-delay: 0.6s;
}
.object:nth-child(6) {
  -webkit-animation-delay: 0.5s;
  animation-delay: 0.5s;
}
.object:nth-child(5) {
  -webkit-animation-delay: 0.4s;
  animation-delay: 0.4s;
}
.object:nth-child(4) {
  -webkit-animation-delay: 0.3s;
  animation-delay: 0.3s;
}
.object:nth-child(3) {
  -webkit-animation-delay: 0.2s;
  animation-delay: 0.2s;
}
.object:nth-child(2) {
  -webkit-animation-delay: 0.1s;
  animation-delay: 0.1s;
}
@-webkit-keyframes animate {
  50% {
    -ms-transform: scaleY(0);
    -webkit-transform: scaleY(0);
    transform: scaleY(0);
  }
}
@keyframes animate {
  50% {
    -ms-transform: scaleY(0);
    -webkit-transform: scaleY(0);
    transform: scaleY(0);
  }
}
</style>
