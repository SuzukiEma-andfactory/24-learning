// index.js

// オブジェクト自身が引数に指定されたプロパティ（継承されたものは省く）を持っているかどうかを真偽値で返す
const hasOwn = {}.hasOwnProperty;

export default function classNames() {
  let classes = '';

  for (let i = 0; i < arguments.length; i++) {
    const arg = arguments[i];
    if (arg) {
      classes = appendClass(classes, parseValue(arg));
    }
  }

  return classes;
}

function parseValue(arg) {
  if (typeof arg === 'string') {
    return arg;
  }

  if (typeof arg !== 'object') {
    return '';
  }

  // 配列の各要素を引数にとりlassNames関数を実行
  if (Array.isArray(arg)) {
    return classNames.apply(null, arg);
  }

  if (
    // オブジェクトがデフォルトで持っているtoStringメソッドと異なる（引数argオブジェクト内にカスタムのtoStringメソッドが定義されている）
    arg.toString !== Object.prototype.toString &&
    !arg.toString.toString().includes('[native code]')
  ) {
    // カスタムメソッドのを利用
    return arg.toString();
  }

  let classes = '';

  // オブジェクトの場合、プロパティ名をkeyにセット
  for (const key in arg) {
    // 自身のオブジェクト内のプロパティでkeyを持ち、プロパティの値がfalseや空ではない場合に次の処理を実行
    if (hasOwn.call(arg, key) && arg[key]) {
      // 生成されるクラス名を持つclassesに追加していく
      classes = appendClass(classes, key);
    }
  }

  return classes;
}

// 新しいクラス名が指定されたら'既存のクラス名 新しいクラス名'を返す
function appendClass(value, newClass) {
  if (!newClass) {
    return value;
  }

  return value ? value + ' ' + newClass : newClass;
}

// npx ts-node frontend/classnames/index.mjs
// 真偽値がtrueの場合のみクラスが存在する
// console.log(classNames('foo', { foo: false }, 'bar')); // foo bar

// 動的に変わる部分
const buttonType = 'primary';
// console.log(classNames({ [`btn__${buttonType}`]: true })); // btn__primary

// inputは常に存在するクラス
// errorMessageを真偽値に変換しtrueならinput--errorが存在する
// const inputClassName = classNames(styles.input, {
//   [styles['input--error']]: !!errorMessage,
// });

console.log(classNames('foo', { foo: false, bar: true })); // => 'bar'
