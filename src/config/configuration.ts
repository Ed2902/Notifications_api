const parseBoolean = (value: string): boolean =>
  ['true', '1', 'yes', 'on'].includes(value.toLowerCase());

const parseNumber = (value: string): number => Number(value);

const parseOptionalNumber = (value: string | undefined): number | undefined =>
  value ? Number(value) : undefined;

const parseOrigins = (
  value: string | undefined,
  credentials: boolean,
): string[] | boolean => {
  if (!value) {
    return false;
  }

  if (value === '*') {
    if (credentials) {
      throw new Error(
        'CORS_ORIGINS="*" cannot be used with CORS_CREDENTIALS=true',
      );
    }

    return true;
  }

  return value
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);
};

const parseCsv = (value: string): string[] =>
  value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);

const parseTrustProxy = (): false | number | string => {
  if (!parseBoolean(process.env.TRUST_PROXY as string)) {
    return false;
  }

  const trustedCidrs = parseCsv(process.env.TRUST_PROXY_CIDRS ?? '').join(',');
  if (trustedCidrs) {
    return trustedCidrs;
  }

  return parseOptionalNumber(process.env.TRUST_PROXY_HOPS) ?? 1;
};

export default () => {
  const corsCredentials = parseBoolean(process.env.CORS_CREDENTIALS as string);

  return {
  app: {
    name: process.env.APP_NAME as string,
    env: process.env.NODE_ENV as string,
    port: parseNumber(process.env.PORT as string),
    apiPrefix: process.env.API_PREFIX as string,
    trustProxy: parseTrustProxy(),
    timeZone: process.env.APP_TIME_ZONE as string,
  },
  cors: {
    origin: parseOrigins(process.env.CORS_ORIGINS, corsCredentials),
    credentials: corsCredentials,
    methods: parseCsv(process.env.CORS_METHODS as string),
    allowedHeaders: parseCsv(process.env.CORS_ALLOWED_HEADERS as string),
    exposedHeaders: parseCsv(process.env.CORS_EXPOSED_HEADERS as string),
  },
  logger: {
    level: process.env.LOG_LEVEL as string,
    prettyPrint: parseBoolean(process.env.LOG_PRETTY_PRINT as string),
  },
  database: {
    url: process.env.DATABASE_URL as string,
  },
  redis: {
    url: process.env.REDIS_URL as string,
  },
  queue: {
    prefix: process.env.QUEUE_PREFIX as string,
  },
  auth: {
    accessTokenSecret: process.env.AUTH_ACCESS_TOKEN_SECRET as string,
  },
  identity: {
    baseUrl: process.env.IDENTITY_BASE_URL?.trim() || undefined,
  },
  notifications: {
    internalToken: process.env.NOTIFICATIONS_INTERNAL_TOKEN?.trim() || undefined,
    expoAccessToken: process.env.EXPO_ACCESS_TOKEN?.trim() || undefined,
    expoPushApiUrl:
      process.env.EXPO_PUSH_API_URL?.trim() ||
      'https://exp.host/--/api/v2/push/send',
    pushTimeoutMs: parseOptionalNumber(process.env.EXPO_PUSH_TIMEOUT_MS) ?? 12000,
  },
  rateLimit: {
    ttl: parseNumber(process.env.RATE_LIMIT_TTL as string),
    limit: parseNumber(process.env.RATE_LIMIT_LIMIT as string),
    sensitiveTtl: parseNumber(process.env.SENSITIVE_RATE_LIMIT_TTL as string),
    sensitiveLimit: parseNumber(process.env.SENSITIVE_RATE_LIMIT_LIMIT as string),
  },
  };
};
