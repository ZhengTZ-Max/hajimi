<template>
  <div class="home">
    <div class="index-row first-row">
      <div class="title">
        分类：
        <div class="button hoverBtn" :class="{ active: active == 'bili' }"
          >Bilibili</div
        >
        <!-- <div class="button hoverBtn" :class="{ active: active == '1' }"
          >Tiktok · CN</div
        >
        <div class="button hoverBtn" :class="{ active: active == '2' }"
          >Tiktok</div
        > -->
      </div>
      <CoverRow
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

export default {
  name: 'Home',
  components: { CoverRow },

  data() {
    return {
      HotList,
      active: 'bili',
      pageSize: 12,
      visibleCount: 12,
      scrollEl: null,
    };
  },
  computed: {
    visibleHotList() {
      return this.HotList.slice(0, this.visibleCount);
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
    initVisibleCount() {
      const length = this.HotList.length;
      this.visibleCount = Math.min(this.pageSize, length);
    },
    handleScroll() {
      if (!this.scrollEl) return;

      const scrollBottom = this.scrollEl.scrollTop + this.scrollEl.clientHeight;
      const threshold = this.scrollEl.scrollHeight - 100;
      if (scrollBottom < threshold) return;

      const length = this.HotList.length;
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
</style>
