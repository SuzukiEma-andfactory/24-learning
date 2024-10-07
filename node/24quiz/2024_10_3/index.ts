// MARK: Stackを実装
// あなたは画面遷移した画面名の履歴を管理する必要が発生して専用のClassを実装しようとしています。以下のインターフェースを参考に実装してみてください。

// クラスを利用
interface PageHistoryStack<T> {
  push(pageName: T): void;
  pop(): T | null;
}

class PageHistoryStackImpl<T> implements PageHistoryStack<T> {
  private histories: T[] = [];

  push(pageName: T): void {
    this.histories.push(pageName);
  }

  pop(): T | null {
    // 配列から最後（最新）の要素を取り除き、その要素を返す
    return this.histories.length > 0 ? this.histories.pop() || null : null;
  }
}
const pageHistory = new PageHistoryStackImpl<string>();

pageHistory.push('home');
pageHistory.push('settings');
pageHistory.push('profile');

console.log(pageHistory.pop()); // 'profile'を削除して返す
console.log(pageHistory.pop()); // 'settings'を削除して返す
console.log(pageHistory.pop()); // 'home'を削除して返す
console.log(pageHistory.pop()); // null

// クラスを使わない
// function push<T>(screen: T, histories: Array<T>): void {
//   histories.push(screen);
// }

// ↓値取得には追加した回数分のconsole.log(popScreen(screenHistories));が必要
// function popScreen<T>(histories: Array<T>): T | null {
//   if (histories.length === 0) {
//     return null;
//   }
//   return histories.pop() || null;
// }

// ↓なら１回のconsole.log(popScreen(screenHistories));で履歴一覧をポップした順に出力
// function popScreen<T>(histories: Array<T>): void {
//   while (histories.length > 0) {
//     console.log(histories.pop());
//   }
// }

// let screenHistories: string[] = [];

// push('Home', screenHistories);
// push('Settings', screenHistories);
// push('Profile', screenHistories);

// console.log(popScreen(screenHistories));
// console.log(popScreen(screenHistories));
// console.log(popScreen(screenHistories));
// console.log(popScreen(screenHistories));

// MARK: Queueを実装
// あなたは追加されたポップアップメッセージをキューで管理して、順々に画面に表示する仕組みを作ろうとしています。メッセージを管理するためのキューclassを以下のインターフェースを参考に実装してみてください。

// interface(とimplements)があることで、クラスに必須のメソッドやプロパティの存在を強制的に保証することができる
// 使い回すようなメソッド、変数をあらかじめ定義しておいてそれを継承させるとバグが発生しにくい？
interface PopupMessageQueue<T> {
  enqueue(message: T): void;
  dequeue(): T | null;
}

// NOTE TypeScriptはクラスとインターフェースが同じスコープで同じ名前を共有しているとクラスの宣言が優先され、インターフェースとの関連付けが行われない = シャドウイング
// クラスとインターフェースの名前を同じにすると、インターフェースを参照せずに自己完結した型チェック
// = PopupMessageQueueで定義したメソッドが欠けていても型チェックされない
class PopupMessageQueueImpl<T> implements PopupMessageQueue<T> {
  private messageQueue: T[] = [];

  enqueue(message: T): void {
    this.messageQueue.push(message);
  }

  dequeue(): T | null {
    return this.messageQueue.length > 0
      ? null
      : // shift()がundefinedの場合はnullを返す
        // 配列から古い順に要素を取り除きその要素を返す
        //  === 0じゃないならnullになることはないが、TSはshift()がundefinedを返す可能性があることを知ってて、それだとdequeue(): T | nullとズレるからその場合はnullと見なすよう記載が必要らしい
        this.messageQueue.shift() || null;
  }
}

// クラスはあくまで設計図で実態がないので、インスタンス化してクラスのメソッドやプロパティを利用できるようにオブジェクトを作る
// const popupQueue = new PopupMessageQueueImpl<string>();

// popupQueue.enqueue('popup1');
// popupQueue.enqueue('popup2');
// popupQueue.enqueue('popup3');

// console.log(popupQueue.dequeue()); // 'popup1'
// console.log(popupQueue.dequeue()); // 'popup2'
// console.log(popupQueue.dequeue()); // 'popup3'
// console.log(popupQueue.dequeue()); // null
