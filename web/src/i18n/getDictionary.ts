import 'server-only';

import { Locale } from './config';
import { Dictionary } from './types';

const dictionaries = {
  pt: () =>
    import('./dictionaries/pt.json').then(
      (module) => module.default,
    ),

  en: () =>
    import('./dictionaries/en.json').then(
      (module) => module.default,
    ),

  de: () =>
    import('./dictionaries/de.json').then(
      (module) => module.default,
    ),
};

export async function getDictionary(
  locale: Locale,
): Promise<Dictionary> {
  return dictionaries[locale]();
}