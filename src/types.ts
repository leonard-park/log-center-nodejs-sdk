/**
 * Log Center SDK 類型定義
 */

/**
 * 環境類型
 */
export type Environment = 'local' | 'staging' | 'production';

/**
 * 日誌級別
 */
export type LogLevel = 'debug' | 'info' | 'warning' | 'error' | 'critical';

/**
 * API 方向
 */
export type ApiDirection = 'IN' | 'OUT';

/**
 * 平台類型
 */
export type Platform = 'ios' | 'android' | 'web';

/**
 * 設備類型
 */
export type DeviceType = 'mobile' | 'web' | 'tablet';

/**
 * 基礎日誌選項
 */
export interface BaseLogOptions {
  application: string;
  environment?: Environment;
  version?: string;
  sdk_version?: string;
  server_name?: string;
  server_ip?: string;
  trace_id?: string;
}

/**
 * 一般日誌選項
 */
export interface GeneralLogOptions extends BaseLogOptions {
  type: string;
  level?: LogLevel;
  name?: string;
  message: string;
  trace?: string;
}

/**
 * API 日誌選項
 */
export interface ApiLogOptions extends BaseLogOptions {
  direction: ApiDirection;
  domain: string;
  path?: string;
  request_id?: string;
  request_method: string;
  request_header?: string;
  request_body?: string;
  response_header?: string;
  response_body?: string;
  execution_time?: number;
  status_code?: number;
  error_code?: string;
  message?: string;
  retry_times?: number;
  retry_status?: number;
  session_id?: string;
  user_id?: number;
  client_ip: string;
}

/**
 * 管理日誌選項
 */
export interface AdminLogOptions extends BaseLogOptions {
  module_id: number;
  module_name?: string;
  action: string;
  action_info?: string;
  action_data?: string;
  return_data?: string;
  ref_id?: number;
  admin_id: number;
  admin_name?: string;
  ip: string;
  path?: string;
  execution_time?: number;
}

/**
 * 電子郵件日誌選項
 */
export interface EmailLogOptions extends BaseLogOptions {
  code?: string;
  session_id?: string;
  sender_user_id?: number;
  recipient_user_id?: number;
  title: string;
  content: string;
  attachment_path?: string;
  sender_email: string;
  sender_email_name?: string;
  recipient_email: string;
  recipient_email_name?: string;
  cc_email?: string;
  cc_email_name?: string;
  bcc_email?: string;
  bcc_email_name?: string;
  api_response?: string;
  is_error?: boolean;
  mail_driver?: string;
}

/**
 * WhatsApp 日誌選項
 */
export interface WhatsAppLogOptions extends BaseLogOptions {
  message_id?: string;
  template_name?: string;
  template_language?: string;
  recipient_phone: string;
  recipient_name?: string;
  message_content?: string;
  media_url?: string;
  whatsapp_provider?: string;
  api_response?: string;
  is_error?: boolean;
  error_code?: string;
  error_message?: string;
  session_id?: string;
  user_id?: number;
}

/**
 * 推送通知日誌選項
 */
export interface PushNotificationLogOptions extends BaseLogOptions {
  notification_id?: string;
  title: string;
  body: string;
  image_url?: string;
  deep_link?: string;
  device_token?: string;
  device_type?: DeviceType;
  platform?: Platform;
  topic?: string;
  data_payload?: string;
  push_provider?: string;
  api_response?: string;
  is_error?: boolean;
  error_code?: string;
  error_message?: string;
  session_id?: string;
  user_id?: number;
}

/**
 * SDK 配置選項
 */
export interface LogCenterConfig {
  /** Log Center API URL */
  baseUrl: string;
  /** 應用程式名稱（會作為所有日誌的預設值） */
  application: string;
  /** 環境（會作為所有日誌的預設值） */
  environment?: Environment;
  /** 應用版本 */
  version?: string;
  /** SDK 版本（自動設置） */
  sdk_version?: string;
  /** 伺服器名稱 */
  server_name?: string;
  /** 伺服器 IP */
  server_ip?: string;
  /** 請求超時（毫秒） */
  timeout?: number;
  /** 啟用自動重試 */
  enableRetry?: boolean;
  /** 最大重試次數 */
  maxRetries?: number;
  /** 重試延遲（毫秒） */
  retryDelay?: number;
  /** 啟用 debug 日誌 */
  debug?: boolean;
}

/**
 * API 回應格式
 */
export interface LogResponse {
  status: number;
  data: {
    id: string;
  };
}

