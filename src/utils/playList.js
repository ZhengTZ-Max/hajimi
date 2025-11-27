import router from '../router';
import state from '../store/state';
import {
  recommendPlaylist,
  dailyRecommendPlaylist,
  getPlaylistDetail,
} from '@/api/playlist';

export function hasListSource() {
  return !state.player.isPersonalFM && state.player.playlistSource.id !== 0;
}

export function goToListSource() {
  router.push({ path: getListSourcePath() });
}

export function getListSourcePath() {
  if (state.player.playlistSource.id === state.data.likedSongPlaylistID) {
    return '/library/liked-songs';
  } else if (state.player.playlistSource.type === 'url') {
    return state.player.playlistSource.id;
  } else if (state.player.playlistSource.type === 'cloudDisk') {
    return '/library';
  } else {
    return `/${state.player.playlistSource.type}/${state.player.playlistSource.id}`;
  }
}



async function replaceRecommendResult(recommend) {
  for (let r of recommend) {
    if (specialPlaylist.indexOf(r.id) > -1) {
      const data = await getPlaylistDetail(r.id, true);
      const playlist = data.playlist;
      if (playlist) {
        r.name = playlist.name;
        r.picUrl = playlist.coverImgUrl;
      }
    }
  }
}

const specialPlaylist = [3136952023, 2829883282, 2829816518, 2829896389];
