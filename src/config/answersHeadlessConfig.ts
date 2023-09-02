import { AnswersHeadlessProvider } from '@yext/answers-headless-react';

type HeadlessProviderProps = Parameters<typeof AnswersHeadlessProvider>[0];

export const answersHeadlessConfig: HeadlessProviderProps = {
  apiKey: 'e00ed8254f827f6c73044941473bb9e9',
  experienceKey: 'answers',
  locale: 'en',
  sessionTrackingEnabled: true
};