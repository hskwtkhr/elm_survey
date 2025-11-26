export default function CompletePage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-8 text-center">
        <h1 className="text-3xl font-bold mb-4">アンケートありがとうございました</h1>
        <p className="text-lg text-gray-600 mb-8">
          ご回答いただいた内容は、今後のサービス向上に活用させていただきます。
        </p>
        <a
          href="/"
          className="inline-block px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          トップページに戻る
        </a>
      </div>
    </div>
  )
}

