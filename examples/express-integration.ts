/**
 * Express.js 整合範例
 */

import express from 'express';
import { LogCenterClient } from '../src';

const app = express();
app.use(express.json());

// 初始化 Log Center 客戶端
const logger = new LogCenterClient({
  baseUrl: process.env.LOG_CENTER_URL || 'http://localhost:3000',
  application: 'express-example',
  environment: (process.env.NODE_ENV as any) || 'local',
  version: '1.0.0',
});

// API 日誌中介軟體
app.use(async (req, res, next) => {
  const startTime = Date.now();

  // 記錄原始的 res.json
  const originalJson = res.json.bind(res);
  let responseBody: any;

  res.json = function (body: any) {
    responseBody = body;
    return originalJson(body);
  };

  // 等待回應完成
  res.on('finish', async () => {
    const executionTime = (Date.now() - startTime) / 1000;

    // 非同步發送日誌（不阻塞）
    logger.api({
      direction: 'IN',
      domain: req.hostname,
      path: req.path,
      request_method: req.method,
      client_ip: req.ip || req.socket.remoteAddress || '127.0.0.1',
      status_code: res.statusCode,
      execution_time: executionTime,
      request_header: JSON.stringify(req.headers),
      request_body: req.body ? JSON.stringify(req.body) : undefined,
      response_body: responseBody ? JSON.stringify(responseBody) : undefined,
    }).catch(err => {
      console.error('Failed to send API log:', err.message);
    });
  });

  next();
});

// 路由範例
app.get('/users', (req, res) => {
  res.json({ users: [{ id: 1, name: 'John' }] });
});

app.post('/users', async (req, res) => {
  // 業務邏輯
  const user = { id: 123, ...req.body };

  // 發送一般日誌
  logger.general({
    type: 'user-created',
    level: 'info',
    message: `User created: ${user.id}`,
  }).catch(err => console.error('Log failed:', err));

  res.json(user);
});

// 錯誤處理中介軟體
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  // 記錄錯誤
  logger.general({
    type: 'express-error',
    level: 'error',
    message: err.message,
    trace: err.stack,
  }).catch(logErr => console.error('Failed to log error:', logErr));

  res.status(500).json({ error: 'Internal Server Error' });
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Express server running on port ${PORT}`);
  console.log('Try: curl http://localhost:3001/users');
});

