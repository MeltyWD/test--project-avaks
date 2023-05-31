import axios from "axios";
import convert, { Options } from "xml-js";
import { ICurrency } from "./types";

// Адрес получения валют
const url = "https://www.cbr.ru/scripts/XML_daily.asp";

// Удаление обертки { _Text: ...} в процессе конвертации из XML в JSON
const removeJsonTextAttribute = function (
  value: string,
  parentElement: any
): void {
  try {
    const pOpKeys = Object.keys(parentElement._parent);
    const keyNo = pOpKeys.length;
    const keyName = pOpKeys[keyNo - 1];
    const arrOfKey = parentElement._parent[keyName];
    const arrOfKeyLen = arrOfKey.length;
    if (arrOfKeyLen > 0) {
      const arr = arrOfKey;
      const arrIndex = arrOfKey.length - 1;
      arr[arrIndex] = value;
    } else {
      parentElement._parent[keyName] = value;
    }
  } catch (e) {}
};

// Опции для конвертации
const options: Options.XML2JSON = {
  compact: true,
  spaces: 2,
  alwaysChildren: true,
  ignoreDeclaration: true,
  ignoreAttributes: true,
  textFn: removeJsonTextAttribute,
};

export const getCurrency = async (): Promise<ICurrency[]> => {
  const { data } = await axios.get(url, {
    responseType: "arraybuffer",
    responseEncoding: "binary",
  });

  // Декодирование с кирилицы в utf-8 (иначе в данные попадут символы "?????")
  const decoder = new TextDecoder("windows-1251");
  const decodedData = decoder.decode(data);

  const {
    ValCurs: { Valute: currencyList },
  } = JSON.parse(convert.xml2json(decodedData, options));

  return currencyList;
};

// Тестовый запуск
(async () => {
  console.log(await getCurrency());
})();
