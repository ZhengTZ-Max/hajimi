<template>
  <div class="home">
    <div class="index-row first-row">
      <div class="title">
        分类：
        <div class="button hoverBtn" :class="{ active: active == '0' }"
          >Bilibili</div
        >
        <div class="button hoverBtn" :class="{ active: active == '1' }"
          >Tiktok · CN</div
        >
        <div class="button hoverBtn" :class="{ active: active == '2' }"
          >Tiktok</div
        >
      </div>
      <CoverRow :type="'playlist'" :items="HotList" :use-external-url="true" />
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
      active: '0',
    };
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
