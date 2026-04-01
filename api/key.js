export const config = { runtime: 'edge' };

export default function handler() {
  const key = process.env.AISSTREAM_API_KEY;
  if (!key) return new Response('Missing AISSTREAM_API_KEY', { status: 500 });
  return new Response(JSON.stringify({ key }), {
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' }
  });
}
