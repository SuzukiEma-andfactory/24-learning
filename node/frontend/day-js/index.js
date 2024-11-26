import * as C from './constant';
import en from './locale/en';
import U from './utils';

// グローバルロケールの保管
let L = 'en'; // global locale
const Ls = {}; // global loaded locale
Ls[L] = en;

const IS_DAYJS = '$isDayjsObject';

// eslint-disable-next-line no-use-before-define
// trueになる条件：DayjsクラスやDayjsコンストラクタから作成されたオブジェクト or dに$isDayjsObjectというプロパティが存在
const isDayjs = (d) => d instanceof Dayjs || !!(d && d[IS_DAYJS]);

// Day.js のロケール（言語設定）を管理・変更
const parseLocale = (preset, object, isLocal) => {
  // presetが指定されていない場合、現在のグローバルロケール（’en’）を返す
  let l;
  if (!preset) return L;

  // 小文字化
  if (typeof preset === 'string') {
    // 小文字に変換
    const presetLower = preset.toLowerCase();

    // 指定されたロケール（presetLower）が既にLsにあればそのロケール名を返す
    if (Ls[presetLower]) {
      l = presetLower;
    }

    // 新しいロケール（presetLower）とそのデータ（object）を登録
    // presetLowerがLsにない場合 = objectが入ってくる？
    if (object) {
      Ls[presetLower] = object;
      l = presetLower;
    }

    // ロケール：「言語コード - 地域コード」（例:'en-US'）の形式
    // ハイフン（-）を基準に分割して配列にする
    const presetSplit = preset.split('-');

    // ロケールが 'en-US' のような地域コードも設定されている場合
    if (!l && presetSplit.length > 1) {
      return parseLocale(presetSplit[0]); // 'en'
    }
  } else {
    // presetオブジェクトにnameプロパティがあればnameという変数に格納
    const { name } = preset;
    // グローバルロケールリスト（Ls）に登録
    Ls[name] = preset;
    // 現在のロケール名を更新;
    l = name;
  }

  // isLocalがfalseでlがtrueの場合、グローバルロケール（L）を更新。
  if (!isLocal && l) L = l;
  // ①l（解析結果のロケール名）が設定されてたらそれを返す
  // ②l未設定、isLocalがfalseならグローバルロケール（L）を返す
  // isLocalがtrue なら、undefined
  return l || (!isLocal && L);
};

const dayjs = function (date, c) {
  // Dayjs オブジェクトであるか
  if (isDayjs(date)) {
    // オブジェクトを複製
    return date.clone();
  }

  // eslint-disable-next-line no-nested-ternary
  // オプションがあれば設定（dayjs(date, {に続く箇所）
  const cfg = typeof c === 'object' ? c : {};
  cfg.date = date;

  // arguments = JavaScriptの関数内のすべての引数を保持するオブジェクト（定義不要で使用可能）
  cfg.args = arguments; // eslint-disable-line prefer-rest-params

  // cfg に格納された設定をもとに、新しい日付オブジェクトを作成
  return new Dayjs(cfg); // eslint-disable-line no-use-before-define
};

// Utils.wで関数呼び出しオブジェクト作成
const wrapper = (date, instance) =>
  dayjs(date, {
    locale: instance.$L,
    utc: instance.$u,
    x: instance.$x,
    $offset: instance.$offset, // todo: refactor; do not use this.$offset in you code
  });

const Utils = U; // for plugin use
// ロケールを解析
Utils.l = parseLocale;
// Day.js インスタンスかどうかを判定
Utils.i = isDayjs;
// Day.js インスタンスを生成
Utils.w = wrapper;

const parseDate = (cfg) => {
  // utc：世界共通の標準時間
  const { date, utc } = cfg;

  if (date === null) return new Date(NaN); // null is invalid

  // const isUndefined = s => s === undefined
  // u: isUndefined
  if (Utils.u(date)) return new Date(); // today

  // 新しいDateオブジェクトを複製して返す
  if (date instanceof Date) return new Date(date);

  // 文字列の末尾にZがある（= UTC）の場合
  if (typeof date === 'string' && !/Z$/i.test(date)) {
    // const REGEX_PARSE = /^(\d{4})[-/]?(\d{1,2})?[-/]?(\d{0,2})[Tt\s]*(\d{1,2})?:?(\d{1,2})?:?(\d{1,2})?[.:]?(\d+)?$/
    // 年月日、時分秒ミリ秒を取得
    const d = date.match(C.REGEX_PARSE);
    if (d) {
      // 月の取得
      // Dateオブジェクト：1月 = 0 スタート
      // デフォルト値 = 0
      const m = d[2] - 1 || 0;

      // ミリ秒：最大3桁
      // substring：インデックス0から終了インデックスの手前2まで抽出
      const ms = (d[7] || '0').substring(0, 3);

      // UTC基準のDateオブジェクト生成
      if (utc) {
        return new Date(
          Date.UTC(d[1], m, d[3] || 1, d[4] || 0, d[5] || 0, d[6] || 0, ms)
        );
      }

      // ローカル時間を基準にしたDate オブジェクト生成
      return new Date(d[1], m, d[3] || 1, d[4] || 0, d[5] || 0, d[6] || 0, ms);
    }
  }

  return new Date(date); // everything else
};

class Dayjs {
  constructor(cfg) {
    // 言語設定
    this.$L = parseLocale(cfg.locale, null, true);
    this.parse(cfg); // for plugin
    this.$x = this.$x || cfg.x || {};
    this[IS_DAYJS] = true;
  }

  parse(cfg) {
    // parseDateで設定された日時を保持
    this.$d = parseDate(cfg);
    // ↓の各変数にセット
    this.init();
  }

  init() {
    // Dateオブジェクト（$d）から詳細な日時情報を取得
    const { $d } = this;
    this.$y = $d.getFullYear();
    this.$M = $d.getMonth();
    this.$D = $d.getDate();
    // 曜日
    this.$W = $d.getDay();
    this.$H = $d.getHours();
    this.$m = $d.getMinutes();
    this.$s = $d.getSeconds();
    this.$ms = $d.getMilliseconds();
  }

  // eslint-disable-next-line class-methods-use-this
  $utils() {
    return Utils;
  }

  isValid() {
    // this.$d = parseDateで」生成されたDateオブジェクト
    // const INVALID_DATE_STRING = 'Invalid Date'
    // 有効な日付ならtrue
    return !(this.$d.toString() === C.INVALID_DATE_STRING);
  }

  // const a = dayjs('2018-09-01 06:00:00');
  // const b = dayjs('2018-10-01 06:00:00');
  // const c = dayjs('2018-11-01 06:00:00');

  // unitsに指定した年月日や時間の開始時と終了時で同じ範囲か比較
  // b.isSame(b) // true
  isSame(that, units) {
    // 比較対象を新しいDayjsインスタンス生成
    const other = dayjs(that);
    // otherがstartOfとendOfの範囲内にある場合にtrue
    return this.startOf(units) <= other && other <= this.endOf(units);
  }

  // b.isAfter(a) // true
  isAfter(that, units) {
    return dayjs(that) < this.startOf(units);
  }

  // b.isBefore(c) // true
  isBefore(that, units) {
    return this.endOf(units) < dayjs(that);
  }

  // inputがundefinedの場合this[get]
  $g(input, get, set) {
    if (Utils.u(input)) return this[get];
    // set(年、月、日等の単位, 数値)で日時設定
    return this.set(set, input);
  }

  // UNIXタイムスタンプ
  // 秒
  unix() {
    return Math.floor(this.valueOf() / 1000);
  }

  // ミリ秒
  valueOf() {
    // timezone(hour) * 60 * 60 * 1000 => ms
    return this.$d.getTime();
  }

  // 指定単位の始まりを取得
  startOf(units, startOf) {
    // startOf -> endOf
    const isStartOf = !Utils.u(startOf) ? startOf : true;
    const unit = Utils.p(units);

    // 日付と月
    const instanceFactory = (d, m) => {
      const ins = Utils.w(
        // UTC / ローカルで日時生成
        this.$u ? Date.UTC(this.$y, m, d) : new Date(this.$y, m, d),
        this
      );
      return isStartOf ? ins : ins.endOf(C.D);
    };

    // 時間
    const instanceFactorySet = (method, slice) => {
      const argumentStart = [0, 0, 0, 0];
      const argumentEnd = [23, 59, 59, 999];
      return Utils.w(
        this.toDate()[method].apply(
          // eslint-disable-line prefer-spread
          this.toDate('s'),
          (isStartOf ? argumentStart : argumentEnd).slice(slice)
        ),
        this
      );
    };

    // 年月日の取得
    const { $W, $M, $D } = this;
    // UTC / ローカル
    const utcPad = `set${this.$u ? 'UTC' : ''}`;

    switch (unit) {
      // 年：1月1日（1日目、0月目）〜12月31日（31日目、11月目）
      case C.Y:
        return isStartOf ? instanceFactory(1, 0) : instanceFactory(31, 11);
      // 月：現在の月の1日目〜翌月の0日目（現在の月の最終日）
      case C.M:
        return isStartOf ? instanceFactory(1, $M) : instanceFactory(0, $M + 1);
      case C.W: {
        // 現在のロケールで定義された週の開始曜日（デフォルトは日曜日 = 0）
        const weekStart = this.$locale().weekStart || 0;
        // 現在の曜日（$W）から週の開始曜日（weekStart）までの差
        const gap = ($W < weekStart ? $W + 7 : $W) - weekStart;
        // 始まり = 現在の日付から gap を引く
        // 終わり = 現在の日付に (6 - gap) を加える
        return instanceFactory(isStartOf ? $D - gap : $D + (6 - gap), $M);
      }
      case C.D:
      case C.DATE:
        return instanceFactorySet(`${utcPad}Hours`, 0);
      case C.H:
        return instanceFactorySet(`${utcPad}Minutes`, 1);
      case C.MIN:
        return instanceFactorySet(`${utcPad}Seconds`, 2);
      case C.S:
        return instanceFactorySet(`${utcPad}Milliseconds`, 3);
      default:
        return this.clone();
    }
  }

  endOf(arg) {
    // isStartOfフラグをfalseにして指定した単位の終わりを取得
    return this.startOf(arg, false);
  }

  // set(年、月、日等の単位, 数値)で日時設定
  $set(units, int) {
    // private set
    // prettyUnit関数内で日時等の単位を定数に置き換え & 入力の単位を小文字化し末尾のsを削除
    const unit = Utils.p(units);
    // this.$u === trueならutcPad = "setUTC"、falseならutcPad = "set"
    const utcPad = `set${this.$u ? 'UTC' : ''}`;
    // Dateオブジェクトの標準機能であるローカル / UTCでの日時設定メソッドの切り替え
    const name = {
      [C.D]: `${utcPad}Date`,
      [C.DATE]: `${utcPad}Date`,
      [C.M]: `${utcPad}Month`,
      [C.Y]: `${utcPad}FullYear`,
      [C.H]: `${utcPad}Hours`,
      [C.MIN]: `${utcPad}Minutes`,
      [C.S]: `${utcPad}Seconds`,
      [C.MS]: `${utcPad}Milliseconds`,
    }[unit];

    // ？
    const arg = unit === C.D ? this.$D + (int - this.$W) : int;

    if (unit === C.M || unit === C.Y) {
      // clone is for badMutable plugin
      // 日付が存在しない場合の処理
      const date = this.clone().set(C.DATE, 1);
      date.$d[name](arg);
      date.init();
      this.$d = date.set(C.DATE, Math.min(this.$D, date.daysInMonth())).$d;
    } else if (name) this.$d[name](arg);

    this.init();
    return this;
  }

  // 現在の Day.js インスタンスを複製
  set(string, int) {
    return this.clone().$set(string, int);
  }

  // 年月日等の単位を標準化？定数に置き換え
  get(unit) {
    return this[Utils.p(unit)]();
  }

  add(number, units) {
    // 数値に変換
    number = Number(number); // eslint-disable-line no-param-reassign
    const unit = Utils.p(units);
    const instanceFactorySet = (n) => {
      const d = dayjs(this);
      return Utils.w(d.date(d.date() + Math.round(n * number)), this);
    };
    if (unit === C.M) {
      return this.set(C.M, this.$M + number);
    }
    if (unit === C.Y) {
      return this.set(C.Y, this.$y + number);
    }
    if (unit === C.D) {
      return instanceFactorySet(1);
    }
    if (unit === C.W) {
      return instanceFactorySet(7);
    }
    const step =
      {
        [C.MIN]: C.MILLISECONDS_A_MINUTE,
        [C.H]: C.MILLISECONDS_A_HOUR,
        [C.S]: C.MILLISECONDS_A_SECOND,
      }[unit] || 1; // ms

    const nextTimeStamp = this.$d.getTime() + number * step;
    return Utils.w(nextTimeStamp, this);
  }

  // addメソッド内でnumberをマイナスにして加算
  subtract(number, string) {
    return this.add(number * -1, string);
  }

  format(formatStr) {
    // 現在のロケール情報を取得
    const locale = this.$locale();

    // 日時が有効か確認
    if (!this.isValid()) return locale.invalidDate || C.INVALID_DATE_STRING;

    // formatStrm未指定ならconst FORMAT_DEFAULT = 'YYYY-MM-DDTHH:mm:ssZ'使用
    const str = formatStr || C.FORMAT_DEFAULT;
    // タイムゾーン情報を取得
    const zoneStr = Utils.z(this);
    const { $H, $m, $M } = this;
    // meridiem = AM/PM
    const { weekdays, months, meridiem } = locale;
    // 曜日や月名を短縮形で取得
    const getShort = (arr, index, full, length) =>
      (arr && (arr[index] || arr(this, str))) || full[index].slice(0, length);
    const get$H = (num) => Utils.s($H % 12 || 12, num, '0');

    const meridiemFunc =
      meridiem ||
      ((hour, minute, isLowercase) => {
        // 12時未満 → "AM"
        const m = hour < 12 ? 'AM' : 'PM';
        return isLowercase ? m.toLowerCase() : m;
      });

    const matches = (match) => {
      switch (match) {
        // フォーマットごとに対応する日時データを返す
        case 'YY':
          // 下2桁を取得
          return String(this.$y).slice(-2);
        case 'YYYY':
          return Utils.s(this.$y, 4, '0');
        case 'M':
          // Day.js では月が0始まりなので+1
          return $M + 1;
        case 'MM':
          return Utils.s($M + 1, 2, '0');
        case 'MMM':
          // 月の短縮名
          return getShort(locale.monthsShort, $M, months, 3);
        case 'MMMM':
          return getShort(months, $M);
        case 'D':
          return this.$D;
        case 'DD':
          return Utils.s(this.$D, 2, '0');
        case 'd':
          return String(this.$W);
        case 'dd':
          return getShort(locale.weekdaysMin, this.$W, weekdays, 2);
        case 'ddd':
          return getShort(locale.weekdaysShort, this.$W, weekdays, 3);
        case 'dddd':
          return weekdays[this.$W];
        case 'H':
          return String($H);
        case 'HH':
          return Utils.s($H, 2, '0');
        case 'h':
          return get$H(1);
        case 'hh':
          return get$H(2);
        case 'a':
          return meridiemFunc($H, $m, true);
        case 'A':
          return meridiemFunc($H, $m, false);
        case 'm':
          return String($m);
        case 'mm':
          return Utils.s($m, 2, '0');
        case 's':
          return String(this.$s);
        case 'ss':
          return Utils.s(this.$s, 2, '0');
        case 'SSS':
          return Utils.s(this.$ms, 3, '0');
        case 'Z':
          return zoneStr; // 'ZZ' logic below
        default:
          break;
      }
      return null;
    };

    return str.replace(
      C.REGEX_FORMAT,
      (match, $1) => $1 || matches(match) || zoneStr.replace(':', '')
    ); // 'ZZ'
  }

  utcOffset() {
    // Because a bug at FF24, we're rounding the timezone offset around 15 minutes
    // https://github.com/moment/moment/pull/1871
    return -Math.round(this.$d.getTimezoneOffset() / 15) * 15;
  }

  // 2つの日付間の差を指定した単位で計算
  diff(input, units, float) {
    const unit = Utils.p(units);
    // 比較対象の日付
    const that = dayjs(input);
    const zoneDelta =
      (that.utcOffset() - this.utcOffset()) * C.MILLISECONDS_A_MINUTE;
    const diff = this - that;
    const getMonth = () => Utils.m(this, that);

    let result;
    switch (unit) {
      case C.Y:
        result = getMonth() / 12;
        break;
      case C.M:
        result = getMonth();
        break;
      case C.Q:
        result = getMonth() / 3;
        break;
      case C.W:
        result = (diff - zoneDelta) / C.MILLISECONDS_A_WEEK;
        break;
      case C.D:
        result = (diff - zoneDelta) / C.MILLISECONDS_A_DAY;
        break;
      case C.H:
        result = diff / C.MILLISECONDS_A_HOUR;
        break;
      case C.MIN:
        result = diff / C.MILLISECONDS_A_MINUTE;
        break;
      case C.S:
        result = diff / C.MILLISECONDS_A_SECOND;
        break;
      default:
        result = diff; // milliseconds
        break;
    }

    return float ? result : Utils.a(result);
  }

  // 月の日数を取得
  daysInMonth() {
    // 月の最終日
    return this.endOf(C.M).$D;
  }

  $locale() {
    // get locale object
    return Ls[this.$L];
  }

  locale(preset, object) {
    if (!preset) return this.$L;
    const that = this.clone();
    const nextLocaleName = parseLocale(preset, object, true);
    if (nextLocaleName) that.$L = nextLocaleName;
    return that;
  }

  clone() {
    // this: 現在の Day.js オブジェクト（複製元）
    return Utils.w(this.$d, this);
  }

  // Dateオブジェクトを生成
  toDate() {
    return new Date(this.valueOf());
  }

  // Day.jsインスタンスをJSON形式に変換
  toJSON() {
    return this.isValid() ? this.toISOString() : null;
  }

  toISOString() {
    // ie 8 return
    // new Dayjs(this.valueOf() + this.$d.getTimezoneOffset() * 60000)
    // .format('YYYY-MM-DDTHH:mm:ss.SSS[Z]')
    // 例："2024-11-18T15:30:00.000Z"
    return this.$d.toISOString();
  }

  toString() {
    // 例："Mon, 18 Nov 2024 15:30:00 GMT"
    return this.$d.toUTCString();
  }
}

// Day.js インスタンスが継承するメソッドやプロパティ
const proto = Dayjs.prototype;
dayjs.prototype = proto;

// export const MS = 'millisecond'
// export const S = 'second'
// export const MIN = 'minute'
// export const H = 'hour'
// export const D = 'day'
// export const W = 'week'
// export const M = 'month'
// export const Q = 'quarter'
// export const Y = 'year'
// export const DATE = 'date'

[
  ['$ms', C.MS],
  ['$s', C.S],
  ['$m', C.MIN],
  ['$H', C.H],
  ['$W', C.D],
  ['$M', C.M],
  ['$y', C.Y],
  ['$D', C.DATE],
  // 配列を↓のように値を当てながらループし、日時のセット
  //   proto['millisecond'] = function (input) {
  //   return this.$g(input, '$ms', 'millisecond');
  // };
].forEach((g) => {
  proto[g[1]] = function (input) {
    return this.$g(input, g[0], g[1]);
  };
});

dayjs.extend = (plugin, option) => {
  if (!plugin.$i) {
    // install plugin only once
    plugin(option, Dayjs, dayjs);
    plugin.$i = true;
  }
  return dayjs;
};

dayjs.locale = parseLocale;

dayjs.isDayjs = isDayjs;

dayjs.unix = (timestamp) => dayjs(timestamp * 1e3);

dayjs.en = Ls[L];
dayjs.Ls = Ls;
dayjs.p = {};
export default dayjs;
