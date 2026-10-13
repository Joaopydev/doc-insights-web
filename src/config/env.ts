import z from 'zod';

const schema = z.object({
  VITE_DOC_INSIGHTS_API: z.url(),
  VITE_WEBSCOKET_END_POINT: z.url(),
});

const parsedEnv = schema.parse(import.meta.env);

export const env = {
  api: {
    url: parsedEnv.VITE_DOC_INSIGHTS_API,
    websocketEndPoint: parsedEnv.VITE_WEBSCOKET_END_POINT,
  },
};