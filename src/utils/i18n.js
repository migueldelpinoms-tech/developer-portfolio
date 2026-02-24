import es from "../locales/es.json";
import en from "../locales/en.json";

const dictionaries = { es, en };
const DEFAULT_LANG = "es";

/**
 * Detecta idioma desde la URL (/es, /en)
 */
export function getLangFromUrl(url) {
  const [, lang] = url.pathname.split("/");
  return dictionaries[lang] ? lang : DEFAULT_LANG;
}

/**
 * Devuelve una función t(key)
 * ✔ Si existe → devuelve traducción
 * ✔ Si NO existe → devuelve la key (debug seguro)
 */
export function tFactory(lang) {
  const dict = dictionaries[lang] || dictionaries[DEFAULT_LANG];

  return function t(key) {
    if (!key) return "";

    const value = key
      .split(".")
      .reduce((obj, k) => obj?.[k], dict);

    // 🔴 CAMBIO IMPORTANTE AQUÍ
    if (value === undefined || value === null) {
      // Devuelve la key en vez de ""
      return key;
    }

    if (typeof value === "string") {
      return value;
    }

    return value;
  };
}
