// randomColor by David Merfield under the CC0 license
// https://github.com/davidmerfield/randomColor/

// (function(...) { ... })()：定義と同時に実行
// factory：(this, function () {}の中身が入る
(function (root, factory) {
  // 異なる環境（Node.jsやブラウザなど）で適切に動作させるためのモジュールのエクスポート方法を定義
  // Support CommonJS
  if (typeof exports === 'object') {
    // randomColor関数を作成
    var randomColor = factory();

    // Support NodeJS & Component, which allow module.exports to be a function
    // module.exports：Node.jsやCommonJSのモジュールシステムに基づいて、モジュールをエクスポート（公開）するための仕組み
    if (typeof module === 'object' && module && module.exports) {
      // module.exports = randomColor：Node.jsのモジュールとしてrandomColorを他のファイルからも使用できるようにする
      exports = module.exports = randomColor;
    }

    // Support CommonJS 1.1.1 spec
    exports.randomColor = randomColor;

    // Support AMD
    // AMD：ブラウザ環境での利用を想定したモジュールシステム、非同期的にモジュールを読み込む仕組み
    // ブラウザ環境ではモジュールの読み込みによってブラウザの描写が遅くならないようにする必要があるために非同期の仕組みを利用
  } else if (typeof define === 'function' && define.amd) {
    // define([], factory)：AMD環境でrandomColorをモジュールとして定義
    define([], factory);

    // Support vanilla script loading
  } else {
    // ブラウザでrandomColorをwindow.randomColorとして使えるようにする
    root.randomColor = factory();
  }
  // factoryに当たる部分
})(this, function () {
  // Seed to get repeatable colors
  // ランダムに色を生成する際にシード値（seed）を使用して色を制御
  // ある特定の文字列からは常に同じ色を得られるようにする
  var seed = null;

  // Shared color dictionary
  var colorDictionary = {};

  // Populate the color dictionary
  loadColorBounds();

  // check if a range is taken
  var colorRanges = [];

  var randomColor = function (options) {
    options = options || {};

    // Check if there is a seed and ensure it's an
    // integer. Otherwise, reset the seed value.
    // options.seedが指定済みかつ整数であれば、そのままseedに設定
    if (
      options.seed !== undefined &&
      options.seed !== null &&
      // 整数チェック
      options.seed === parseInt(options.seed, 10)
    ) {
      seed = options.seed;

      // A string was passed as a seed
      // options.seedが文字列であれば、文字列を整数に変換しその値をseedに設定
    } else if (typeof options.seed === 'string') {
      // コンピュータでの乱数生成は完全なランダムではなく、擬似乱数と呼ばれる手法を使う
      // 擬似乱数は、ある初期値（シード値）から計算を始めてランダムな数値を作り出す
      // 同じシード値が与えられたときには常に同じ色が生成されるようにする
      seed = stringToInteger(options.seed);

      // 整数でも文字列でもない場合はエラー
      // Something was passed as a seed but it wasn't an integer or string
    } else if (options.seed !== undefined && options.seed !== null) {
      throw new TypeError('The seed value must be an integer or string');

      // No seed, reset the value outside.
    } else {
      seed = null;
    }

    // 色相（H: Hue）、彩度（S: Saturation）、明度（B: Brightness)
    var H, S, B;

    // Check if we need to generate multiple colors
    // options.count：生成したい色の数
    if (options.count !== null && options.count !== undefined) {
      var totalColors = options.count,
        // 生成されたすべての色を保持
        colors = [];
      // Value false at index i means the range i is not taken yet.
      // H:0° 〜 360°、S,B: 0% 〜 100%で範囲を把握
      // 後に色が使われたら対応するインデックスのcolorRanges[i]をtrueにして、同じ色が重複しないようにする
      for (var i = 0; i < options.count; i++) {
        // 色をランダムに選ぶときに、すでにその範囲の色が使われたかどうかを管理するためのフラグ
        colorRanges.push(false);
      }
      options.count = null;

      // 指定された数の分だけ色を生成
      while (totalColors > colors.length) {
        // ランダムな色を生成
        var color = randomColor(options);

        if (seed !== null) {
          options.seed = seed;
        }

        colors.push(color);
      }

      options.count = totalColors;

      return colors;
    }

    // First we pick a hue (H)
    // 色相を選択（0°が赤、120°が緑、240°が青）
    H = pickHue(options);

    // Then use H to determine saturation (S)
    // 選んだ色相に基づき、彩度を決定（0%：グレー 〜 100%：鮮やかな色）
    S = pickSaturation(H, options);

    // Then use S and H to determine brightness (B).
    // 選んだ色相と彩度に基づいて、明度を決定（0%：黒 〜 100%：明るい色）
    B = pickBrightness(H, S, options);

    // Then we return the HSB color in the desired format
    return setFormat([H, S, B], options);
  };

  function pickHue(options) {
    if (colorRanges.length > 0) {
      // 指定された色（options.hue）に基づく色相範囲を取得
      var hueRange = getRealHueRange(options.hue);

      // 色相環上での位置を角度として表現
      // 0°や360°は赤、120°は緑、240°は青
      var hue = randomWithin(hueRange);

      //Each of colorRanges.length ranges has a length equal approximatelly one step
      // 色相をランダムに選ぶときに色が重複しないようステップで分割？
      var step = (hueRange[1] - hueRange[0]) / colorRanges.length;

      var j = parseInt((hue - hueRange[0]) / step);

      //Check if the range j is taken
      // 色相の「ステップ」がすでに使われた場合、2つ先のステップに移動
      if (colorRanges[j] === true) {
        j = (j + 2) % colorRanges.length;
      } else {
        // 現在のステップを使う
        colorRanges[j] = true;
      }

      var min = (hueRange[0] + j * step) % 359,
        max = (hueRange[0] + (j + 1) * step) % 359;

      hueRange = [min, max];

      // 指定されたhueRangeからランダムな色相を選択
      hue = randomWithin(hueRange);

      // 色相は0°〜360°で表すように調整
      if (hue < 0) {
        hue = 360 + hue;
      }
      // ランダムに選ばれた色相を返す
      return hue;
    } else {
      // ptions.hueの色に対応する色相範囲を取得
      var hueRange = getHueRange(options.hue);

      // 指定されたhueRange（色相の範囲）の中からランダムに1つの色相を選択
      hue = randomWithin(hueRange);
      // Instead of storing red as two seperate ranges,
      // we group them, using negative numbers
      if (hue < 0) {
        hue = 360 + hue;
      }

      return hue;
    }
  }

  // オプションごとに彩度を設定
  function pickSaturation(hue, options) {
    // 彩度を0に
    if (options.hue === 'monochrome') {
      return 0;
    }

    if (options.luminosity === 'random') {
      return randomWithin([0, 100]);
    }

    // 指定された色相に基づいて彩度の範囲を取得
    var saturationRange = getSaturationRange(hue);

    var sMin = saturationRange[0],
      sMax = saturationRange[1];

    // luminosity：明度
    // 彩度の範囲を調整
    switch (options.luminosity) {
      case 'bright':
        // 彩度が高く鮮やかで明るい色
        sMin = 55;
        break;

      case 'dark':
        // 彩度が高く暗い色
        sMin = sMax - 10;
        break;

      case 'light':
        // 薄い色
        sMax = 55;
        break;
    }

    // 上記で調整した範囲内でランダムな彩度を生成
    return randomWithin([sMin, sMax]);
  }

  // 色相・彩度・オプションに応じて色の明るさを調整
  function pickBrightness(H, S, options) {
    var bMin = getMinimumBrightness(H, S),
      bMax = 100;

    switch (options.luminosity) {
      case 'dark':
        // 暗い色を作り出すために明るさの範囲を最小値 (bMin) に近い値に制限
        bMax = bMin + 20;
        break;

      // bMin（最小の明るさ）をbMinとbMaxの中間値に設定
      case 'light':
        bMin = (bMax + bMin) / 2;
        break;

      // 明るさの範囲は最小から最大までランダム
      case 'random':
        bMin = 0;
        bMax = 100;
        break;
    }

    // 調整された明るさの範囲 [bMin, bMax] の中でランダムに明るさを設定
    return randomWithin([bMin, bMax]);
  }

  // 与えられた色（HSV形式）を指定された形式に変換
  function setFormat(hsv, options) {
    switch (options.format) {
      case 'hsvArray':
        // 例: [360, 100, 100]（色相360°, 彩度100%, 明度100%）
        return hsv;

      case 'hslArray':
        // [360, 100, 50]（色相360°, 彩度100%, 明度50%）
        return HSVtoHSL(hsv);

      case 'hsl':
        // 例: 'hsl(360, 100%, 50%)'
        var hsl = HSVtoHSL(hsv);
        return 'hsl(' + hsl[0] + ', ' + hsl[1] + '%, ' + hsl[2] + '%)';

      // HSLA：HSLに加えてアルファ値（透明度）を含む
      case 'hsla':
        var hslColor = HSVtoHSL(hsv);
        // アルファ値は options.alpha に基づき、指定がない場合はランダムな値を生成
        var alpha = options.alpha || Math.random();
        // 例: 'hsla(360, 100%, 50%, 0.5)'（アルファ値が 0.5 の場合）
        return (
          'hsla(' +
          hslColor[0] +
          ', ' +
          hslColor[1] +
          '%, ' +
          hslColor[2] +
          '%, ' +
          alpha +
          ')'
        );

      case 'rgbArray':
        // 例: [255, 0, 0]（RGB形式で赤色）
        return HSVtoRGB(hsv);

      case 'rgb':
        var rgb = HSVtoRGB(hsv);
        // 例: 'rgb(255, 0, 0)'
        return 'rgb(' + rgb.join(', ') + ')';

      // RGBA：RGBに加えてアルファ値（透明度）を含む
      case 'rgba':
        var rgbColor = HSVtoRGB(hsv);
        var alpha = options.alpha || Math.random();
        // 例: 'rgba(255, 0, 0, 0.5)'（アルファ値 0.5 の場合）
        return 'rgba(' + rgbColor.join(', ') + ', ' + alpha + ')';

      default:
        // 16進数（HEX）形式に変換
        // 例: '#ff0000'（赤色を表す16進数）
        return HSVtoHex(hsv);
    }
  }

  // 指定された色相（Hue, H）と彩度（Saturation, S）に基づいてその色が持つ最低の明度を計算
  function getMinimumBrightness(H, S) {
    // 色に対応する彩度と明度を取得
    var lowerBounds = getColorInfo(H).lowerBounds;

    for (var i = 0; i < lowerBounds.length - 1; i++) {
      var s1 = lowerBounds[i][0], // 現在の彩度の値
        v1 = lowerBounds[i][1]; // 現在の明度の値
      var s2 = lowerBounds[i + 1][0], // 次の彩度の値
        v2 = lowerBounds[i + 1][1]; // 次の明度の値
      // getColorInfo内で定義されていない彩度と明度の範囲を計算？
      if (S >= s1 && S <= s2) {
        var m = (v2 - v1) / (s2 - s1),
          b = v1 - m * s1;

        return m * S + b;
      }
    }

    // 対応する彩度の範囲が見つからなかった場合
    return 0;
  }

  // 与えられたcolorInputから色相 (Hue) の範囲を決定
  function getHueRange(colorInput) {
    if (typeof parseInt(colorInput) === 'number') {
      var number = parseInt(colorInput);

      // 0以上360未満なら単色になる
      if (number < 360 && number > 0) {
        return [number, number];
      }
    }

    if (typeof colorInput === 'string') {
      // colorDictionaryに指定された色（とそれに対応する色相範囲）があれば取得
      if (colorDictionary[colorInput]) {
        var color = colorDictionary[colorInput];
        if (color.hueRange) {
          return color.hueRange;
        }
        // 3桁または6桁の16進数形式のカラーコードの場合
      } else if (colorInput.match(/^#?([0-9A-F]{3}|[0-9A-F]{6})$/i)) {
        // HSB形式に変換して色相 (Hue) を取得
        var hue = HexToHSB(colorInput)[0];
        return [hue, hue];
      }
    }

    // デフォルト値として全ての色を含む範囲を設定
    return [0, 360];
  }

  function getSaturationRange(hue) {
    // 指定された色の彩度の範囲を取得
    return getColorInfo(hue).saturationRange;
  }

  function getColorInfo(hue) {
    // Maps red colors to make picking hue easier
    // 0°と360°は同じ赤の範囲
    // もしhueが334°~360°ならそのhueに360を引いて-26°~0°に変換して調整
    if (hue >= 334 && hue <= 360) {
      hue -= 360;
    }

    // 色相 (hue) が、辞書に登録された各色のhueRange（色相の範囲）に属しているかどうかを確認
    for (var colorName in colorDictionary) {
      var color = colorDictionary[colorName];
      if (
        // 例：赤であれば[0, 30]のような形で色相0°から30°の範囲にある=赤かどうかを確認
        // 条件が全てtrueであれば、hueはその色の色相範囲内に含まれていることにする
        color.hueRange &&
        hue >= color.hueRange[0] &&
        hue <= color.hueRange[1]
      ) {
        return colorDictionary[colorName];
      }
    }
    return 'Color not found';
  }

  // ランダムな整数を生成
  function randomWithin(range) {
    if (seed === null) {
      //generate random evenly destinct number from : https://martin.ankerl.com/2009/12/09/how-to-create-random-colors-programmatically/
      var golden_ratio = 0.618033988749895;
      // 0以上1未満で小数点ありの乱数を生成
      var r = Math.random();
      r += golden_ratio;
      // 1で割った余りを割り当て常に0から1未満になるようにする
      r %= 1;
      return Math.floor(range[0] + r * (range[1] + 1 - range[0]));
    } else {
      //Seeded random algorithm from http://indiegamr.com/generate-repeatable-random-numbers-in-js/
      var max = range[1] || 1;
      var min = range[0] || 0;
      seed = (seed * 9301 + 49297) % 233280;
      var rnd = seed / 233280.0;
      return Math.floor(min + rnd * (max - min));
    }
  }

  // HSV→RGB→Hexの順で変換
  function HSVtoHex(hsv) {
    var rgb = HSVtoRGB(hsv);

    function componentToHex(c) {
      // RGBの各整数を16進数に変換 例：[255, 165, 0] → 'ff', 'a5', '00'
      var hex = c.toString(16);
      // 1桁の場合は0を前に追加
      return hex.length == 1 ? '0' + hex : hex;
    }

    // RGBをHex形式に変換
    var hex =
      '#' +
      componentToHex(rgb[0]) +
      componentToHex(rgb[1]) +
      componentToHex(rgb[2]);

    return hex;
  }

  // 色の名前、色相 (Hue) の範囲、彩度と明度の下限上限を指定し、colorDictionaryに保存
  function defineColor(name, hueRange, lowerBounds) {
    // [彩度, 明度]の構造から彩度の最小値と最大値を取得
    var sMin = lowerBounds[0][0],
      sMax = lowerBounds[lowerBounds.length - 1][0],
      // 彩度の最小値と最大値を取得
      bMin = lowerBounds[lowerBounds.length - 1][1],
      bMax = lowerBounds[0][1];

    // 彩度の最小値と最大値を取得
    colorDictionary[name] = {
      hueRange: hueRange, // 色相範囲（hueRange）
      lowerBounds: lowerBounds, // 彩度・明度の境界値
      saturationRange: [sMin, sMax], // 彩度・明度の境界値
      brightnessRange: [bMin, bMax], // 明度の範囲
    };

    // TODO 中身確認
    // console.log(colorDictionary);
  }

  // 色に対応する 色相 (Hue)、彩度 (Saturation)、明度 (Brightness) の範囲を定義
  function loadColorBounds() {
    defineColor('monochrome', null, [
      // 彩度明度が0の完全無彩色の黒色
      [0, 0],
      // 彩度は最大だが明度が0なので黒
      [100, 0],
    ]);

    defineColor(
      'red',
      // 色相範囲
      [-26, 18],
      [
        // 彩度と明度
        [20, 100],
        [30, 92],
        [40, 89],
        [50, 85],
        [60, 78],
        [70, 70],
        [80, 60],
        [90, 55],
        [100, 50],
      ]
    );

    defineColor(
      'orange',
      [18, 46],
      [
        [20, 100],
        [30, 93],
        [40, 88],
        [50, 86],
        [60, 85],
        [70, 70],
        [100, 70],
      ]
    );

    defineColor(
      'yellow',
      [46, 62],
      [
        [25, 100],
        [40, 94],
        [50, 89],
        [60, 86],
        [70, 84],
        [80, 82],
        [90, 80],
        [100, 75],
      ]
    );

    defineColor(
      'green',
      [62, 178],
      [
        [30, 100],
        [40, 90],
        [50, 85],
        [60, 81],
        [70, 74],
        [80, 64],
        [90, 50],
        [100, 40],
      ]
    );

    defineColor(
      'blue',
      [178, 257],
      [
        [20, 100],
        [30, 86],
        [40, 80],
        [50, 74],
        [60, 60],
        [70, 52],
        [80, 44],
        [90, 39],
        [100, 35],
      ]
    );

    defineColor(
      'purple',
      [257, 282],
      [
        [20, 100],
        [30, 87],
        [40, 79],
        [50, 70],
        [60, 65],
        [70, 59],
        [80, 52],
        [90, 45],
        [100, 42],
      ]
    );

    defineColor(
      'pink',
      [282, 334],
      [
        [20, 100],
        [30, 90],
        [40, 86],
        [60, 84],
        [80, 80],
        [90, 75],
        [100, 73],
      ]
    );
  }

  // HSV（色相、彩度、明度）形式の色をRGB（赤、緑、青)形式に変換
  // 0°は赤、120°は緑、240°は青に相当
  // NOTE HSV: Hue（色相）、Saturation（彩度）、Value（明度）の値で色を表します。
  // h: 色相（0° 〜 360° の範囲）
  // s: 彩度（0% 〜 100% の範囲）
  // v: 明度（0% 〜 100% の範囲）
  // RGB: 赤 (Red)、緑 (Green)、青 (Blue) の値で色を表します。各色成分が 0 〜 255 の範囲の整数値で表現されます。

  // 色相 (hue) を 6 つのセクション（0〜5）に分けて処理しています。このとき、h * 6 を計算して整数部分を取得して、それに基づいてRGB値を決める
  function HSVtoRGB(hsv) {
    // this doesn't work for the values of 0 and 360
    // here's the hacky fix
    // 色相（Hue）の値をセット
    var h = hsv[0];
    if (h === 0) {
      h = 1;
    }
    if (h === 360) {
      h = 359;
    }

    // Rebase the h,s,v values
    // 0~360°の色相の角度を0〜1範囲の数値で設定
    h = h / 360;
    // 0~100%の割合を0〜1範囲の数値で設定
    // 彩度
    var s = hsv[1] / 100,
      // 明度
      v = hsv[2] / 100;

    // 中間色を計算
    // Math.floor：小数点以下を切り捨てて0〜5に振り分け、色相を6つのセクションに分割
    var h_i = Math.floor(h * 6),
      // 少数部分を取り出す（1に近いほど次の色に近い）
      f = h * 6 - h_i,
      // 彩度を反映
      p = v * (1 - s),
      // 徐々に次の色に移るグラデーションの計算
      // 「現在のセクションの色」がどれだけ減るか
      q = v * (1 - f * s),
      // 「次のセクションの色」がどれだけ増えていくか
      t = v * (1 - (1 - f) * s),
      // RGB値の初期化
      r = 256,
      g = 256,
      b = 256;

    // TODO vtpの割り当ての仕方
    // 色相h_iに基づいて6つのセクションごとにRGBの値を計算
    switch (h_i) {
      // 赤から黄
      case 0:
        r = v;
        g = t;
        b = p;
        break;
      //  黄から緑
      case 1:
        r = q;
        g = v;
        b = p;
        break;
      // 緑からシアン
      case 2:
        r = p;
        g = v;
        b = t;
        break;
      // シアンから青
      case 3:
        r = p;
        g = q;
        b = v;
        break;
      // 青からマゼンタ
      case 4:
        r = t;
        g = p;
        b = v;
        break;
      // マゼンタから赤
      case 5:
        r = v;
        g = p;
        b = q;
        break;
    }

    // 0〜1の範囲で計算されているRGBの値をを0〜255の範囲に変換
    var result = [
      Math.floor(r * 255),
      Math.floor(g * 255),
      Math.floor(b * 255),
    ];
    return result;
  }

  // 16進数カラーコード（Hex値）を HSB（色相・彩度・明度）形式に変換
  function HexToHSB(hex) {
    // カラーコードに#があれば取り除く
    hex = hex.replace(/^#/, '');
    // ３桁の場合は各文字を2回繰り返して６桁に変換
    hex = hex.length === 3 ? hex.replace(/(.)/g, '$1$1') : hex;

    // 16進数を10進数 & RGB値に変換、0〜1の範囲で置き換える
    // hex.substr(0, 2)：カラーコードの最初の２文字を取得
    var red = parseInt(hex.substr(0, 2), 16) / 255,
      green = parseInt(hex.substr(2, 2), 16) / 255,
      blue = parseInt(hex.substr(4, 2), 16) / 255;

    // RGB の値の中で最も強い色の値をcMaxとして取得
    var cMax = Math.max(red, green, blue),
      // 色の最大値と最小値の差 ← 大きければ鮮やかで小さければグレーに近くくすむ
      delta = cMax - Math.min(red, green, blue),
      // 彩度の計算
      // 0だと灰色、1だと鮮やかな色
      saturation = cMax ? delta / cMax : 0;

    // 赤、緑、青の中の最大値によって色相を計算
    // 色相環の正しい位置に対応する角度を計算
    switch (cMax) {
      case red:
        return [60 * (((green - blue) / delta) % 6) || 0, saturation, cMax];
      case green:
        return [60 * ((blue - red) / delta + 2) || 0, saturation, cMax];
      case blue:
        return [60 * ((red - green) / delta + 4) || 0, saturation, cMax];
    }
  }

  // HSV：Hue色相）、Saturation（彩度）、Value（値 = 明るさ）
  // HSL: 色相 (Hue)、彩度 (Saturation)、明度 (Lightness)
  function HSVtoHSL(hsv) {
    // 色相 (Hue) = 色相環上での位置を角度として表現
    var h = hsv[0],
      s = hsv[1] / 100, // 0-1の範囲で彩度を設定
      v = hsv[2] / 100, // 0-1の範囲で明度を設定
      k = (2 - s) * v; // 明度 (Value) と彩度 (Saturation) のバランスを取りつつ、HSL に適した明度を計算

    // HSVの彩度と明度を使ってHSL形式の彩度に変換
    return [
      h,
      // 計算結果を小数点以下2桁に四捨五入して彩度が0〜100%の範囲になるよう調整
      Math.round(((s * v) / (k < 1 ? k : 2 - k)) * 10000) / 100,
      (k / 2) * 100,
    ];
  }

  // TODO なぜ文字列を数値に変換する必要があるのか
  function stringToInteger(string) {
    var total = 0;
    for (var i = 0; i !== string.length; i++) {
      // JavaScriptで安全に扱える最大の整数値に達したら処理終了
      if (total >= Number.MAX_SAFE_INTEGER) break;
      // 現在の文字を文字コードに変換し、文字列に対応する数値を生成
      total += string.charCodeAt(i);
    }
    return total;
  }

  // get The range of given hue when options.count!=0
  function getRealHueRange(colorHue) {
    // 数値（または数値に変換可能な文字列）であれば処理
    if (!isNaN(colorHue)) {
      // colorHue を整数に変換
      var number = parseInt(colorHue);

      if (number < 360 && number > 0) {
        return getColorInfo(colorHue).hueRange;
      }
    } else if (typeof colorHue === 'string') {
      // 指定された色の名前がcolorDictionaryに存在するならその色相の範囲を取得
      if (colorDictionary[colorHue]) {
        var color = colorDictionary[colorHue];

        if (color.hueRange) {
          return color.hueRange;
        }
        // カラーコードの場合
        // ＃はあってもなくてもok、３or6桁
      } else if (colorHue.match(/^#?([0-9A-F]{3}|[0-9A-F]{6})$/i)) {
        // カラーコードを色相、彩度、明度（HSB形式）に変換
        // [0]：色相 (Hue) の部分を取得
        var hue = HexToHSB(colorHue)[0];
        // 変換された色相に基づいて、その色相の範囲を取得
        return getColorInfo(hue).hueRange;
      }
    }

    // 上記の条件に当てはまらなかった場合のデフォルト値
    // TODO なぜこの数値、どう使われる
    return [0, 360];
  }
  return randomColor;
});

const randomColor = require('randomcolor'); // import the script
const color1 = randomColor(); // 16進数のカラーコード
// 緑系で10色生成
const color2 = randomColor({
  count: 10,
  luminosity: 'bright',
  hue: 'green',
  format: 'rgb',
  alpha: '0.3',
});

// npx ts-node frontend/randomcolor/randomColor.js
console.log(color2);
