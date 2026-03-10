'use client'

import { useEffect, useState, useRef } from 'react'
import { useSearchParams, useParams } from 'next/navigation'
import Image from 'next/image'

export default function ReviewPage() {
  const params = useParams()
  const searchParams = useSearchParams()
  const clinicId = params.clinicId as string
  const surveyId = searchParams.get('surveyId')

  const [reviewText, setReviewText] = useState<string>('')
  const [googleReviewUrl, setGoogleReviewUrl] = useState<string>('')
  const [rewardTitle, setRewardTitle] = useState<string>('')
  const [rewardDescription, setRewardDescription] = useState<string>('')
  const [isLoading, setIsLoading] = useState(true)
  const [isCopied, setIsCopied] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    // clinicIdからGoogleマップのURLを取得
    fetch(`/api/clinics`)
      .then((res) => res.json())
      .then((clinics) => {
        const clinic = clinics.find((c: any) => c.id === clinicId)
        if (clinic) {
          setGoogleReviewUrl(clinic.google_review_url)
          setRewardTitle(clinic.rewardTitle || '🎁 Googleの口コミ投稿いただいた方に、コスメプレゼント！')
          setRewardDescription(clinic.rewardDescription || '※投稿画面を受付でご提示ください。')
        } else {
          setError('院が見つかりません')
          setIsLoading(false)
          return
        }

        // surveyIdがある場合のみ口コミ文を生成
        if (surveyId) {
          fetch('/api/review', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ surveyId }),
          })
            .then((res) => res.json())
            .then((data) => {
              if (data.error) {
                setError(data.error)
              } else {
                setReviewText(data.reviewText)
              }
            })
            .catch((err) => {
              console.error('Error generating review:', err)
              setError('口コミ文の生成に失敗しました')
            })
            .finally(() => {
              setIsLoading(false)
            })
        } else {
          // surveyIdがない場合は、直接Googleマップを開くオプションを表示
          setIsLoading(false)
        }
      })
      .catch((err) => {
        console.error('Error fetching clinic:', err)
        setError('院情報の取得に失敗しました')
        setIsLoading(false)
      })
  }, [clinicId, surveyId])

  // reviewTextが変更されたときにtextareaの高さを自動調整
  useEffect(() => {
    if (textareaRef.current && reviewText) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px'
    }
  }, [reviewText])

  const handleCopyAndGoToReview = async () => {
    try {
      // 現在のreviewText（編集後のテキスト）をコピー
      await navigator.clipboard.writeText(reviewText)
      setIsCopied(true)
      setTimeout(() => setIsCopied(false), 2000)

      // 少し遅延してからGoogleレビューページを開く
      setTimeout(() => {
        if (googleReviewUrl) {
          window.open(googleReviewUrl, '_blank')
        }
      }, 500)
    } catch (err) {
      console.error('Failed to copy:', err)
      alert('コピーに失敗しました')
      // コピーに失敗してもレビューページは開く
      if (googleReviewUrl) {
        window.open(googleReviewUrl, '_blank')
      }
    }
  }

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl p-8 max-w-sm w-full mx-4 shadow-2xl flex flex-col items-center">
          <div className="w-16 h-16 mb-4">
            <svg className="animate-spin w-full h-full text-pink-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
          <p className="text-lg font-bold text-gray-800">送信中...</p>
          <p className="text-sm text-gray-500 mt-2 text-center">
            AIが口コミ文章を生成しています。<br />
            画面が切り替わるまでお待ちください。
          </p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-4 md:py-12 px-4">
        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-4 md:p-8 text-center">
          <h1 className="text-lg md:text-2xl font-bold text-red-600 mb-3 md:mb-4">エラー</h1>
          <p className="text-sm md:text-lg text-gray-600 mb-4 md:mb-8">{error}</p>
          <a
            href="/"
            className="inline-block px-4 py-2 md:px-6 md:py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm md:text-base"
          >
            トップページに戻る
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-4 md:py-12 px-4">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-4 md:p-8">
        {/* アンケート送信ありがとうございました（ロゴの上） */}
        <div className="text-center" style={{ marginTop: '10px', marginBottom: '20px' }}>
          <p className="text-lg md:text-2xl text-gray-700 font-medium" style={{ fontFamily: 'var(--font-shippori-mincho)' }}>
            アンケートの送信
            <br className="md:hidden" />
            ありがとうございました。
          </p>
        </div>

        {/* ロゴ */}
        <div className="flex justify-center" style={{ marginBottom: '20px' }}>
          <Image src="/elm_logo.png" alt="ELM CLINIC" width={400} height={160} className="object-contain w-64 md:w-full" />
        </div>

        {/* メッセージ */}
        <div className="mb-4 md:mb-6 text-center">
          {/* プレゼント画像 */}
          {(rewardTitle + rewardDescription).match(/プレゼント|進呈/) && (
            <div className="flex justify-center mb-3">
              <Image src="/present.webp" alt="プレゼント" width={120} height={120} className="object-contain" />
            </div>
          )}
          <div className="bg-pink-100 text-pink-700 font-bold py-3 md:py-4 px-4 md:px-6 rounded-lg mb-4 inline-block border-2 border-pink-300 shadow-sm transform hover:scale-105 transition-transform duration-300">
            <div className="text-lg md:text-2xl mb-1 whitespace-pre-line break-keep">
              {rewardTitle}
            </div>
            <div className="text-xs md:text-sm font-normal text-pink-600 whitespace-pre-line">
              {rewardDescription}
            </div>
          </div>
          <p className="text-base md:text-xl text-gray-700 mb-2 md:mb-3 font-bold">Googleへの口コミにもご協力ください。</p>
          <p className="text-xs md:text-sm text-gray-700 leading-relaxed md:leading-loose">
            アンケート結果を元に、AIで文章を生成しました。
            <br />
            もし良ければ、下記ボタンを押して、Googleの口コミにご協力ください。
            <br />
            <span className="text-pink-600 font-bold">※ボタンを押すと文章が自動的にコピーされますので、<br className="md:hidden" />口コミの入力欄に貼り付けてください。</span>
          </p>
        </div>

        {reviewText ? (
          <>
            <div className="mb-4 md:mb-6">
              <div className="bg-pink-50 border-2 border-pink-200 rounded-lg p-3 md:p-6 mb-3 md:mb-6">
                <textarea
                  ref={textareaRef}
                  value={reviewText}
                  onChange={(e) => {
                    setReviewText(e.target.value)
                    // 高さを自動調整
                    e.target.style.height = 'auto'
                    e.target.style.height = e.target.scrollHeight + 'px'
                  }}
                  className="w-full bg-transparent text-black whitespace-pre-wrap leading-relaxed md:leading-[2.2] text-sm md:text-base border-none outline-none resize-none focus:ring-0 focus:outline-none"
                  style={{
                    fontFamily: 'inherit',
                    minHeight: '150px',
                    maxHeight: 'none',
                    overflow: 'hidden',
                    scrollbarWidth: 'none',
                    msOverflowStyle: 'none',
                  }}
                  rows={10}
                />
              </div>

              {googleReviewUrl && (
                <button
                  onClick={async () => {
                    await handleCopyAndGoToReview()
                    // クリック数をカウント
                    try {
                      await fetch(`/api/clinics/${clinicId}/click`, { method: 'POST' })
                    } catch (err) {
                      console.error('Failed to track click:', err)
                    }
                  }}
                  className={`w-full px-4 py-3 md:px-8 md:py-4 rounded-full font-bold text-sm md:text-lg transition-all transform hover:scale-105 active:scale-95 shadow-xl border-0 ${isCopied
                    ? 'bg-green-400 text-white'
                    : 'bg-pink-500 text-white hover:bg-pink-600'
                    }`}
                >
                  {isCopied ? (
                    <span className="flex flex-col items-center justify-center gap-2">
                      <span>✓</span>
                      <span>
                        コピーしました！<br className="md:hidden" />Google口コミページを開きます
                      </span>
                    </span>
                  ) : (
                    <div className="flex items-center justify-center gap-4">
                      <div className="flex flex-col items-center justify-center gap-1">
                        <span className="text-xl">⭐️⭐️⭐️⭐️⭐️</span>
                        <span>
                          文章をコピー ＆ <br className="md:hidden" />Google口コミページを開く
                        </span>
                      </div>
                      <div className="bg-white text-pink-500 rounded-full w-8 h-8 flex items-center justify-center shadow-sm shrink-0">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                        </svg>
                      </div>
                    </div>
                  )}
                </button>
              )}
            </div>
          </>
        ) : (
          <div className="mb-6">
            {googleReviewUrl && (
              <button
                onClick={async () => {
                  window.open(googleReviewUrl, '_blank')
                  // クリック数をカウント
                  try {
                    await fetch(`/api/clinics/${clinicId}/click`, { method: 'POST' })
                  } catch (err) {
                    console.error('Failed to track click:', err)
                  }
                }}
                className="w-full px-4 py-3 md:px-8 md:py-4 rounded-full font-bold text-sm md:text-lg bg-pink-500 text-white hover:bg-pink-600 transition-all transform hover:scale-105 active:scale-95 shadow-lg"
              >
                <span className="flex items-center justify-center gap-2">
                  <span>🌟</span>
                  <span>Google口コミページを開く</span>
                </span>
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

