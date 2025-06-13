// server/api/image.ts

export default defineEventHandler(async (event) => {
    const url = getQuery(event).url as string;

    if (!url || !url.startsWith('http://127.0.0.1:8000')) {
        throw createError({ statusCode: 400, statusMessage: 'Invalid image URL' });
    }

    const res = await fetch(url);

    if (!res.ok) {
        throw createError({ statusCode: res.status, statusMessage: res.statusText });
    }

    const contentType = res.headers.get('content-type') || 'image/jpeg';
    const buffer = await res.arrayBuffer();

    setHeader(event, 'Content-Type', contentType);
    return new Uint8Array(buffer);
});
