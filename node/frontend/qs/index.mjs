import qs from 'qs';

const parseStr1 = qs.parse('aaa=bbb&ccc=ddd');
const parseStr2 = qs.parse(
  'user[name][first]=taro&user[email]=taro@classmethod.jp'
);
const parseStr3 = qs.parse('user[0]=taro&user[1]=taro@classmethod.jp');

// オブジェクトからクエリ文字を生成
// ?や&などの文字はエスケープ処理される
const userObj = {
  user: {
    name: {
      first: 'taro',
    },
    email: 'taro@classmethod.jp',
  },
};
const queryStr1 = qs.stringify(userObj);

// npx ts-node frontend/qs/index.mjs
console.log(parseStr1); // { aaa: 'bbb', ccc: 'ddd' }
console.log(parseStr2); // { user: { name: { first: 'taro' }, email: 'taro@classmethod.jp' } }
console.log(parseStr3); // { user: [ 'taro', 'taro@classmethod.jp' ] }
console.log(queryStr1); //  user%5Bname%5D%5Bfirst%5D=taro&user%5Bemail%5D=taro%40classmethod.jp

// IP バックアップ
