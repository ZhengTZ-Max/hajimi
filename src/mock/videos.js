/* eslint-disable linebreak-style */
// 本地模拟视频数据
// 字段：视频地址 url、缩略图 coverUrl、简介 description、标题 title、播放量 playCount、点赞 likeCount、转发 shareCount、时长 duration(秒)

export const mockPlaylists = [
  {
    id: 1,
    name: '示例视频合集',
    description: '这是一个本地模拟的视频合集，用于开发和展示界面。',
    coverUrl:
      'https://p2.music.126.net/UeTuwE7pvjBpypWLudqukA==/3132508627578625.jpg',
    videos: [
      {
        id: 101,
        title: '城市延时摄影 City Timelapse',
        url: 'https://example.com/video/city-timelapse.mp4',
        coverUrl:
          'https://p2.music.126.net/UeTuwE7pvjBpypWLudqukA==/3132508627578625.jpg',
        description: '夜晚城市车流与灯光的延时摄影演示。',
        playCount: 123456,
        likeCount: 2345,
        shareCount: 120,
        duration: 180,
      },
      {
        id: 102,
        title: '海边日出 Sea Sunrise',
        url: 'https://example.com/video/sea-sunrise.mp4',
        coverUrl:
          'https://p1.music.126.net/8uU2R3c9E4mRZQ5nJQz2WA==/109951163785981441.jpg',
        description: '清晨海平线日出的延时摄影。',
        playCount: 98765,
        likeCount: 3210,
        shareCount: 88,
        duration: 240,
      },
      {
        id: 103,
        title: '航拍山脉 Aerial Mountains',
        url: 'https://example.com/video/aerial-mountains.mp4',
        coverUrl:
          'https://p1.music.126.net/vdcLtI0v18L3rxR0tZIvYg==/109951163785979003.jpg',
        description: '无人机航拍雪山与峡谷的混剪。',
        playCount: 54321,
        likeCount: 1500,
        shareCount: 60,
        duration: 210,
      },
    ],
  },
];

// 根据 id 获取模拟视频合集
export function getMockPlaylistById(id) {
  const found = mockPlaylists.find(p => p.id === Number(id));
  return (
    found ||
    mockPlaylists[0] || {
      id,
      name: '本地模拟视频合集',
      description: '未找到指定 ID，使用默认模拟数据。',
      coverUrl:
        'https://p2.music.126.net/UeTuwE7pvjBpypWLudqukA==/3132508627578625.jpg',
      videos: [],
    }
  );
}

// 将视频对象转换为兼容 TrackListItem 的 track 结构
export function mapVideoToTrack(video) {
  return {
    // 保持现有组件依赖的字段
    id: video.id,
    name: video.title,
    al: { picUrl: video.coverUrl },
    dt: (video.duration || 0) * 1000, // 毫秒
    playCount: video.playCount,
    // 额外元信息，后续可以在其他组件中使用
    _videoMeta: {
      url: video.url,
      description: video.description,
      likeCount: video.likeCount,
      shareCount: video.shareCount,
      duration: video.duration,
    },
  };
}
