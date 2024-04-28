# AtCoder Heuristic Season Ranking

## 概要

AtCoderで行われたRated AHCのうち、指定した期間に開催されたコンテストのみを対象とした仮想的なレーティングを計算する非公式ツールです。

順位タブから指定した期間のレーティングランキングを、個人成績タブからその期間の個人成績を確認できます。

コンテスト参加のモチベーションアップ等にお役立てください。

## 公開場所

以下のWebサイトで公開しています。

https://ahc-season-ranking.terry-u16.net/

## ローカル実行

WSL上での実行のみ確認しています。以下のツール類を事前にインストールください。

- cargo ^1.77.2
- pnpm ^9.0.6
- wasm-pack ^0.12.1

### crawlerの実行

AtCoderのサイトからjsonをダウンロードし、参加者のパフォーマンスを `./web/public/contest_results.json` に追記します。

過度にアクセスしてAtCoderサーバに負荷をかけることはおやめください。

```sh
# 長期コンテスト結果のダウンロード
$ cargo run --release -- -c ahc0xx -l

# 短期コンテスト結果のダウンロード
$ cargo run --release -- -c ahc0xx -s
```

### wasmのビルド

以下のコマンドを実行し、wasmをビルドします。

```sh
$ cd wasm
$ wasm-pack build --target web --out-dir ../web/public/wasm
```

### ローカルサーバの起動

以下のコマンドを実行し、ローカルサーバを起動します。起動後、コンソール上に表示されるURLにブラウザからアクセスしてください。

```sh
$ cd web
$ pnpm install
$ pnpm dev
```

## ライセンス

MIT License
