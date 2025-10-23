# Log Center Node.js SDK

Log Center 的官方 Node.js SDK，提供完整的 TypeScript 支援和 Express.js 整合。

## 🚀 快速開始

### 安裝

```bash
npm install @log-center/nodejs-sdk
```

### 基本使用

```typescript
import { LogCenterClient } from '@log-center/nodejs-sdk';

const logger = new LogCenterClient({
  baseUrl: 'http://localhost:3000',
  application: 'my-app',
  environment: 'production',
});

// 發送一般日誌
await logger.general({
  type: 'database',
  level: 'info',
  message: 'Database connected successfully',
});

// 發送 API 日誌
await logger.api({
  direction: 'IN',
  domain: 'api.example.com',
  request_method: 'POST',
  client_ip: '192.168.1.100',
  status_code: 200,
  execution_time: 0.125,
});
```

## 📋 支援的日誌類型

- **General Log**: 一般應用程式日誌
- **API Log**: API 請求/回應日誌
- **Admin Log**: 管理後台操作日誌
- **Email Log**: 電子郵件發送日誌
- **WhatsApp Log**: WhatsApp 消息發送日誌
- **Push Notification Log**: 推送通知日誌

## 🔧 配置選項

```typescript
interface LogCenterConfig {
  baseUrl: string;           // Log Center API 基礎 URL
  application: string;       // 應用程式名稱
  environment?: string;      // 環境 (local/staging/production)
  version?: string;          // 應用版本
  timeout?: number;         // 請求超時時間 (毫秒)
  enableRetry?: boolean;    // 啟用自動重試
  maxRetries?: number;      // 最大重試次數
  retryDelay?: number;      // 重試延遲 (毫秒)
  debug?: boolean;          // 啟用除錯模式
}
```

## 📚 範例

查看 `examples/` 目錄中的完整範例：

- `basic-usage.ts` - 基本使用方式
- `batch-logging.ts` - 批次日誌發送
- `express-integration.ts` - Express.js 整合
- `push-notification-integration.ts` - 推送通知整合
- `whatsapp-integration.ts` - WhatsApp 整合

## 🧪 測試

```bash
npm test
```

## 📄 授權

ISC
