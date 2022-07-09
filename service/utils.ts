export const getCrypto = (): Crypto => {
  return window.crypto;
};

export const getCryptoSubtle = (): SubtleCrypto => {
  const crypto = getCrypto();
  // 暗号化操作を扱えるクラス
  return crypto.subtle;
};

export const createRandomString = (): string => {
  // これを元にランダムな文字列を生成する
  const charset =
    "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-_~.";
  let random = "";
  // new Uint8Array: 8ビットの整数を生成。初期値は0
  // crypto.getRandomValues: 引数に当てた配列内の整数に乱数を与える
  // Array.from: 配列を Shallow Copy して新たな配列を生成
  // 43個の乱数が入った配列を生成している
  const randomValues = Array.from(
    getCrypto().getRandomValues(new Uint8Array(43))
  );
  // 乱数と charset.length の剰余に対応する charset の文字を random に注入する
  randomValues.forEach((v) => (random += charset[v % charset.length]));
  return random;
};

export const encode = (s: string) => btoa(s);

// 固定長（長さが増減しない値）のバッファ（バイナリデータ）を作成する
export const sha256 = async (s: string): Promise<ArrayBuffer> => {
  // 第1引数に指定したアルゴリズムで第2引数をハッシュ化させる。返り値はPromise。
  const digest = getCryptoSubtle().digest(
    "SHA-256",
    // 文字列をUTF-8にエンコード。Uint8Arrayを生成.
    new TextEncoder().encode(s)
  );
  return await digest;
};

// urlに乗せる値のため、url上で特別な意味を持つ +, /, = を変換している
const urlEncodeB64 = (input: string) => {
  const b64Chars: { [index: string]: string } = { "+": "-", "/": "_", "=": "" };
  // 正規表現にマッチした部分文字列を取得して b64Chars のkeyに指定してvalueに置き換えている
  return input.replace(/[+/=]/g, (m: string) => b64Chars[m]);
};

export const bufferToBase64UrlEncoded = (buffer: ArrayBuffer) => {
  // buffer を8ビット整数配列に変換
  const uint8array = new Uint8Array(buffer);

  console.log(uint8array);
  // 配列新たに生成
  console.log(...Array.from(uint8array));
  // UTF-16の対応した文字列を出力
  console.log("aaaaa");

  console.log(String.fromCharCode(...Array.from(uint8array)));
  console.log("iiiii");
  // base64 に変換
  console.log(window.btoa(String.fromCharCode(...Array.from(uint8array))));

  return urlEncodeB64(
    window.btoa(String.fromCharCode(...Array.from(uint8array)))
  );
};

// filter(): undefined をふるい落とす
// map(): key, value を = で結合した新しい配列を作成
// join(): 配列の要素ごとに & で結合
export const createQueryParams = (params: any) => {
  return Object.keys(params)
    .filter((k) => typeof params[k] !== "undefined")
    .map((k) => encodeURIComponent(k) + "=" + encodeURIComponent(params[k]))
    .join("&");
};
