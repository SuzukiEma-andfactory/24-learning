import * as fs from 'fs';

// ローカル用
// const inputLines: string[] = fs
//   .readFileSync('24quiz/input1.txt', 'utf8')
//   .trim()
//   .split('\n');

// const inputLines2: string[] = fs
//   .readFileSync('24quiz/input2.txt', 'utf8')
//   .trim()
//   .split('\n');

// const results: Record<string, number> = {
//   AC: 0,
//   WA: 0,
//   TLE: 0,
//   RE: 0,
// };

// inputLines2.forEach((line: string) => {
//   if (results.hasOwnProperty(line)) {
//     results[line] += 1;
//   }
// });

// const printCount = (results: Record<string, number>) => {
//   Object.keys(results).forEach((key) => {
//     console.log(`${key} x ${results[key]}`);
//   });
// };

// printCount(results);

// ローカルでの動作確認
// % npx ts-node 24quiz/index.ts
// input1.txt
// AC x 3
// WA x 1
// TLE x 2
// RE x 0

// input2.txt
// AC x 10
// WA x 0
// TLE x 0
// RE x 0

// ts-node: TypeScript のファイルを直接実行するためのツール
// 通常、TypeScriptはJavaScriptにコンパイルされてから実行されますが、ts-node を使うと、TypeScriptファイルをコンパイルする必要なく、その場で実行できる
// npx ts-node 24quiz/index.ts > out.txtでターミナルで入力した結果をout.txtに新規保存することも可能
// ターミナル使う時catコマンド使えるかも

// AtCoder用
// 入力を行ごとに分割して配列にする
const inputLines: string[] = fs
  .readFileSync('/dev/stdin', 'utf8')
  .trim()
  .split('\n');

const results: Record<string, number> = {
  AC: 0,
  WA: 0,
  TLE: 0,
  RE: 0,
};

// resultsオブジェクトのキーと一致したらカウント
inputLines.forEach((line) => {
  if (results.hasOwnProperty(line)) {
    results[line] += 1;
  }
});

const printCount = (results: Record<string, number>) => {
  // resultsオブジェクトのすべてのキーを取得し、そのキーに対応する値を出力す
  Object.keys(results).forEach((key) => {
    console.log(`${key} x ${results[key]}`);
  });
};

printCount(results);
