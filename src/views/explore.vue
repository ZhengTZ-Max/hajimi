<template>
  <section class="explore-container">
    <p class="source"
      >素材来自B站UP主：<span @click="goSource">@卡洛calo</span>
    </p>

    <div class="category-container">
      <div
        class="content-card"
        v-for="(item, index) in introList"
        :key="index"
        @click.stop="openPlayer(item)"
      >
        <div class="card-images">
          <img class="card-image" :src="item?.cover" alt="cover 1" />
        </div>
        <div class="shade">
          <button class="play-button hoverBtn" @click.stop="openPlayer(item)"
            ><svg-icon icon-class="play" />
          </button>
        </div>
        <div class="profile-card">
          <div class="profile-detail">
            <span class="profile-name">{{ item?.label }}</span>
            <p class="profile-desc">{{ item?.desc }}</p>
            <!-- <button class="play-btn" type="button" @click="openPlayer">
              Play video
            </button> -->
          </div>

          <!-- <div class="wrapper">
            <div class="profile-quote">
              <p class="quote-text">
                Some quote or additional information text.
              </p>
            </div>
          </div> -->
        </div>
      </div>
    </div>

    <div class="souceIntro">
      <h3 class="intro-title" style="text-align: center"
        >哈基米：席卷全球的病毒式互联网文化——起源、突破与全球现象</h3
      >

      <p>
        在瞬息万变的互联网文化中，真正能引起全球共鸣的表情符号寥寥无几。然而，“哈基米”（日语：はしまし）——一个看似毫无意义的音节——却超越了语言障碍，席卷各大社交媒体平台，演变成一种拥有数百亿次观看量的文化现象。从动漫片段到表情符号，从猫咪视频到专属音乐，这一可爱的潮流以各种你能想象到的形式出现，可靠的数据和跨文化影响力证明了其空前的流行度，创造了互联网文化解构的最高潮。
      </p>

      <h4>一、起源：从动漫哼唱到文化解构</h4>
      <p>
        “哈基米”的故事始于一部动漫中的一个片段：在动漫《赛马娘 Pretty
        Derby》第二季（2021年）第12集中，角色东海贞夫在购买蜂蜜饮料时哼唱着“哈基米”（hachimitsu）。这段时长仅8秒的短视频，迅速在日本社交媒体平台
        Niconico 上走红。其朗朗上口的 C
        大调循环旋律，加上引人注目的视觉对比（偶像身着赛马服享用甜饮），获得了
        300 万的点击量。
      </p>
      <p>
        2022 年 11 月，中国 Bilibili UP
        主“东桥刹那”将东海贞夫的哼唱与《CLANNAD》的背景音乐融合，创作出了标志性的“哈基米”混音版，正式开启了中国对哈基米文化的解构时代。他公开邀请用户将这首歌与猫咪视频、cosplay
        内容等结合，引发了一波用户原创内容（UGC）热潮。这一改编作品成为经典，仅在
        Bilibili 平台上就获得了超过 800 万的播放量。
      </p>
      <p>
        最初只是“蜂蜜”的音译，“哈基米”很快演变为全球公认的可爱象征。到 2023
        年，它的含义已经超越了最初内涵，成为可爱动物、温馨瞬间乃至日常快乐的代名词。
      </p>

      <h4>二、突破时刻：中国进行哈基米文化解构的阶段</h4>
      <p
        >哈基米的崛起并非偶然，它大致经历了三个阶段，每个阶段都以破纪录的数据为标志：</p
      >
      <ul>
        <li>
          <strong>1. 核心发酵期（2021–2022）：</strong> Niconico（300
          万浏览量）和 Bilibili（超过 800
          万浏览量）奠定了基础。这一趋势最初在动漫和猫咪爱好者圈层发酵，逐渐形成忠实的粉丝群体。
        </li>
        <li>
          <strong>2. 主流突破期（2023–至今）：</strong> TikTok / 抖音上的
          #哈基米 话题在 2023 年就获得了 13 亿次观看，至 2025 年已累计超过 280
          亿次。微信、小红书等平台相关内容总观看量达数千亿次，73%
          的内容都围绕可爱宠物展开。
        </li>
        <li>
          <strong>3. 语义扩展期（2024–2025）：</strong
          >“哈基米”的应用从宠物视频扩展到音乐、奶茶、手办等多个领域，仅 2025
          年一年，就有数千首歌曲被改编为“哈基米”风格，数十万创作者持续贡献新内容。
        </li>
      </ul>
      <p>
        到 2025 年，“哈基米”文化成功解构到“音乐时代”，并被列入 Z
        世代社交媒体白皮书中的十大热门词汇之一。
      </p>

      <h4>三、全球流行度的证据：数据胜于雄辩</h4>
      <p>为了量化哈基米的全球影响力，可以从以下几个层面来观察：</p>
      <ul>
        <li>
          <strong>东西方社交媒体的主导地位：</strong> 抖音上 “#哈基米”
          搜索量超过 258 亿次，用户数超过 198.4 万；TikTok、YouTube、Bilibili
          等平台上相关视频的累计播放量早已达数十亿级别。
        </li>
        <li>
          <strong>商业与经济影响：</strong> 从联名饮品到宠物饰品，再到 UT
          系列服饰和 AI
          音乐挑战赛，“哈基米”被频繁用作品牌营销的视觉与情绪符号，带动了一系列线下与线上消费热潮。
        </li>
        <li>
          <strong>持续的创意生态：</strong> 数以十万计的创作者在
          Instagram、TikTok、YouTube
          等平台上源源不断产出与“哈基米”相关的表情包、视频和音乐，让这一文化符号保持旺盛生命力。
        </li>
      </ul>
      <p>
        哈基米 Web3
        社区也正在形成，欢迎来自世界各地热爱互联网文化的成员加入，共同见证 Web2
        与 Web3 之间的文化互通与变革。
      </p>
      <p class="note">
        *
        注：由于“哈基米”的英文翻译与本地发音存在差异，网络上常用的标签包括：哈基米、Hakimi、Hachimi
        等。这些标签均可用于搜索与“Hakimi”相关的内容。
      </p>
    </div>

    <VideoModal
      :visible="showPlayer"
      :src="currentVideoUrl"
      :title="findRow?.label"
      @close="closePlayer"
    />
  </section>
</template>

<script>
import VideoModal from '@/components/VideoModal.vue';
import video1 from '@/assets/video/1.mp4';
import video2 from '@/assets/video/2.mp4';
import video3 from '@/assets/video/3.mp4';
import video4 from '@/assets/video/4.mp4';
export default {
  name: 'Explore',
  components: {
    VideoModal,
  },
  data() {
    return {
      showPlayer: false,
      currentVideoUrl: '',
      focus: false,
      findRow: {},
      introList: [
        {
          label: '《哈基米编年史》 第一集',
          desc: '初期解构',
          videoUrl: video1,
          cover:
            'https://i0.hdslb.com/bfs/archive/1a0fc5a3fa155a52ed412ecdcfda6c2fcac3eded.jpg@672w_378h_1c.avif',
        },
        {
          label: '《哈基米编年史》 第二集',
          desc: '萌宠解构',
          videoUrl: video2,
          cover:
            'https://i0.hdslb.com/bfs/archive/18ae55000ae595186985c558b3170c1b37172fe8.jpg@672w_378h_1c.avif',
        },
        {
          label: '《哈基米编年史》 第三集',
          desc: '音符与猫咪解构',
          videoUrl: video3,
          cover:
            'https://i0.hdslb.com/bfs/archive/628e3f5bd5eff412fd33a4e02ef8cf9d61ac908d.jpg@672w_378h_1c.avif',
        },
        {
          label: '《哈基米编年史》第四集',
          desc: '一杯水，一只猫，一个时代，即是万物。',
          videoUrl: video4,
          cover:
            'https://i0.hdslb.com/bfs/archive/dafec852a872a2213569af3107b7d431192d1008.jpg@672w_378h_1c.avif',
        },
      ],
    };
  },
  methods: {
    openPlayer(item) {
      console.log();
      this.findRow = item;
      const fallback = video1;
      this.currentVideoUrl = item && item.videoUrl ? item.videoUrl : fallback;
      this.showPlayer = true;
    },
    closePlayer() {
      this.showPlayer = false;
    },
    goSource() {
      window.open('https://space.bilibili.com/9353567');
    },
  },
};
</script>

<style lang="scss" scoped>
.explore-container {
  width: 100%;
  padding: 24px;
}
.source {
  font-size: 16px;
  text-align: center;
  font-weight: 600;

  span {
    color: var(--color-primary);
    text-decoration: underline;
    cursor: pointer;
  }
}
.souceIntro {
  margin: 40px auto 0;
  max-width: 960px;
  padding: 24px 28px;
  border-radius: 16px;
  background-color: var(--color-secondary-bg);
  box-shadow: 0 12px 20px rgba(0, 0, 0, 0.08);
  font-size: 14px;
  line-height: 1.7;
  color: var(--color-text);
  white-space: pre-line;
}
.category-container {
  display: flex;
  flex-wrap: wrap;
  gap: 24px;
}

.content-card {
  flex: 1 1 calc(25% - 24px);
  display: flex;
  flex-direction: column;
  padding: 16px;
  border-radius: 10px;
  background-color: var(--color-secondary-bg);
  box-sizing: border-box;
  position: relative;
  cursor: pointer;
  transition: 0.3s;
  &:hover {
    background-color: var(--color-primary-bg);
    box-shadow: 0 0 24px rgba(255, 122, 69, 0.3);

    .play-button {
      display: block;
    }
  }
}

// 中等屏幕：2 列
@media (max-width: 1200px) {
  .content-card {
    flex: 1 1 calc(50% - 24px);
  }
}

// 小屏幕：1 列
@media (max-width: 768px) {
  .content-card {
    flex: 1 1 100%;
  }
}

.card-images {
  height: 320px;
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 12px;
  border-radius: 10px;
  overflow: hidden;
}
.shade {
  position: absolute;
  top: 16px;
  left: 16px;
  height: calc(100% - 32px);
  width: calc(100% - 32px);
  border-radius: 10px;
  background: rgba(0, 0, 0, 0.35);
  display: flex;
  justify-content: center;
  align-items: center;
  .play-button {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    background-color: rgba(255, 255, 255, 0.25);
    display: flex;
    align-items: center;
    justify-content: center;
    display: none;
    .svg-icon {
      width: 24px;
      height: 24px;
      color: #fff;
    }
  }
}

.card-images::after {
  content: '';
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.card-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.profile-card {
  position: absolute;
  width: 80%;
  left: 50%;
  bottom: 24px;
  transform: translateX(-50%);
  margin-top: 16px;
  overflow: hidden;
}

.profile-detail {
  padding: 12px;
  border-radius: 8px;
  background-color: rgb(0 0 0 / 40%);
  color: #fff;
}

.profile-name {
  display: block;
  font-weight: 600;
  margin-bottom: 4px;
  color: #fff;
}

.profile-desc {
  margin: 0;
  font-size: 14px;
  line-height: 1.4;
  color: var(--color-text-secondary);
}

.wrapper {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  transform: translateY(100%);
  opacity: 0;
  transition: transform 0.3s ease, opacity 0.3s ease;
}

.profile-quote {
  padding: 12px;
  border-radius: 8px;
  background-color: var(--color-secondary-bg);
  border: 1px solid var(--color-primary-bg);
}

.quote-text {
  margin: 0;
  font-size: 14px;
  line-height: 1.4;
  color: var(--color-text);
}

.profile-card:hover .wrapper {
  transform: translateY(0);
  opacity: 1;
}

.play-btn {
  margin-top: 8px;
  padding: 6px 12px;
  border-radius: 6px;
  border: none;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  background-color: var(--color-primary-bg);
  color: var(--color-primary);
  display: none;
}

.play-btn:hover {
  opacity: 0.9;
}

.video-modal {
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
}

.video-backdrop {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
}

.video-dialog {
  position: relative;
  z-index: 1;
  width: 90%;
  max-width: 900px;
  border-radius: 16px;
  overflow: hidden;
  background: #000;
}

.video-close {
  position: absolute;
  top: 8px;
  right: 8px;
  z-index: 2;
  border: none;
  background: rgba(0, 0, 0, 0.5);
  color: #fff;
  border-radius: 50%;
  width: 28px;
  height: 28px;
  cursor: pointer;
}

.video {
  width: 100%;
  max-height: 80vh;
  background: #000;
}

.video .plyr {
  width: 100%;
}

.video .plyr__video-wrapper video {
  object-fit: contain;
}

@media (max-width: 768px) {
  .explore-container {
    padding: 16px 12px;
  }

  .category-container {
    flex-direction: column;
    gap: 16px;
  }
}
</style>
