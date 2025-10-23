/**
 * 基礎使用範例
 */

import { LogCenterClient } from '../src';

// 初始化客戶端
const logger = new LogCenterClient({
  baseUrl: 'http://localhost:3000',
  application: 'example-app',
  environment: 'local',
  version: '1.0.0',
  debug: true, // 啟用 debug 模式
});

async function main() {
  console.log('========================================');
  console.log('Log Center SDK - 基礎使用範例');
  console.log('========================================\n');

  try {
    // 1. 發送一般日誌
    console.log('1. 發送一般日誌...');
    const generalResult = await logger.general({
      type: 'example',
      level: 'info',
      message: '這是一個測試日誌',
    });
    console.log('✅ General Log ID:', generalResult.data.id);
    console.log('');

    // 2. 發送 API 日誌
    console.log('2. 發送 API 日誌...');
    const apiResult = await logger.api({
      direction: 'IN',
      domain: 'api.example.com',
      path: '/api/v1/users',
      request_method: 'GET',
      client_ip: '192.168.1.100',
      status_code: 200,
      execution_time: 0.052,
    });
    console.log('✅ API Log ID:', apiResult.data.id);
    console.log('');

    // 3. 發送管理日誌
    console.log('3. 發送管理日誌...');
    const adminResult = await logger.admin({
      module_id: 1,
      module_name: 'UserManagement',
      action: 'VIEW',
      admin_id: 1,
      admin_name: 'Admin',
      ip: '192.168.1.100',
    });
    console.log('✅ Admin Log ID:', adminResult.data.id);
    console.log('');

    // 4. 發送電子郵件日誌
    console.log('4. 發送電子郵件日誌...');
    const emailResult = await logger.email({
      title: 'Test Email',
      content: '<p>This is a test email</p>',
      sender_email: 'noreply@example.com',
      recipient_email: 'user@example.com',
    });
    console.log('✅ Email Log ID:', emailResult.data.id);
    console.log('');

    // 5. 發送 WhatsApp 日誌
    console.log('5. 發送 WhatsApp 日誌...');
    const whatsappResult = await logger.whatsapp({
      recipient_phone: '+85298765432',
      recipient_name: 'Test User',
      message_content: 'Hello from WhatsApp!',
      whatsapp_provider: 'twilio',
    });
    console.log('✅ WhatsApp Log ID:', whatsappResult.data.id);
    console.log('');

    // 6. 發送推送通知日誌
    console.log('6. 發送推送通知日誌...');
    const pushResult = await logger.pushNotification({
      title: '測試通知',
      body: '這是一個測試推送通知',
      platform: 'ios',
      device_type: 'mobile',
      push_provider: 'fcm',
    });
    console.log('✅ Push Notification Log ID:', pushResult.data.id);
    console.log('');

    console.log('========================================');
    console.log('✅ 所有日誌發送成功！');
    console.log('========================================');
  } catch (error) {
    console.error('❌ 錯誤:', (error as Error).message);
    process.exit(1);
  }
}

main();

