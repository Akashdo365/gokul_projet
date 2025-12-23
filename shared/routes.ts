import { z } from 'zod';
import { insertUserSchema, insertScanLogSchema, insertEmergencyLogSchema, users, scanLogs, emergencyLogs } from './schema';

export * from './schema';

export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  notFound: z.object({
    message: z.string(),
  }),
  internal: z.object({
    message: z.string(),
  }),
};

export const api = {
  user: {
    get: {
      method: 'GET' as const,
      path: '/api/user/profile',
      responses: {
        200: z.custom<typeof users.$inferSelect>(),
        404: errorSchemas.notFound,
      },
    },
    update: {
      method: 'POST' as const,
      path: '/api/user/profile',
      input: insertUserSchema,
      responses: {
        200: z.custom<typeof users.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
  },
  ai: {
    detectObject: {
      method: 'POST' as const,
      path: '/api/detect-object',
      input: z.object({
        image: z.string(), // Base64 image
      }),
      responses: {
        200: z.object({
          objects: z.array(z.object({ name: z.string(), confidence: z.number() })),
        }),
        500: errorSchemas.internal,
      },
    },
    readText: {
      method: 'POST' as const,
      path: '/api/read-text',
      input: z.object({
        image: z.string(), // Base64 image
      }),
      responses: {
        200: z.object({
          text: z.string(),
        }),
        500: errorSchemas.internal,
      },
    },
    detectCurrency: {
      method: 'POST' as const,
      path: '/api/detect-currency',
      input: z.object({
        image: z.string(), // Base64 image
      }),
      responses: {
        200: z.object({
          value: z.number(),
          currency: z.string(),
        }),
        500: errorSchemas.internal,
      },
    },
  },
  emergency: {
    trigger: {
      method: 'POST' as const,
      path: '/api/emergency/trigger',
      input: insertEmergencyLogSchema,
      responses: {
        200: z.object({ success: z.boolean(), message: z.string() }),
        500: errorSchemas.internal,
      },
    },
  },
  logs: {
    list: {
      method: 'GET' as const,
      path: '/api/scan-history',
      responses: {
        200: z.array(z.custom<typeof scanLogs.$inferSelect>()),
      },
    },
  },
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}
