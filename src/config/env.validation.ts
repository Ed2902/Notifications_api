import * as Joi from 'joi';

export const envValidationSchema = Joi.object({
  APP_NAME: Joi.string().trim().required(),
  NODE_ENV: Joi.string()
    .valid('development', 'test', 'production')
    .required(),
  PORT: Joi.number().port().required(),
  API_PREFIX: Joi.string().trim().required(),
  TRUST_PROXY: Joi.boolean().required(),
  TRUST_PROXY_HOPS: Joi.number().integer().min(1).max(10).optional(),
  TRUST_PROXY_CIDRS: Joi.string().trim().allow('').optional(),
  APP_TIME_ZONE: Joi.string().trim().required(),
  CORS_ORIGINS: Joi.string()
    .allow('')
    .required(),
  CORS_CREDENTIALS: Joi.boolean().required(),
  CORS_METHODS: Joi.string().trim().required(),
  CORS_ALLOWED_HEADERS: Joi.string().trim().required(),
  CORS_EXPOSED_HEADERS: Joi.string().trim().required(),
  LOG_LEVEL: Joi.string()
    .valid('fatal', 'error', 'warn', 'info', 'debug', 'trace', 'silent')
    .required(),
  LOG_PRETTY_PRINT: Joi.boolean().required(),
  DATABASE_URL: Joi.string().trim().required(),
  REDIS_URL: Joi.string().trim().required(),
  QUEUE_PREFIX: Joi.string().trim().required(),
  AUTH_ACCESS_TOKEN_SECRET: Joi.string().min(16).required(),
  IDENTITY_BASE_URL: Joi.string()
    .uri({ scheme: ['http', 'https'] })
    .allow('')
    .optional(),
  NOTIFICATIONS_INTERNAL_TOKEN: Joi.string().min(16).required(),
  EXPO_ACCESS_TOKEN: Joi.string().allow('').optional(),
  EXPO_PUSH_API_URL: Joi.string()
    .uri({ scheme: ['http', 'https'] })
    .allow('')
    .optional(),
  EXPO_PUSH_TIMEOUT_MS: Joi.number().positive().optional(),
  RATE_LIMIT_TTL: Joi.number().positive().required(),
  RATE_LIMIT_LIMIT: Joi.number().positive().required(),
  SENSITIVE_RATE_LIMIT_TTL: Joi.number().positive().required(),
  SENSITIVE_RATE_LIMIT_LIMIT: Joi.number().positive().required(),
});
