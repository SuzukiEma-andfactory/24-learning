import camelCase from 'camelcase';

// console.log('1: ', camelCase('--foo-bar'));
// console.log('2: ', process.argv[3]);
// console.log('3: ', camelCase(process.argv[3]));
// console.log('4: ', process.argv);

// node % node frontend/camelcase/index.js arg --foo-barの出力結果
// arg1は自由指定の文字列、省略すると--foo-barが渡せない

// 1:  fooBar
// 2:  --foo-bar
// 3:  fooBar
// 4:  [
//   '/Users/suzukiema/.nodebrew/node/v20.9.0/bin/node',
//   '/Users/suzukiema/学習/24-learning/node/frontend/camelcase/index.js',
//   'arg',
//   '--foo-bar'
// ]
// 4:  fooBAR

// console.log('5: ', camelCase('foo-bar', { pascalCase: true }));
// 5:  FooBar

// console.log(
//   '6: ',
//   camelCase('foo-BAR', { preserveConsecutiveUppercase: true })
// );

// console.log(
//   '7: ',
//   camelCase('foo-BAR', { preserveConsecutiveUppercase: false })
// );
// :true => 'fooBAR'
// :false => 'fooBar'

// トルコ語に設定 Iと異なる文字になる
// console.log('8: ', camelCase('lorem-ipsum', { locale: 'tr-TR' }));
// 8:  loremİpsum
