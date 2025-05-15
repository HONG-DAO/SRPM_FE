import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import HOME_EN from '@cnpm/locales/en/home.json'
import HOME_VI from '@cnpm/locales/vi/home.json' 
 

export const resources = {
    en: {
      home: HOME_EN,
    },
    vi: {
      home: HOME_VI,
    }
  } as const;

const defaultNS = 'home'

export default defaultNS;

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'vi',   //main language
    ns:['home'],
    defaultNS,
    fallbackLng : 'vi',  //backup language
    interpolation: {
        escapeValue: false // react already safes from xss
    }
  })
