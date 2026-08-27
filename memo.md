# テーブルの作成
テーブルの作成は、アプリケーションが起動する前（ビルド時やデプロイ時）に一回だけ実行するのがWeb開発の鉄則。

# Cookie
有効期限が切れると自動でブラウザが削除する。

# Nextjsでのデータフェッチ
Next.js(App Router)では、**「どこでデータを取得するか」**によって設計がかなり変わることがある。
特に今のNextjsでは単純に「`useEffect`でAPIを叩く」と言うより、
**Server Componentで取得するのか、Clientコンポーネントで取得するのか、Server Actionを使うのか、Route Handlerを挟むのか**
を考えるのが重要。
また、App Routerになってから、全てのファイルが最初から「サーバー側で動く（Server Component）」というルールになっているため、仮に「このファイルはブラウザでもJsを動かしたい」と言った場合は **'use client'**を記載する必要がある。

## 全体像
- Server Componentでfetch
  実行場所：サーバー
  主な用途：ページ表示用データ

- server componentでDB直接アクセス
  実行場所：サーバー
  主な用途：DBデータ取得

- Client component + fetch
  実行場所：ブラウザ
  主な用途：ユーザーの操作後の取得

- Client Component + TanStack Query
  実行場所：ブラウザ
  主な用途：複雑な状態・キャッシュ

- Router Handler + fetch
  実行場所：サーバー/API
  主な用途：APIエンドポイント

- Server Action
  実行場所：サーバー
  主な用途：更新・Mutation

- useEffect + fetch
  実行場所：ブラウザ
  主な用途：単純な取得

- SWR
  実行場所：ブラウザ
  主な用途：軽量なキャッシュ

## 1. Server Componentでfetch
App Routerのnextjsでまず基本になる形。
```
async function getUsers() {
  const res = await fetch("http://example.com/api/users");

  if (!res.ok) {
    throw new Error("Failed to fetch users");
  }

  return res.json();
}

export default async function UsersPage() {
  const users = await getUsers();

  return (
    <div>
      {users.map((user) => (
        <div key={user.id}>{user.name}</div>
      ))}
    </div>
  );
}
```
ポイントは、
`export default async function UsersPage()`
としてServer Componentの中で直接awaitできること。

### メリット
- ブラウザにAPI処理を任せなくて良い
```
Browser
↓
Next.js Server
↓
API
↓
DB
```
と言う形にすることができる。
APIキーなど機密情報をブラウザに露出させずにすむ。

- 初期表示に強い
サーバー側でデータを取得してHTMLを生成することができるので、
```
ユーザー
↓
ページアクセス
↓
Server Component
↓
データ取得
↓
HTML生成
↓
ブラウザ
```
と言う流れになる。
**ページを開いた時点でデータが必要**な場合に非常に向いている

### SEOに強い
商品一覧やブログなど下記のようなページで相性が良い。
・商品一覧
・商品詳細
・記事
・店舗情報

### デメリット
- Clientコンポーネントでは使えない。
```
"use client";

export default function Page() {
  const data = await fetch(...); // ❌
}
```
上記尿なことは基本的にはできない。
※関数自体にawaitを使うことができないため

- ユーザー操作による取得には向いていない
例えば、
```
検索ボタンを押す
↓
検索API
↓
結果表示
```
のような処理ならClient側のデータフェッチが適している。

## 2. Server ComponentからDBを直接取得
Next.jsでは、**サーバー側ならAPIを経由せずにDBに直接アクセスする**という設計もできる。
例えば、Prismaであれば
```
import { prisma } from "@/lib/prisma";

export default async function UsersPage() {
  const users = await prisma.user.findMany();

  return (
    <div>
      {users.map((user) => (
        <div key={user.id}>{user.name}</div>
      ))}
    </div>
  );
}
```
これを図にすると、  
APIを経由する場合↓
```
Next.js Server
↓
API
↓
PostgreSQL
```

DB直接の場合↓
```
Next.js Server
↓
PostgreSQL
```
となる。

### メリット
- 無駄なHTTP通信がない


あとでAPIのレスポンスも定義する
messageのみを返したりdetailを返したりしてるので
searchパラメータがURLに反映されてないので反映するように修正する

## Nextjsにおけるサーバーサイドのparams
- `req` (第一引数)の役割と中身
`req`は、ブラウザ（フロントエンド）から送信されてきたHTTPリクエストの生の情報にアクセスするためのオブジェクト。
<reqからしか取れないもの>
・`await req.json()`：フロント側が`body: JSON.stringify({...})`で送ってきたデータ。
・`req.cookies`：ログイン状態などを判別するためのクッキー情報
・`req.headers`：認証トークン（Bearer Token）や、ブラウザの種類、IPアドレスなどのヘッダー情報
・`req.nextUrl.searchParams`：URLの末尾につくクエリパラメータ（例：`?page=1&sort=descのようなpageやsort`）

- `context`（主に内部の`params`）は、Nextjsのフォルダ構成によって自動的に抽出されたURLパス内の動的な値を受け取るためのもの。
<context.paramsからしか受け取れないもの>
・フォルダ名が`[restaurantId]`なら→`{restaurantId: 123}`
・フォルダ名が`[userId]`なら→`{userId: 'abc'}`


## PostgreSQL
- CTE(Common Table Expression)
CTE（共通テーブル式）とは、`WITH`句を使って一時的な名前付き結果セットを定義し、複雑なクエリを読みやすく整理する機能。

```
WITH regional_sales AS (
  SELECT regin, SUM(amount) AS total_sales
  FROM orders
  GROUP BY region
)
SELECT regin, total_sales
FROM regional_sales
WHERE total_sales > 1000;
```