<template>
  <div class="bvid-page">
    <h1 class="bvid-title">Bilibili 视频信息查询</h1>

    <div class="bvid-form">
      <input
        v-model="bvid"
        type="text"
        class="bvid-input"
        placeholder="请输入 BV 号，例如：BV1xx411c7mD"
      />
      <button class="bvid-button" @click="fetchVideoInfo" :disabled="loading">
        {{ loading ? '请求中...' : '确认' }}
      </button>
    </div>

    <p v-if="error" class="bvid-error">{{ error }}</p>

    <div v-if="result" class="bvid-result">
      <h2>结果</h2>
      <pre>{{ formattedResult }}</pre>
    </div>

    <hr style="margin: 24px 0" />

    <div class="bvid-form">
      <button
        class="bvid-button"
        @click="fetchBatchFromHot"
        :disabled="batchLoading"
      >
        {{ batchLoading ? '批量查询中...' : '批量查询 hot.json' }}
      </button>
    </div>

    <p v-if="batchError" class="bvid-error">{{ batchError }}</p>

    <div v-if="batchResults && batchResults.length" class="bvid-result">
      <div class="bvid-result-header">
        <h2>批量结果（保留 url / description，其余为接口返回字段）</h2>
        <button class="bvid-button" @click="copyAll">全部复制</button>
      </div>
      <pre>{{ batchJson }}</pre>
    </div>
  </div>
</template>

<script>
import hotList from '@/mock/hot.json';

export default {
  name: 'GetBilll',
  data() {
    return {
      bvid: '',
      loading: false,
      error: '',
      result: null,
      // 批量查询相关
      batchLoading: false,
      batchError: '',
      batchResults: [],
    };
  },
  computed: {
    formattedResult() {
      if (!this.result) return '';
      return JSON.stringify(this.result, null, 2);
    },
    batchJson() {
      if (!this.batchResults || !this.batchResults.length) return '[]';
      return JSON.stringify(this.batchResults, null, 2);
    },
  },
  methods: {
    // 通用：根据 BV 号请求 B 站并返回整理好的结果对象
    async fetchVideoInfoByBvid(bvid) {
      const apiUrl = `/bapi/view?bvid=${encodeURIComponent(bvid)}`;

      const response = await fetch(apiUrl);
      if (!response.ok) {
        throw new Error(`状态码：${response.status}`);
      }

      const data = await response.json();
      if (data.code !== 0) {
        throw new Error(data.message || '获取视频信息失败');
      }

      const videoInfo = data.data || {};
      return {
        title: videoInfo.title || '',
        thumbnail: videoInfo.pic || '',
        author: (videoInfo.owner && videoInfo.owner.name) || '',
        views: (videoInfo.stat && videoInfo.stat.view) || 0,
        thumbupCount: (videoInfo.stat && videoInfo.stat.like) || 0,
        collectionCount: (videoInfo.stat && videoInfo.stat.favorite) || 0,
        shareCount: (videoInfo.stat && videoInfo.stat.share) || 0,
        commentCount: (videoInfo.stat && videoInfo.stat.reply) || 0,
        danmakuCount: (videoInfo.stat && videoInfo.stat.danmaku) || 0,
        coinCount: (videoInfo.stat && videoInfo.stat.coin) || 0,
        createTime: this.formatDate(videoInfo.pubdate || videoInfo.ctime || 0),
      };
    },
    // 单个查询按钮使用
    async fetchVideoInfo() {
      if (!this.bvid) {
        this.error = 'BV号不能为空';
        this.result = null;
        return;
      }

      this.loading = true;
      this.error = '';
      this.result = null;

      try {
        this.result = await this.fetchVideoInfoByBvid(this.bvid);
      } catch (e) {
        this.error =
          e && e.message
            ? `获取Bilibili视频信息时发生错误：${e.message}`
            : '获取Bilibili视频信息时发生错误';
        console.error(e);
      } finally {
        this.loading = false;
      }
    },
    // 从 URL 中提取 BV 号
    getBvidFromUrl(url) {
      if (!url) return '';
      const match = url.match(/BV[0-9A-Za-z]+/);
      return match ? match[0] : '';
    },
    // 批量查询 hot.json
    async fetchBatchFromHot() {
      this.batchLoading = true;
      this.batchError = '';
      this.batchResults = [];

      try {
        const tasks = hotList.map(async item => {
          const bvid = this.getBvidFromUrl(item.url);
          if (!bvid) {
            return {
              url: item.url,
              description: item.description,
              error: '未从 URL 中解析出 BV 号',
            };
          }

          try {
            const info = await this.fetchVideoInfoByBvid(bvid);
            return {
              url: item.url,
              description: item.description,
              ...info,
            };
          } catch (e) {
            return {
              url: item.url,
              description: item.description,
              error:
                e && e.message
                  ? `获取视频信息失败：${e.message}`
                  : '获取视频信息失败',
            };
          }
        });

        // 并发执行所有查询
        this.batchResults = await Promise.all(tasks);
      } catch (e) {
        this.batchError = '批量查询时发生错误';
        console.error(e);
      } finally {
        this.batchLoading = false;
      }
    },
    async copyAll() {
      if (!this.batchResults || !this.batchResults.length) return;
      const text = this.batchJson;
      if (navigator && navigator.clipboard && navigator.clipboard.writeText) {
        try {
          await navigator.clipboard.writeText(text);
        } catch (e) {
          this.fallbackCopyText(text);
        }
      } else {
        this.fallbackCopyText(text);
      }
    },
    fallbackCopyText(text) {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.style.position = 'fixed';
      textarea.style.top = '-9999px';
      document.body.appendChild(textarea);
      textarea.focus();
      textarea.select();
      try {
        document.execCommand('copy');
      } finally {
        document.body.removeChild(textarea);
      }
    },
    formatDate(timestamp) {
      if (!timestamp) return '';
      const date = new Date(timestamp * 1000);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}/${month}/${day}`;
    },
  },
};
</script>

<style scoped>
.bvid-page {
  padding: 24px;
}

.bvid-title {
  font-size: 20px;
  margin-bottom: 16px;
}

.bvid-form {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
}

.bvid-input {
  flex: 1;
  padding: 8px 12px;
  border-radius: 4px;
  border: 1px solid #ccc;
}

.bvid-button {
  padding: 8px 16px;
  border: none;
  background-color: #409eff;
  color: #fff;
  border-radius: 4px;
  cursor: pointer;
}

.bvid-button[disabled] {
  opacity: 0.6;
  cursor: not-allowed;
}

.bvid-error {
  color: #f56c6c;
  margin-bottom: 16px;
}

.bvid-result {
  background-color: #1e1e1e;
  color: #f5f5f5;
  padding: 16px;
  border-radius: 4px;
  overflow: auto;
}

.bvid-result-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.bvid-result pre {
  margin: 0;
  white-space: pre-wrap;
  word-break: break-all;
}
</style>
