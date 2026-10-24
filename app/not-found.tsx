import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center space-y-4">
        <h1 className="text-4xl font-extrabold text-cyan-400">404</h1>
        <h2 className="text-xl font-bold">الصفحة غير موجودة</h2>
        <p className="text-slate-400 text-sm">
          الصفحة التي تبحث عنها قد تم نقلها أو أنها غير متوفرة حالياً.
        </p>
        <Link
          href="/"
          className="inline-block px-6 py-2.5 bg-gradient-to-r from-cyan-400 to-blue-500 text-slate-950 font-bold rounded-xl text-sm"
        >
          العودة للرئيسية
        </Link>
      </div>
    </div>
  );
}
