import { en } from '$core/error/localize/en';
import { ko } from '$core/error/localize/ko';

export type ServerLocale = 'en' | 'ko';
export interface ErrorMessage {
  not_found_user: string;
}

export const localizedMessage = (locale: ServerLocale, message: keyof ErrorMessage) => {
  switch (locale) {
    case 'ko':
      return ko[message];
    default:
      return en[message];
  }
};
