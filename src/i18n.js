import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import en from './locales/en.json';
import hi from './locales/hi.json';
import te from './locales/te.json';
import ta from './locales/ta.json';
import kn from './locales/kn.json';
import ml from './locales/ml.json';
import mr from './locales/mr.json';
import bn from './locales/bn.json';
import gu from './locales/gu.json';
import pa from './locales/pa.json';
import or from './locales/or.json';
import as from './locales/as.json';
import ur from './locales/ur.json';

const resources = {
  en: en,
  hi: hi,
  te: te,
  ta: ta,
  kn: kn,
  ml: ml,
  mr: mr,
  bn: bn,
  gu: gu,
  pa: pa,
  or: or,
  as: as,
  ur: ur,
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en', // default language
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false // react already safes from xss
    }
  });

export default i18n;
