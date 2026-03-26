import { auth } from '@/lib/auth/auth';
import { toNextJsHandler } from 'better-auth/next-js';

const handler = toNextJsHandler(auth);

export async function POST(req: Request) {
  console.log('[Auth POST]', req.url); // ดูว่า request เข้ามาไหม
  const res = await handler.POST(req);
  console.log('[Auth POST] Status:', res.status); // ดู response status
  return res;
}

export const GET = handler.GET;