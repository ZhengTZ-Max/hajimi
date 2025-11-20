<template>
  <div class="home">
    <div class="index-row first-row">
      <div class="title"> 热门 </div>
      <CoverRow
        :type="'playlist'"
        :items="HotList"
        :use-external-url="true"
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
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 20px;
  font-size: 28px;
  font-weight: 700;
  color: var(--color-text);
  a {
    font-size: 13px;
    font-weight: 600;
    opacity: 0.68;
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
