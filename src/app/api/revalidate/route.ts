/**
 * src/app/api/revalidate/route.ts
 *
 * On-demand ISR revalidation webhook.
 *
 * The NestJS CMS calls this endpoint (with a secret header) whenever content
 * is published/updated, so the Next.js frontend re-fetches fresh data without
 * waiting for the 60-second ISR poll.
 *
 * CMS call example (from NestJS CMS after a content update):
 *   POST /api/revalidate
 *   Authorization: Bearer <REVALIDATE_SECRET>
 *   Content-Type: application/json
 *   { "path": "/" }   — revalidate the home page
 *   { "paths": ["/", "/about"] }  — revalidate multiple paths
 *   { "tag": "cms-data" }         — revalidate by cache tag (future)
 */

import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath, revalidateTag } from 'next/cache';

const VALID_SECRET = process.env.REVALIDATE_SECRET ?? '';

/**
 * POST /api/revalidate
 *
 * Body (all fields optional):
 *   - path   string   — revalidate a single path  (e.g. "/" or "/about")
 *   - paths  string[] — revalidate multiple paths
 *   - tag    string   — revalidate all entries with this Next.js cache tag
 *
 * Returns 200 on success, 401 on bad secret, 400 on bad body.
 */
export async function POST(req: NextRequest) {
  // Validate secret
  const authHeader = req.headers.get('authorization') ?? '';
  const token = authHeader.replace(/^Bearer\s+/i, '').trim();
  if (!VALID_SECRET || token !== VALID_SECRET) {
    return NextResponse.json(
      { error: 'Invalid or missing revalidation secret' },
      { status: 401 },
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const b = body as Record<string, unknown>;

  // Single path
  if (typeof b.path === 'string') {
    revalidatePath(b.path);
    return NextResponse.json({ revalidated: true, path: b.path });
  }

  // Multiple paths
  if (Array.isArray(b.paths)) {
    const paths = b.paths.filter((p): p is string => typeof p === 'string');
    paths.forEach((p) => revalidatePath(p));
    return NextResponse.json({ revalidated: true, paths });
  }

  // Cache tag
  if (typeof b.tag === 'string') {
    revalidateTag(b.tag);
    return NextResponse.json({ revalidated: true, tag: b.tag });
  }

  // Default: revalidate home page
  revalidatePath('/');
  return NextResponse.json({ revalidated: true, path: '/' });
}

/**
 * GET /api/revalidate — health-check endpoint (no auth required).
 */
export async function GET() {
  return NextResponse.json({
    ok: true,
    message: 'Revalidation endpoint active. Use POST with Authorization header.',
  });
}
