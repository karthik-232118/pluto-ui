import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import en from "./locales/en.json";
import hi from "./locales/hi.json";
import fr from "./locales/fr.json";
import es from "./locales/es.json";
import de from "./locales/de.json";
import ar from "./locales/ar.json";
import pt from "./locales/pt.json";
import ms from "./locales/ms.json";
import is from "./locales/is.json";
import zh from "./locales/zh.json";

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en }, //English
    hi: { translation: hi }, //Hindi
    fr: { translation: fr }, //French
    es: { translation: es }, //Spanish
    de: { translation: de }, //German
    ar: { translation: ar }, //Arabic
    pt: { translation: pt }, //Portuguese
    ms: { translation: ms }, //Malay
    is: { translation: is }, //Icelandic
    zh: { translation: zh }, //Chinese (Mandarin)
  },
  lng: "en",
  fallbackLng: "en",
  interpolation: { escapeValue: false },
});

export default i18n;
