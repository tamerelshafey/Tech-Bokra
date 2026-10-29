'use client';

import React from 'react';

export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="ar" dir="rtl">
      <body className="bg-[#071120] text-slate-100 flex items-center justify-center min-h-screen font-sans">
        <div className="text-center p-8 max-w-md mx-auto">
          <h2 className="text-xl font-bold mb-4 text-white">حدث خطأ تقني غير متوقع</h2>
          <p className="text-sm text-slate-400 mb-6">يرجى المحاولة مرة أخرى أو تحديث الصفحة.</p>
          <button
            onClick={() => reset()}
            className="px-5 py-2.5 bg-[#00F2FE] text-[#071120] font-bold rounded-xl hover:bg-sky-400 transition"
          >
            إعادة المحاولة
          </button>
        </div>
      </body>
    </html>
  );
}
