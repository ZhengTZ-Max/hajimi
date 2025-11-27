import request from '@/utils/request';

export function getBlobFiles(prefix) {
  return request({
    url: '/api/blobs',
    method: 'get',
    params: {
      prefix,
    },
  });
}
