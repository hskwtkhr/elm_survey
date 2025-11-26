export const metadata = {
  title: '管理マニュアル - ELM CLINIC アンケートサイト',
  description: 'エルムクリニック アンケートサイトの管理マニュアル',
}

export default function ManualPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8 md:p-12">
        <h1 className="text-3xl md:text-4xl font-bold mb-8 text-black">エルムクリニック アンケートサイト 管理マニュアル</h1>

        <nav className="mb-8 pb-6 border-b-2 border-gray-200">
          <h2 className="text-xl font-bold mb-4 text-black">目次</h2>
          <ol className="list-decimal list-inside space-y-2 text-black">
            <li><a href="#access" className="text-blue-600 hover:underline">ダッシュボードへのアクセス</a></li>
            <li><a href="#features" className="text-blue-600 hover:underline">ダッシュボードの機能</a></li>
            <li><a href="#view" className="text-blue-600 hover:underline">アンケート結果の確認</a></li>
            <li><a href="#edit" className="text-blue-600 hover:underline">アンケート結果の編集・削除</a></li>
            <li><a href="#export" className="text-blue-600 hover:underline">データのエクスポート</a></li>
            <li><a href="#change" className="text-blue-600 hover:underline">アンケート項目の変更について</a></li>
          </ol>
        </nav>

        <section id="access" className="mb-12">
          <h2 className="text-2xl md:text-3xl font-bold mb-6 text-black border-b-2 border-gray-300 pb-2">1. ダッシュボードへのアクセス</h2>
          
          <h3 className="text-xl font-bold mb-4 mt-6 text-black">ログイン方法</h3>
          <ol className="list-decimal list-inside space-y-3 mb-6 text-black">
            <li>ブラウザで以下のURLにアクセス：
              <div className="ml-6 mt-2 p-4 bg-gray-100 rounded-lg">
                <code className="text-sm">https://elm-survey.vercel.app/login</code>
                <br />
                <span className="text-gray-600">または</span>
                <br />
                <code className="text-sm">https://elm-survey.vercel.app/dashboard</code>
                <br />
                <span className="text-gray-600 text-sm">（未ログインの場合は自動的にログインページにリダイレクトされます）</span>
              </div>
            </li>
            <li>ログイン情報を入力：
              <ul className="list-disc list-inside ml-6 mt-2 space-y-1">
                <li><strong>ユーザー名</strong>: <code className="bg-gray-100 px-2 py-1 rounded">admin</code></li>
                <li><strong>パスワード</strong>: <code className="bg-gray-100 px-2 py-1 rounded">MyZvAj7rabFaSinjop</code></li>
              </ul>
            </li>
            <li>「ログイン」ボタンをクリック</li>
            <li>ログイン成功後、ダッシュボードページが表示されます</li>
          </ol>
        </section>

        <section id="features" className="mb-12">
          <h2 className="text-2xl md:text-3xl font-bold mb-6 text-black border-b-2 border-gray-300 pb-2">2. ダッシュボードの機能</h2>
          
          <div className="space-y-8">
            <div>
              <h3 className="text-xl font-bold mb-4 text-black">1. 統計情報</h3>
              <p className="mb-3 text-black">ダッシュボードの上部に、以下の統計情報が表示されます：</p>
              <ul className="list-disc list-inside space-y-2 ml-4 text-black">
                <li><strong>総回答数</strong>: これまでに収集されたアンケートの総数</li>
                <li><strong>大変満足</strong>: 「大変満足」と回答した人数</li>
                <li><strong>満足</strong>: 「満足」と回答した人数</li>
                <li><strong>対象院数</strong>: アンケートが収集された院の数</li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-bold mb-4 text-black">2. フィルタリング機能</h3>
              <div className="space-y-4">
                <div>
                  <p className="font-bold mb-2 text-black">院ごとの絞り込み</p>
                  <ul className="list-disc list-inside space-y-1 ml-4 text-black">
                    <li>「院を選択」ドロップダウンから、特定の院を選択</li>
                    <li>「すべて」を選択すると、全院のデータが表示されます</li>
                  </ul>
                </div>
                <div>
                  <p className="font-bold mb-2 text-black">日付指定</p>
                  <ul className="list-disc list-inside space-y-1 ml-4 text-black">
                    <li>「開始日」と「終了日」を指定して、期間を絞り込めます</li>
                    <li>カレンダーアイコンをクリックして日付を選択</li>
                    <li>日付を指定しない場合は、全期間のデータが表示されます</li>
                  </ul>
                </div>
                <div>
                  <p className="font-bold mb-2 text-black">リセット</p>
                  <p className="ml-4 text-black">「リセット」ボタンをクリックすると、すべてのフィルタが解除されます</p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-bold mb-4 text-black">3. グラフ表示</h3>
              <p className="mb-3 text-black">以下の4つのグラフが表示されます：</p>
              <ol className="list-decimal list-inside space-y-2 ml-4 text-black">
                <li><strong>満足度グラフ</strong>: 満足度別の回答数の円グラフ</li>
                <li><strong>施術メニューグラフ</strong>: 施術メニュー別の回答数の円グラフ</li>
                <li><strong>年齢層グラフ</strong>: 年齢層別の回答数の円グラフ</li>
                <li><strong>院別グラフ</strong>: 院別の回答数の円グラフ</li>
              </ol>
              <p className="mt-3 text-black">各グラフは、フィルタリング条件に応じて自動的に更新されます。</p>
            </div>

            <div>
              <h3 className="text-xl font-bold mb-4 text-black">4. データテーブル</h3>
              <p className="mb-3 text-black">アンケート結果の一覧が表形式で表示されます。</p>
              <div className="space-y-3">
                <div>
                  <p className="font-bold mb-2 text-black">表示項目:</p>
                  <ul className="list-disc list-inside space-y-1 ml-4 text-black">
                    <li>記入日時</li>
                    <li>院名</li>
                    <li>先生名</li>
                    <li>施術日</li>
                    <li>施術メニュー</li>
                    <li>性別</li>
                    <li>年齢層</li>
                    <li>満足度</li>
                    <li>操作（編集・削除ボタン）</li>
                  </ul>
                </div>
                <div>
                  <p className="font-bold mb-2 text-black">ページネーション:</p>
                  <ul className="list-disc list-inside space-y-1 ml-4 text-black">
                    <li>1ページあたり20件表示</li>
                    <li>ページ下部の「前へ」「次へ」ボタンでページを移動</li>
                    <li>現在のページ番号と総ページ数が表示されます</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="view" className="mb-12">
          <h2 className="text-2xl md:text-3xl font-bold mb-6 text-black border-b-2 border-gray-300 pb-2">3. アンケート結果の確認</h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-bold mb-4 text-black">基本的な確認方法</h3>
              <ol className="list-decimal list-inside space-y-2 ml-4 text-black">
                <li>ダッシュボードにログイン</li>
                <li>統計情報で全体の傾向を把握</li>
                <li>グラフで視覚的にデータを確認</li>
                <li>データテーブルで個別の回答を確認</li>
              </ol>
            </div>

            <div>
              <h3 className="text-xl font-bold mb-4 text-black">特定の院のデータを確認する</h3>
              <ol className="list-decimal list-inside space-y-2 ml-4 text-black">
                <li>「院を選択」ドロップダウンから、確認したい院を選択</li>
                <li>統計情報、グラフ、データテーブルが自動的に更新されます</li>
              </ol>
            </div>

            <div>
              <h3 className="text-xl font-bold mb-4 text-black">特定の期間のデータを確認する</h3>
              <ol className="list-decimal list-inside space-y-2 ml-4 text-black">
                <li>「開始日」と「終了日」を指定</li>
                <li>指定した期間内のデータのみが表示されます</li>
              </ol>
            </div>
          </div>
        </section>

        <section id="edit" className="mb-12">
          <h2 className="text-2xl md:text-3xl font-bold mb-6 text-black border-b-2 border-gray-300 pb-2">4. アンケート結果の編集・削除</h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-bold mb-4 text-black">編集方法</h3>
              <ol className="list-decimal list-inside space-y-2 ml-4 text-black">
                <li>データテーブルで、編集したいアンケート結果の行の「編集」ボタンをクリック</li>
                <li>編集モーダルが開きます</li>
                <li>以下の項目を編集できます：
                  <ul className="list-disc list-inside space-y-1 ml-6 mt-2">
                    <li>院名</li>
                    <li>先生名</li>
                    <li>施術日</li>
                    <li>施術メニュー</li>
                    <li>性別</li>
                    <li>年齢層</li>
                    <li>満足度</li>
                  </ul>
                </li>
                <li>編集内容を確認して「保存」ボタンをクリック</li>
                <li>「キャンセル」ボタンで編集をキャンセルできます</li>
              </ol>
            </div>

            <div>
              <h3 className="text-xl font-bold mb-4 text-black">削除方法</h3>
              <ol className="list-decimal list-inside space-y-2 ml-4 text-black">
                <li>データテーブルで、削除したいアンケート結果の行の「削除」ボタンをクリック</li>
                <li>確認ダイアログが表示されます</li>
                <li>「OK」をクリックすると削除されます</li>
                <li><strong>注意</strong>: 削除したデータは復元できません</li>
              </ol>
            </div>
          </div>
        </section>

        <section id="export" className="mb-12">
          <h2 className="text-2xl md:text-3xl font-bold mb-6 text-black border-b-2 border-gray-300 pb-2">5. データのエクスポート</h2>
          
          <div>
            <h3 className="text-xl font-bold mb-4 text-black">CSVエクスポート</h3>
            <ol className="list-decimal list-inside space-y-2 ml-4 text-black">
              <li>ダッシュボード上部の「CSVエクスポート」ボタンをクリック</li>
              <li>現在のフィルタリング条件に基づいて、CSVファイルがダウンロードされます</li>
              <li>ファイル名は <code className="bg-gray-100 px-2 py-1 rounded">survey_export_YYYY-MM-DD.csv</code> の形式です</li>
            </ol>

            <div className="mt-4">
              <p className="font-bold mb-2 text-black">エクスポートされるデータ:</p>
              <ul className="list-disc list-inside space-y-1 ml-4 text-black">
                <li>記入日時</li>
                <li>院名</li>
                <li>先生名</li>
                <li>施術日</li>
                <li>施術メニュー</li>
                <li>性別</li>
                <li>年齢層</li>
                <li>満足度</li>
                <li>結果への満足度</li>
                <li>カウンセリングへの満足度</li>
                <li>院内の雰囲気</li>
                <li>スタッフの対応</li>
                <li>伝えたいこと（メッセージ）</li>
              </ul>
            </div>

            <div className="mt-4">
              <p className="font-bold mb-2 text-black">フィルタリングとの連携:</p>
              <ul className="list-disc list-inside space-y-1 ml-4 text-black">
                <li>院を選択している場合、その院のデータのみエクスポート</li>
                <li>日付を指定している場合、その期間のデータのみエクスポート</li>
                <li>フィルタをリセットしてからエクスポートすると、全データがエクスポートされます</li>
              </ul>
            </div>
          </div>
        </section>

        <section id="change" className="mb-12">
          <h2 className="text-2xl md:text-3xl font-bold mb-6 text-black border-b-2 border-gray-300 pb-2">6. アンケート項目の変更について</h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-bold mb-4 text-black">現在の機能</h3>
              <div className="space-y-3">
                <div>
                  <p className="font-bold mb-2 text-black">ダッシュボードで変更できる項目:</p>
                  <ul className="list-disc list-inside space-y-1 ml-4 text-black">
                    <li>✅ 既存のアンケート結果の編集（院名、先生名、施術日、施術メニュー、性別、年齢層、満足度など）</li>
                    <li>✅ アンケート結果の削除</li>
                  </ul>
                </div>
                <div>
                  <p className="font-bold mb-2 text-black">ダッシュボードで変更できない項目:</p>
                  <ul className="list-disc list-inside space-y-1 ml-4 text-black">
                    <li>❌ アンケートの質問項目（質問文）</li>
                    <li>❌ 選択肢の内容（例：「男性」「女性」→「男」「女」への変更）</li>
                    <li>❌ 選択肢の追加・削除</li>
                    <li>❌ 質問の順番</li>
                    <li>❌ 院や先生の追加・削除</li>
                  </ul>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-bold mb-4 text-black">アンケート項目を変更する場合</h3>
              <p className="mb-3 text-black">アンケートの質問項目や選択肢を変更する場合は、<strong>開発者によるコード修正が必要</strong>です。</p>
              <div className="mb-3">
                <p className="font-bold mb-2 text-black">変更が必要な主なファイル：</p>
                <ul className="list-disc list-inside space-y-1 ml-4 text-black">
                  <li><code className="bg-gray-100 px-2 py-1 rounded">components/SurveyForm.tsx</code>: 質問項目、選択肢、質問の順番</li>
                  <li><code className="bg-gray-100 px-2 py-1 rounded">prisma/seed.ts</code> または <code className="bg-gray-100 px-2 py-1 rounded">supabase-setup.sql</code>: 院や先生の追加・削除</li>
                </ul>
              </div>
              <div>
                <p className="font-bold mb-2 text-black">変更例:</p>
                <ul className="list-disc list-inside space-y-1 ml-4 text-black">
                  <li>性別の選択肢を「男性」「女性」から「男」「女」に変更</li>
                  <li>施術メニューに新しい項目を追加</li>
                  <li>質問の順番を変更</li>
                  <li>新しい院や先生を追加</li>
                </ul>
              </div>
              <p className="mt-3 text-black">これらの変更は、コードを修正してからVercelに再デプロイする必要があります。</p>
            </div>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl md:text-3xl font-bold mb-6 text-black border-b-2 border-gray-300 pb-2">よくある質問（FAQ）</h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-bold mb-2 text-black">Q: ログインできない</h3>
              <p className="ml-4 text-black">A: 以下を確認してください：</p>
              <ul className="list-disc list-inside space-y-1 ml-8 text-black">
                <li>ユーザー名とパスワードが正しいか</li>
                <li>ブラウザのキャッシュをクリアして再試行</li>
                <li>シークレットモードで試す</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-bold mb-2 text-black">Q: データが表示されない</h3>
              <p className="ml-4 text-black">A: 以下を確認してください：</p>
              <ul className="list-disc list-inside space-y-1 ml-8 text-black">
                <li>フィルタリング条件が正しいか（特に日付の範囲）</li>
                <li>「リセット」ボタンをクリックしてフィルタを解除</li>
                <li>ブラウザをリロード</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-bold mb-2 text-black">Q: CSVエクスポートができない</h3>
              <p className="ml-4 text-black">A: 以下を確認してください：</p>
              <ul className="list-disc list-inside space-y-1 ml-8 text-black">
                <li>ブラウザのポップアップブロックが有効になっていないか</li>
                <li>ダウンロードフォルダを確認</li>
                <li>ブラウザをリロードして再試行</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-bold mb-2 text-black">Q: アンケート結果を編集できない</h3>
              <p className="ml-4 text-black">A: 以下を確認してください：</p>
              <ul className="list-disc list-inside space-y-1 ml-8 text-black">
                <li>すべての必須項目が入力されているか</li>
                <li>院と先生の組み合わせが正しいか</li>
                <li>ブラウザのコンソールにエラーが表示されていないか</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-bold mb-2 text-black">Q: 院や先生を追加したい</h3>
              <p className="ml-4 text-black">A: 現在、ダッシュボードから院や先生を追加する機能はありません。開発者に依頼して、データベースに直接追加する必要があります。</p>
            </div>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl md:text-3xl font-bold mb-6 text-black border-b-2 border-gray-300 pb-2">ログアウト</h2>
          <p className="text-black">ダッシュボード右上の「ログアウト」ボタンをクリックすると、ログアウトしてログインページに戻ります。</p>
        </section>

        <section>
          <h2 className="text-2xl md:text-3xl font-bold mb-6 text-black border-b-2 border-gray-300 pb-2">サポート</h2>
          <p className="text-black">問題が発生した場合や、追加の機能が必要な場合は、開発者にご連絡ください。</p>
        </section>

        <div className="mt-12 pt-6 border-t-2 border-gray-300 text-center">
          <a 
            href="/" 
            className="inline-block px-6 py-3 bg-pink-300 text-black rounded-lg hover:bg-pink-400 transition-colors font-medium"
          >
            トップページに戻る
          </a>
        </div>
      </div>
    </div>
  )
}

