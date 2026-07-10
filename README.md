# 関西大学 統一祭 公式LP（ランディングページ）

関西大学 統一学園祭「統一祭」の公式サイトです。
**2026年11月1日(日)〜11月4日(水)** に千里山キャンパスで開催される学園祭の告知用ワンページサイトです。

## サイト構成

| セクション | 内容 |
|---|---|
| ヒーロー（トップ） | メインビジュアル・開催日・開幕までのカウントダウン |
| お知らせ | 更新情報のリスト |
| 開催概要 | 名称・日程・会場・入場・主催 |
| 企画 | ステージ企画・模擬店（現在は COMING SOON） |
| アクセス | Google Maps 埋め込み・交通案内 |
| 注意事項・FAQ | 来場者への注意・よくある質問（開閉式） |

## ファイル構成

```
├── index.html      … ページ本体（HTML・CSS・JSすべてここ。編集するのは基本このファイルだけ）
├── support.js      … 表示用ランタイム（自動生成ファイル。編集禁止）
└── uploads/        … 写真素材（toitu-sozai-1.jpg 〜 10.jpg）
```

> ⚠️ **support.js は絶対に手で編集しないでください。**
> 1行目に書かれている通り自動生成されたファイルです。サイトの見た目や文言の変更はすべて `index.html` 側で行います。

## 仕組み（技術概要）

- このサイトは **dc-runtime** という仕組みで動いています。`index.html` の `<x-dc>` 内に書かれたHTMLテンプレートを、`support.js` が **React**（CDN: unpkg.com から自動読込）でレンダリングします。
- テンプレート内の `{{ 変数名 }}` は、ページ下部の `<script type="text/x-dc" data-dc-script>` 内の `Component` クラスが返す値に置き換わります。
  - `sc-for` … リストの繰り返し表示（お知らせ・FAQで使用）
  - `sc-if` … 条件付き表示（モバイルメニューで使用）
- **インターネット接続が必要です**（React・Google Fonts・Google Maps を外部から読み込むため）。

## ローカルでの確認方法

`index.html` をダブルクリックで開くだけでは一部動作しません（fetch を使うため）。
簡易サーバーを立てて確認してください：

```bash
# Python がある場合（リポジトリのフォルダで実行）
python -m http.server 8000
# → ブラウザで http://localhost:8000 を開く
```

VS Code の「Live Server」拡張機能でも構いません。

## よくある更新作業（すべて index.html 内）

### 1. お知らせを追加する
`renderVals()` 内の `news` 配列に1行追加します：

```js
const news = [
  { date: '2026.07.10', tag: '重要', tagBorder: '#6b5ca5', tagColor: '#a89ae0', text: 'お知らせの本文' },
  // tag が「重要」以外なら tagBorder: 'rgba(255,255,255,.3)', tagColor: 'rgba(255,255,255,.6)' を使う
];
```

### 2. FAQを追加・修正する
同じく `renderVals()` 内の `faqs` 配列を編集します：

```js
const faqs = [
  { q: '質問文', a: '回答文' },
];
```

### 3. カウントダウンの目標日時を変える
`Countdown` クラスの `render()` 内にあります。**この時刻ちょうどに0になります**：

```js
const target = new Date('2026-11-01T11:00:00+09:00').getTime();  // JST(+09:00)を忘れずに
```

日付を変えたら、ヒーローと開催概要の日程表記（`2026年11月1日(日)〜11月4日(水)` で検索）も忘れずに更新してください。

### 4. 写真を差し替える
`uploads/` に画像を置き、`index.html` 内の `src="uploads/ファイル名.jpg"` を書き換えます。
**1枚あたり300KB以下を目安に**圧縮してから置くこと（スマホ表示が重くなるため）。

### 5. ナビメニューの項目を変える
`renderVals()` 内の `navItems` 配列を **1箇所** 直すだけで、PC用ヘッダーメニューとスマホ用ハンバーガーメニューの両方に反映されます：

```js
const navItems = [
  { href: '#news', label: 'お知らせ', color: 'rgba(255,255,255,.85)' },
  // 目立たせたい項目は color: '#a89ae0'（紫）にする
];
```

`href` の飛び先は各セクションの `id` 属性（`<section id="news">` など）に対応しています。

## 未確定のまま残っている箇所（要更新）

`XXXX` がプレースホルダーです。決まり次第置き換えてください：

- [ ] ヘッダーの回次表記 `TOITSU-SAI XXXX`
- [ ] 今年のスローガン `「XXXX」`（ヒーロー縦書き・お知らせ・開催概要の3箇所）
- [ ] お知らせの日付 `XXXX.XX.XX`
- [ ] ステージ企画・模擬店の詳細（現在 COMING SOON）
- [ ] 開催概要の終了時刻（現在「11:00開幕」のみ記載）

## 対応ブラウザ・スマホ対応

- Chrome / Safari / Edge の最新版、iOS Safari・Android Chrome に対応
- 画面幅 **860px以下**でハンバーガーメニューに切り替わります
- iOS Safari のアドレスバーによる高さ問題（100vh）は `100dvh` で対応済み
- Safari 用に `-webkit-backdrop-filter` などのプレフィックスを付与済み

## 公開（デプロイ）

**AWS（S3 + CloudFront）で公開しています。** 公開URL: https://d117phj074z82p.cloudfront.net

### 更新のしかた（自動デプロイ）
`main` ブランチに push すると、GitHub Actions が自動でデプロイします。**手作業でのアップロードは不要です。**

```
コードを編集 → git push origin main → 数分で本番反映
```

内部の流れ（[.github/workflows/deploy.yml](.github/workflows/deploy.yml)）:
1. GitHub Actions が OIDC でAWSに一時認証（長期キーは未使用）
2. サイト本体を S3 バケットへ同期（`infra/` `.github/` `README.md` は除外）
3. CloudFront のキャッシュを削除して即時反映

反映状況は GitHub の **Actions** タブで確認できます。反映まで通常2〜3分（CloudFrontのキャッシュ削除待ち）。

### インフラの構成
AWSリソースは Terraform（[infra/](infra/)）で管理しています。構成の詳細・再構築手順は [infra/](infra/) 内のコードを参照してください。主要リソース:

| リソース | 役割 |
|---|---|
| S3（非公開） | サイトファイルの保管。CloudFront経由でのみ配信 |
| CloudFront | HTTPS配信・CDN・セキュリティヘッダー付与 |
| GitHub OIDCロール | Actionsからのデプロイ認証（mainブランチ限定） |

> ⚠️ Terraformの `terraform.tfstate` や `terraform.tfvars` は秘匿情報を含むため **Gitにコミットされません**（`.gitignore` 済み）。インフラを操作する場合は別途 AWS認証情報が必要です。

## 制作

- 主催: 祭典実行委員会
- ページ制作: Versear
