<template>
  <div class="search-page">
    <div v-show="playlists.length > 0" class="playlists">
      <!-- <div class="section-title"
        >{{ $t('search.playlist')
        }}<router-link :to="`/search/${keywords}/playlists`">{{
          $t('home.seeMore')
        }}</router-link></div
      > -->
      <CoverRow
        :type="'playlist'"
        :items="playlists.slice(0, 12)"
        sub-text="title"
        :column-number="6"
        sub-text-font-size="14px"
        gap="34px 24px"
        :play-button-size="26"
        :use-external-url="true"
      />
    </div>
  </div>
</template>

<script>
import CoverRow from '@/components/CoverRow.vue';
import HotList from '@/mock/hot.json';

export default {
  name: 'Search',
  components: {
    CoverRow,
  },
  data() {
    return {
      playlists: [],
    };
  },
  computed: {
    keywords() {
      return this.$route.params.keywords ?? '';
    },
  },
  watch: {
    keywords: function (newKeywords) {
      if (newKeywords.length === 0) return;
      this.filterHotList();
    },
  },
  created() {
    this.filterHotList();
  },
  methods: {
    filterHotList() {
      const kw = (this.keywords || '').trim().toLowerCase();
      if (!kw) {
        this.playlists = [];
        return;
      }

      this.playlists = HotList.filter(item => {
        const name = (item.name || '').toLowerCase();
        // const author = (item.author || '').toLowerCase();
        // const desc = (item.description || '').toLowerCase();
        return name.includes(kw);
        // author.includes(kw) ||
        // desc.includes(kw)
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.section-title {
  font-weight: 600;
  font-size: 22px;
  opacity: 0.88;
  color: var(--color-text);
  margin-bottom: 16px;

  display: flex;
  justify-content: space-between;
  align-items: center;
  a {
    font-size: 13px;
    font-weight: 600;
    opacity: 0.68;
  }
}
.playlists {
  margin-top: 46px;
}
</style>
