'use client'

import Image from 'next/image'

export default function CompletePage() {
  const handleClose = () => {
    if (typeof window !== 'undefined') {
      window.close()
      // タブが閉じられない場合（直接開いた場合など）はトップページに戻る
      setTimeout(() => {
        window.location.href = '/'
      }, 100)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-4 md:py-12 px-4">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-4 md:p-8">
        {/* ロゴ */}
        <div className="flex justify-center mb-3 md:mb-8">
          <Image 
            src="/elm_logo.png" 
            alt="ELM CLINIC" 
            width={400} 
            height={160} 
            className="object-contain w-40 md:w-full max-w-[192px] md:max-w-none"
          />
        </div>

        {/* タイトル */}
        <div className="text-center mb-3 md:mb-6">
          <h1 className="text-lg md:text-4xl font-bold mb-2 md:mb-6 text-black leading-tight md:leading-normal">
            ご回答いただき、
            <br className="md:hidden" />
            ありがとうございます。
          </h1>
          <p className="text-xs md:text-lg text-gray-700 leading-relaxed px-2 md:px-0">
            いただいた内容をもとに、
            <br className="md:hidden" />
            今後ともサービス向上につとめさせていただきます。
          </p>
        </div>

        {/* 閉じるボタン */}
        <div className="text-center mt-3 md:mt-8">
          <button
            onClick={handleClose}
            className="inline-block px-4 py-2 md:px-6 md:py-3 bg-pink-300 text-black rounded-lg hover:bg-pink-400 transition-colors font-medium text-xs md:text-base"
          >
            閉じる
          </button>
        </div>
      </div>
    </div>
  )
}

