import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import {
  initReactI18next,
} from "react-i18next";

//Translation Files

// English
import enGB from "./translations/en-GB";

// Portuguese
import ptPT from "./translations/pt-PT";
import ptBR from "./translations/pt-BR";

// Russian
import ru from "./translations/ru";

// German
import de from "./translations/de";

// Spanish
import esES from "./translations/es-ES";

// French
import fr from "./translations/fr";

// Japanese
import jp from "./translations/jp";

// Italian
import it from "./translations/it";

import nbNO from "./translations/nb-NO";

// Chinese
import zhHans from "./translations/zh-Hans";
import zhHant from "./translations/zh-Hant";

const resources = {
  de: {
    translation: de,
  },
  "en-GB": {
    translation: enGB,
  },
  "es-ES": {
    translation: esES,
  },
  fr: {
    translation: fr,
  },
  it: {
    translation: it,
  },
  jp: {
    translation: jp,
  },
  "nb-NO": {
    translation: nbNO,
  },
  "pt-BR": {
    translation: ptBR,
  },
  "pt-PT": {
    translation: ptPT,
  },
  ru: {
    translation: ru,
  },
  "zh-Hans": {
    translation: zhHans,
  },
  "zh-Hant": {
    translation: zhHant,
  },
};

const detectionSettings = {
  order: ["querystring", "cookie", "localStorage", "navigator", "htmlTag", "path", "subdomain"],
  lookupQuerystring: "hl"
};

i18n
  .use(initReactI18next)
  .use(LanguageDetector)
  .init({
    detection: detectionSettings,
    resources,
    fallbackLng: {
      pt: ["pt-PT", "pt-BR"],
      en: ["en-GB"],
      es: ["es-ES"],
      zh: ["zh-Hans", "zh-Hant"],
      no: ["nb-NO"],
      default: ["en-GB"]
    },
    keySeparator: false,
    interpolation: {
      escapeValue: false,
    },
    react: {
      wait: true,
    }
  });

document.documentElement.lang = i18n.language.toLowerCase();

export default i18n;