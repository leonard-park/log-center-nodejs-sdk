import axios, { AxiosInstance, AxiosError } from 'axios';
import * as os from 'os';
import {
  LogCenterConfig,
  LogResponse,
  BaseLogOptions,
  GeneralLogOptions,
  ApiLogOptions,
  AdminLogOptions,
  EmailLogOptions,
  WhatsAppLogOptions,
  PushNotificationLogOptions,
} from './types';

/**
 * Log Center SDK 客戶端
 * 
 * @example
 * ```typescript
 * const client = new LogCenterClient({
 *   baseUrl: 'http://localhost:3000',
 *   application: 'my-app',
 *   environment: 'production',
 * });
 * 
 * await client.general({
 *   type: 'database',
 *   message: 'Database connected successfully',
 * });
 * ```
 */
export class LogCenterClient {
  private readonly client: AxiosInstance;
  private readonly config: Required<LogCenterConfig>;
  private readonly packageVersion = '1.0.0';

  constructor(config: LogCenterConfig) {
    // 設置預設配置
    this.config = {
      baseUrl: config.baseUrl,
      application: config.application,
      environment: config.environment || 'local',
      version: config.version || '1.0.0',
      sdk_version: config.sdk_version || `log-center-sdk-nodejs/${this.packageVersion}`,
      server_name: config.server_name || os.hostname(),
      server_ip: config.server_ip || this.getLocalIp(),
      timeout: config.timeout || 5000,
      enableRetry: config.enableRetry !== false,
      maxRetries: config.maxRetries || 3,
      retryDelay: config.retryDelay || 1000,
      debug: config.debug || false,
    };

    // 創建 axios 實例
    this.client = axios.create({
      baseURL: this.config.baseUrl,
      timeout: this.config.timeout,
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': this.config.sdk_version,
      },
    });

    // 添加請求攔截器
    this.client.interceptors.request.use(
      (config) => {
        if (this.config.debug) {
          console.log('[LogCenter SDK] Request:', {
            url: config.url,
            method: config.method,
            data: config.data,
          });
        }
        return config;
      },
      (error) => {
        if (this.config.debug) {
          console.error('[LogCenter SDK] Request Error:', error);
        }
        return Promise.reject(error);
      },
    );

    // 添加回應攔截器
    this.client.interceptors.response.use(
      (response) => {
        if (this.config.debug) {
          console.log('[LogCenter SDK] Response:', response.data);
        }
        return response;
      },
      (error) => {
        if (this.config.debug) {
          console.error('[LogCenter SDK] Response Error:', error.message);
        }
        return Promise.reject(error);
      },
    );
  }

  /**
   * 獲取本地 IP 地址
   */
  private getLocalIp(): string {
    const interfaces = os.networkInterfaces();
    for (const name of Object.keys(interfaces)) {
      const iface = interfaces[name];
      if (iface) {
        for (const alias of iface) {
          if (alias.family === 'IPv4' && !alias.internal) {
            return alias.address;
          }
        }
      }
    }
    return '127.0.0.1';
  }

  /**
   * 合併配置（用戶提供的選項 + 全域預設值）
   */
  private mergeConfig<T extends BaseLogOptions>(options: Partial<T>): T {
    return {
      application: this.config.application,
      environment: this.config.environment,
      version: this.config.version,
      sdk_version: this.config.sdk_version,
      server_name: this.config.server_name,
      server_ip: this.config.server_ip,
      ...options,
    } as T;
  }

  /**
   * 發送請求（帶重試機制）
   */
  private async sendWithRetry<T>(
    endpoint: string,
    data: any,
  ): Promise<LogResponse> {
    let lastError: Error | null = null;
    const maxAttempts = this.config.enableRetry ? this.config.maxRetries : 1;

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        const response = await this.client.post<LogResponse>(endpoint, data);
        return response.data;
      } catch (error) {
        lastError = error as Error;

        if (this.config.debug) {
          console.error(
            `[LogCenter SDK] Attempt ${attempt}/${maxAttempts} failed:`,
            (error as AxiosError).message,
          );
        }

        // 如果不是最後一次嘗試，等待後重試
        if (attempt < maxAttempts) {
          const delay = this.config.retryDelay * attempt; // 線性退避
          if (this.config.debug) {
            console.log(`[LogCenter SDK] Retrying in ${delay}ms...`);
          }
          await this.sleep(delay);
        }
      }
    }

    // 所有重試都失敗
    throw new Error(
      `Failed to send log after ${maxAttempts} attempts: ${lastError?.message}`,
    );
  }

  /**
   * 延遲函數
   */
  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  /**
   * 寫入一般應用程式日誌
   */
  async general(options: Omit<GeneralLogOptions, keyof BaseLogOptions> & Partial<BaseLogOptions>): Promise<LogResponse> {
    const data = this.mergeConfig<GeneralLogOptions>({
      ...options,
      level: options.level || 'info',
      name: options.name || 'log',
    } as GeneralLogOptions);

    return this.sendWithRetry('/log-center/general-log', data);
  }

  /**
   * 寫入 API 日誌
   */
  async api(options: Omit<ApiLogOptions, keyof BaseLogOptions> & Partial<BaseLogOptions>): Promise<LogResponse> {
    const data = this.mergeConfig<ApiLogOptions>(options as ApiLogOptions);
    return this.sendWithRetry('/log-center/api-log', data);
  }

  /**
   * 寫入管理後台操作日誌
   */
  async admin(options: Omit<AdminLogOptions, keyof BaseLogOptions> & Partial<BaseLogOptions>): Promise<LogResponse> {
    const data = this.mergeConfig<AdminLogOptions>(options as AdminLogOptions);
    return this.sendWithRetry('/log-center/admin-log', data);
  }

  /**
   * 寫入電子郵件日誌
   */
  async email(options: Omit<EmailLogOptions, keyof BaseLogOptions> & Partial<BaseLogOptions>): Promise<LogResponse> {
    const data = this.mergeConfig<EmailLogOptions>({
      ...options,
      is_error: options.is_error || false,
    } as EmailLogOptions);
    return this.sendWithRetry('/log-center/email-log', data);
  }

  /**
   * 寫入 WhatsApp 發送日誌
   */
  async whatsapp(options: Omit<WhatsAppLogOptions, keyof BaseLogOptions> & Partial<BaseLogOptions>): Promise<LogResponse> {
    const data = this.mergeConfig<WhatsAppLogOptions>({
      ...options,
      is_error: options.is_error || false,
    } as WhatsAppLogOptions);
    return this.sendWithRetry('/log-center/whatsapp-log', data);
  }

  /**
   * 寫入推送通知日誌
   */
  async pushNotification(options: Omit<PushNotificationLogOptions, keyof BaseLogOptions> & Partial<BaseLogOptions>): Promise<LogResponse> {
    const data = this.mergeConfig<PushNotificationLogOptions>({
      ...options,
      is_error: options.is_error || false,
    } as PushNotificationLogOptions);
    return this.sendWithRetry('/log-center/push-notification-log', data);
  }

  /**
   * 批次發送日誌（更高效）
   */
  async batch(logs: Array<{
    type: 'general' | 'api' | 'admin' | 'email' | 'whatsapp' | 'push';
    options: any;
  }>): Promise<LogResponse[]> {
    const promises = logs.map((log) => {
      switch (log.type) {
        case 'general':
          return this.general(log.options);
        case 'api':
          return this.api(log.options);
        case 'admin':
          return this.admin(log.options);
        case 'email':
          return this.email(log.options);
        case 'whatsapp':
          return this.whatsapp(log.options);
        case 'push':
          return this.pushNotification(log.options);
        default:
          throw new Error(`Unknown log type: ${log.type}`);
      }
    });

    return Promise.all(promises);
  }

  /**
   * 獲取當前配置
   */
  getConfig(): Readonly<Required<LogCenterConfig>> {
    return { ...this.config };
  }
}

