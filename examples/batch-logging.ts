/**
 * 批次發送範例
 */

import { LogCenterClient } from '../src';

const logger = new LogCenterClient({
  baseUrl: 'http://localhost:3000',
  application: 'batch-example',
  environment: 'local',
});

async function main() {
  console.log('========================================');
  console.log('批次發送範例');
  console.log('========================================\n');

  console.log('發送多個日誌...');

  const results = await logger.batch([
    {
      type: 'general',
      options: {
        type: 'app-start',
        level: 'info',
        message: 'Application started',
      },
    },
    {
      type: 'api',
      options: {
        direction: 'IN',
        domain: 'api.example.com',
        path: '/health',
        request_method: 'GET',
        client_ip: '127.0.0.1',
        status_code: 200,
      },
    },
    {
      type: 'whatsapp',
      options: {
        recipient_phone: '+85298765432',
        message_content: 'Batch test message',
        whatsapp_provider: 'twilio',
      },
    },
    {
      type: 'push',
      options: {
        title: 'Batch Test',
        body: 'This is a batch test notification',
        platform: 'android',
      },
    },
  ]);

  console.log(`\n✅ 成功發送 ${results.length} 個日誌`);
  results.forEach((result, index) => {
    console.log(`   ${index + 1}. ${result.data.id}`);
  });

  console.log('\n========================================');
}

main().catch(console.error);

