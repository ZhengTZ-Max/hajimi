import { list } from '@vercel/blob';

export default async function handler(req, res) {
  // 只允许 GET
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    const { prefix = '' } = req.query || {};

    // 规范化 prefix，确保以 / 结尾
    let normalizedPrefix = prefix || '';
    if (normalizedPrefix && !normalizedPrefix.endsWith('/')) {
      normalizedPrefix += '/';
    }

    const { blobs, cursor } = await list({
      prefix: normalizedPrefix,
      // 推荐在 Vercel 环境变量中配置 VERCEL_BLOB_RW_TOKEN
      token: process.env.VERCEL_BLOB_RW_TOKEN,
    });

    return res.status(200).json({
      success: true,
      blobs,
      cursor,
    });
  } catch (error) {
    console.error('Blob list error:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Unknown error',
    });
  }
}


