/**
 * 推送通知整合範例（使用 FCM）
 */

import { LogCenterClient } from '../src';

// 模擬 Firebase Admin SDK
class MockFirebaseMessaging {
  async send(message: any) {
    // 模擬 API 調用
    return `projects/myproject/messages/${Math.random().toString(36).substring(2)}`;
  }
}

const messaging = new MockFirebaseMessaging();
const logger = new LogCenterClient({
  baseUrl: 'http://localhost:3000',
  application: 'push-notification-service',
  environment: 'local',
});

/**
 * 發送推送通知並記錄日誌
 */
async function sendPushNotification(options: {
  token: string;
  title: string;
  body: string;
  platform: 'ios' | 'android' | 'web';
  imageUrl?: string;
  deepLink?: string;
  data?: Record<string, string>;
}) {
  console.log(`發送推送通知到 ${options.platform} 設備...`);

  try {
    // 發送推送
    const messageId = await messaging.send({
      token: options.token,
      notification: {
        title: options.title,
        body: options.body,
        imageUrl: options.imageUrl,
      },
      data: options.data,
      webpush: options.deepLink ? {
        fcmOptions: {
          link: options.deepLink,
        },
      } : undefined,
    });

    console.log('✅ 推送發送成功:', messageId);

    // 記錄成功日誌
    await logger.pushNotification({
      title: options.title,
      body: options.body,
      platform: options.platform,
      device_type: 'mobile',
      device_token: options.token,
      notification_id: messageId,
      image_url: options.imageUrl,
      deep_link: options.deepLink,
      data_payload: options.data ? JSON.stringify(options.data) : undefined,
      push_provider: 'fcm',
      is_error: false,
    });

    return messageId;
  } catch (error) {
    console.error('❌ 推送發送失敗:', (error as Error).message);

    // 記錄失敗日誌
    await logger.pushNotification({
      title: options.title,
      body: options.body,
      platform: options.platform,
      device_token: options.token,
      push_provider: 'fcm',
      is_error: true,
      error_code: (error as any).code || 'UNKNOWN',
      error_message: (error as Error).message,
    });

    throw error;
  }
}

// 測試
async function main() {
  console.log('========================================');
  console.log('推送通知整合範例');
  console.log('========================================\n');

  // iOS 推送
  await sendPushNotification({
    token: 'ios-device-token-123',
    title: '您有新訂單！',
    body: '訂單 #12345 已確認',
    platform: 'ios',
    deepLink: 'myapp://orders/12345',
    data: { order_id: '12345', type: 'new_order' },
  });

  console.log('');

  // Android 推送
  await sendPushNotification({
    token: 'android-device-token-456',
    title: '限時優惠',
    body: '全場商品 8 折',
    platform: 'android',
    imageUrl: 'https://example.com/promo.jpg',
  });

  console.log('\n所有推送已發送！');
}

main().catch(console.error);

