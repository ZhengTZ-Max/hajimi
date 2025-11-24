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
        “哈基米”的故事始于一部动漫中的一个片段：
        <br />
        <br />
        来源：在动漫《赛马娘 Pretty
        Derby》第二季（2021年）第12集中，角色东海贞夫在购买蜂蜜饮料时哼唱着“哈基米”（hachimitsu）。这段时长仅8秒的短视频，迅速在日本社交媒体平台
        Niconico 上走红。其朗朗上口的 C
        大调循环旋律，加上引人注目的视觉对比（偶像身着赛马服享用甜饮），获得了
        300 万的点击量。
      </p>
      <p>
        重要改编：2022年11月，中国Bilibili
        UP（内容创作者）“东桥刹那”将东海贞夫的哼唱与《CLANNAD》的背景音乐融合，创作出了标志性的“哈基米”混音版。也正式开启了中国对哈基米文化的解构时代！他公开邀请用户将这首歌与猫咪视频、cosplay内容等结合，引发了一波用户原创内容（UGC）热潮。这一改编作品成为经典，仅在Bilibili平台上就获得了超过800万的播放量。
      </p>
      <p>
        语义演变：最初只是“蜂蜜”的音译，它迅速演变为全球公认的可爱象征。到2023年，哈基米”的含义已经超越了其最初的内涵，成为可爱动物、温馨瞬间乃至日常快乐的代名词。
      </p>

      <h4>二、突破时刻：中国进行哈基米文化解构的阶段</h4>
      <p
        >哈基米
        的崛起并非偶然——它经历了三个截然不同的阶段，每个阶段都以破纪录的数据为标志：</p
      >
      <ul>
        <li>
          <strong>1. 核心发酵期（2021–2022）：</strong>从小众市场到病毒式传播
          <br />
          <br />
          平台基础： Niconico（300 万浏览量）和 Bilibili（超过 800
          万浏览量）奠定了基础。
          文化萌芽：这一趋势最初引起了动漫和猫咪爱好者的共鸣，并建立起忠实的粉丝群体，推动了其未来的发展。
          <br>
          <br>
        </li>
        <li>
          <strong>2. 主流突破期（2023–至今）：称霸短视频平台</strong>
          <br />
          <br />
          TikTok 横扫：TikTok（抖音的中国版）上的 #哈基米 话题标签仅2023年获得了
          13亿次观看，截止到 2025
          年已超过280亿次。中国各大网络平台的总观看量达到数千亿次，日均观看量持续增长数亿次。微信关键词指数每日徘徊在
          1 亿次上下位列最高。73% 的内容都聚焦于可爱的宠物——这证明猫咪和 哈基米
          是天作之合。社交媒体饱和：微信上每天发送的 哈基米 主题表情超过 2000
          万个，而小红书（Instagram 的中国版）上与 哈基米 相关的帖子数量高达
          1000 万条，评论数量更是惊人，达到 16 亿条。
          <br />
          <br />
          跨平台传播：哈基米 迅速登陆
          YouTube，其“哈基米音乐”合辑视频爆红网络，让 哈基米 为西方观众所熟知。
          <br>
          <br>
        </li>
        <li>
          <strong>3. 语义扩展（2024-2025）：从“可爱”到“生活方式”</strong
          >内容多元化：“哈基米”的含义不再局限于宠物视频，而是扩展到音乐、奶茶、手办等多个领域。一段以游戏《原神》中的八重巫女为主角的“哈基米”混音视频播放量突破1亿。
          <br />
          <br />
          2025年，“哈基米”文化蓬勃发展，成功解构到“音乐时代”。仅2025年一年，就有数千首歌曲被改编成“哈基米”音乐，全球数十万“国民制作人”孜孜不倦地创作并上传自己的作品。这种“哈基米”文化解构的趋势一直延续至今。
          <br />
          <br />
          文化认可：“哈基米”被列入Z世代社交媒体白皮书十大热门词汇之一。
        </li>
      </ul>

      <h4>三、全球流行度的证据：数据胜于雄辩</h4>
      <p>为了量化哈基米的全球影响力，以下事实不容置疑：</p>
      <ul>
        <li>
          <strong>1. 东西方社交媒体的主导地位</strong>
          <br />
          <br />
          抖音（中国）：截至2025年11月23日，仅在抖音上，“#哈基米”的搜索量就超过258亿次，用户超过198.4万，并且搜索量仍在以每天以亿次搜索的速度持续增长。
          <br />
          <br />
          TikTok：#哈基米 及其相关话题标签（#hajimi #hachimi #hakimi
          #哈基米）在西方累计播放量超过 50 亿次，其中 40%
          的内容来自中国以外地区。
          <br />
          <br />
          YouTube：包含 #哈基米 及其相关话题标签（#hajimi #hachimi #hakimi
          #哈基米）的视频累计播放量超过 23 亿次，其中包括 300
          多个英文教程视频（例如，“什么是 哈基米？热门表情符号指南”）。
          <br />
          <br />
          Bilibili：核心 哈基米 内容累计播放量超过 50 亿次，用户原创内容 (UGC)
          超过 15 万条。
          <br />
          <br />
          搜索趋势：自“哈基米”表情符号走红以来，字母“H”的搜索量也随之增加。
          <br />
          目前，西方主流社交媒体正日益被 哈基米
          文化所主导，这标志着互联网文化的一次重大转变。
          <br>
          <br>
        </li>
        <li>
          <strong>2. 商业和经济影响</strong>
          <br />
          <br />
          品牌合作：此外，日本饮料公司优衣库推出了“Hakimi”主题饮品，宠物用品品牌也将该表情符号融入到营销活动中。
          <br />
          搜索趋势：自从“哈基米”网络文化符号走红以来，字母“H”的搜索量也随之增加。
          <br />
          <br />
          2025年11月，中国公司九阳推出“哈基米”豆奶，引爆市场。预售仅两天就突破200万瓶，推动其股价飙升。随后，众多公司纷纷推出“哈基米”品牌产品，涵盖食品和电子产品，网络游戏等领域，包括腾讯公司旗下的QQ音乐平台，该平台也在同月推出了“哈基米”AI音乐创作挑战赛。这一商业趋势仍在持续。

          <br />
          <br />
          商业化：淘宝上“哈基米耳朵”宠物饰品的月销量突破10万件。优衣库与Pop
          Mart旗下品牌DIMOO合作，推出以哈基米为灵感的UT系列，并在中国七个城市举办快闪活动，创下销售纪录。

          <br /><br />
        </li>
        <li>
          <strong>3. 持续的创意与“哈基米文化”市场</strong>
          <br />
          <br />
          中国数十万视频和音乐创作者每天制作各种与“哈基米”相关的内容（表情符号、视频、音乐），不断为“哈基米”文化注入活力和人气。可靠数据显示，在Instagram、TikTok和YouTube等主流西方社交媒体平台上，与“哈基米”相关的创作者数量和搜索量正呈指数级增长。
        </li>
      </ul>
      <p>
        哈基米web3社区欢迎世界各地的喜爱互联网文化的成员加入我们，共同构见证Web2和Web3之间史诗般的文化变革与互通。♥️
      </p>
      <p class="note">
        *注：由于“哈基米”的英文翻译与其本地发音存在差异，网络上常用的标签有：哈基米、Hakimi或Hachimi。这三个标签均可用于搜索与“Hakimi”相关的内容。♥️
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
          videoUrl: '/video/1.mp4',
          cover:
            'https://i0.hdslb.com/bfs/archive/1a0fc5a3fa155a52ed412ecdcfda6c2fcac3eded.jpg@672w_378h_1c.avif',
        },
        {
          label: '《哈基米编年史》 第二集',
          desc: '萌宠解构',
          videoUrl: '/video/2.mp4',
          cover:
            'https://i0.hdslb.com/bfs/archive/18ae55000ae595186985c558b3170c1b37172fe8.jpg@672w_378h_1c.avif',
        },
        {
          label: '《哈基米编年史》 第三集',
          desc: '音符与猫咪解构',
          videoUrl: '/video/3.mp4',
          cover:
            'https://i0.hdslb.com/bfs/archive/628e3f5bd5eff412fd33a4e02ef8cf9d61ac908d.jpg@672w_378h_1c.avif',
        },
        {
          label: '《哈基米编年史》第四集',
          desc: '一杯水，一只猫，一个时代，即是万物。',
          videoUrl: '/video/4.mp4',
          cover:
            'https://i0.hdslb.com/bfs/archive/dafec852a872a2213569af3107b7d431192d1008.jpg@672w_378h_1c.avif',
        },
      ],
    };
  },
  methods: {
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
      window.open('https://space.bilibili.com/9353567');
    },
  },
};
</script>

<style lang="scss" scoped>
.explore-container {
  box-sizing: border-box;
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
    padding: 44px 12px 16px 12px;
  }

  .category-container {
    flex-direction: column;
    gap: 16px;
  }
}
</style>
