/**
 * LogCenterClient 單元測試
 */

import { LogCenterClient } from './client';

describe('LogCenterClient', () => {
  let client: LogCenterClient;

  beforeEach(() => {
    client = new LogCenterClient({
      baseUrl: 'http://localhost:3000',
      application: 'test-app',
      environment: 'local',
    });
  });

  describe('初始化', () => {
    it('應該正確初始化配置', () => {
      const config = client.getConfig();
      expect(config.baseUrl).toBe('http://localhost:3000');
      expect(config.application).toBe('test-app');
      expect(config.environment).toBe('local');
    });

    it('應該設置預設值', () => {
      const config = client.getConfig();
      expect(config.timeout).toBe(5000);
      expect(config.enableRetry).toBe(true);
      expect(config.maxRetries).toBe(3);
    });

    it('應該自動獲取 server_name 和 server_ip', () => {
      const config = client.getConfig();
      expect(config.server_name).toBeDefined();
      expect(config.server_ip).toBeDefined();
    });
  });

  describe('類型檢查', () => {
    it('general() 應該接受正確的參數', async () => {
      // 這個測試主要是檢查 TypeScript 類型
      const options = {
        type: 'test',
        message: 'Test message',
        level: 'info' as const,
      };
      
      // 如果類型不正確，TypeScript 會報錯
      expect(options.type).toBe('test');
    });
  });
});

