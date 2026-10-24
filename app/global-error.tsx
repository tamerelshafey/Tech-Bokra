'use client';

export const dynamic = 'force-dynamic';

export default function GlobalError({
  error: _error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="ar" dir="rtl">
      <body>
        <div style={{ padding: '2rem', textAlign: 'center', fontFamily: 'sans-serif' }}>
          <h2>حدث خطأ غير متوقع</h2>
          <button 
            type="button"
            onClick={() => reset()} 
            style={{ marginTop: '1rem', padding: '0.5rem 1.5rem', cursor: 'pointer' }}
          >
            إعادة المحاولة
          </button>
        </div>
      </body>
    </html>
  );
}
