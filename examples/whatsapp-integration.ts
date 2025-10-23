/**
 * WhatsApp 整合範例（使用 Twilio）
 */

import { LogCenterClient } from '../src';

// 模擬 Twilio 客戶端
class MockTwilioClient {
  async sendMessage(to: string, message: string) {
    // 模擬 API 調用
    return {
      sid: `SM${Math.random().toString(36).substring(2, 15)}`,
      status: 'sent',
      to,
      body: message,
    };
  }
}

const twilioClient = new MockTwilioClient();
const logger = new LogCenterClient({
  baseUrl: 'http://localhost:3000',
  application: 'whatsapp-service',
  environment: 'local',
});

/**
 * 發送 WhatsApp 消息並記錄日誌
 */
async function sendWhatsAppMessage(
  phone: string,
  message: string,
  templateName?: string,
) {
  console.log(`發送 WhatsApp 到 ${phone}...`);

  try {
    // 發送 WhatsApp
    const response = await twilioClient.sendMessage(phone, message);

    console.log('✅ WhatsApp 發送成功:', response.sid);

    // 記錄成功日誌
    await logger.whatsapp({
      recipient_phone: phone,
      message_content: message,
      template_name: templateName,
      message_id: response.sid,
      whatsapp_provider: 'twilio',
      api_response: JSON.stringify(response),
      is_error: false,
    });

    return response;
  } catch (error) {
    console.error('❌ WhatsApp 發送失敗:', (error as Error).message);

    // 記錄失敗日誌
    await logger.whatsapp({
      recipient_phone: phone,
      message_content: message,
      template_name: templateName,
      whatsapp_provider: 'twilio',
      is_error: true,
      error_code: (error as any).code || 'UNKNOWN',
      error_message: (error as Error).message,
      api_response: JSON.stringify((error as any).response?.data),
    });

    throw error;
  }
}

// 測試
async function main() {
  console.log('========================================');
  console.log('WhatsApp 整合範例');
  console.log('========================================\n');

  // 發送訂單確認消息
  await sendWhatsAppMessage(
    '+85298765432',
    'Your order #12345 has been confirmed!',
    'order_confirmation',
  );

  console.log('\n所有消息已發送！');
}

main().catch(console.error);

