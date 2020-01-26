import NextI18Next from "next-i18next";

const detectionSettings = {
  order: ["querystring", "cookie", "localStorage", "navigator", "htmlTag", "path", "subdomain"],
  lookupQuerystring: "hl"
};

const NextI18NextInstance = new NextI18Next({
  detection: detectionSettings,
  defaultLanguage: "en",
  otherLanguages: ["pl"],
  fallbackLng: ["en"],
  localePath:
    typeof window === "undefined" ? "src/web/static/locales" : "static/locales",
  debug: true,
  initImmediate: false,
});

function useTranslation(namespace:string | Array<string> = "common") {
  return NextI18NextInstance.useTranslation(namespace, { i18n: NextI18NextInstance.i18n, useSuspense: false });
}

const { Trans, i18n } = NextI18NextInstance;

export {
  useTranslation,
  Trans,
  i18n
};
