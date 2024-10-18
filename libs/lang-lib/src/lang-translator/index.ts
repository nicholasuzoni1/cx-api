import { LangTranslation } from '../lang-translation';

const LangObject = {
  en: 'english',
  es: 'spanish',
} as const;

export type LangType = 'en' | 'es-MX';

export const LangTranslator = (key: string, lang: LangType = 'en') => {
  const langName = LangObject[lang] ? LangObject[lang] : LangObject.en;

  const translation =
    LangTranslation[key] && LangTranslation[key][langName]
      ? LangTranslation[key][langName]
      : 'Something went wrong';
  return translation;
};
