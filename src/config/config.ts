/**
 * Configurações técnicas globais do sistema GGST Combo Maker.
 * Conforme especificado na seção 20 do FSD, este arquivo substitui o uso de arquivos .env
 * e centraliza chaves lógicas do Local Storage, parâmetros de migrations e listas fixas.
 */

export const APP_CONFIG = {
  appName: 'GGST Combo Maker',
  version: '1.0.0',
  storageKeys: {
    folders: 'ggst_cm_folders',
    combos: 'ggst_cm_combos',
    settings: 'ggst_cm_settings',
    migrations: 'ggst_cm_migrations',
  },
  migrations: {
    currentVersion: 1,
  },
  defaults: {
    visualPreference: 'arrows' as 'arrows' | 'numpad',
  },
  characters: [
    'A.B.A',
    'Anji Mito',
    'Asuka R#',
    'Axl Low',
    'Baiken',
    'Bedman?',
    'Bridget',
    'Chipp Zanuff',
    'Elphelt Valentine',
    'Faust',
    'Giovanna',
    'Goldlewis Dickinson',
    'Happy Chaos',
    'I-No',
    "Jack-O'",
    'Jam Kuradoberi',
    'Johnny',
    'Ky Kiske',
    'Leo Whitefang',
    'Lucy',
    'Millia Rage',
    'Nagoriyuki',
    'Potemkin',
    'Queen Dizzy',
    'Ramlethal Valentine',
    'Robo-Ky',
    'Sin Kiske',
    'Slayer',
    'Sol Badguy',
    'Testament',
    'Unika',
    'Venom',
    'Zato-1',
  ] as const,
} as const;

export type CharacterName = (typeof APP_CONFIG.characters)[number];
