export enum QuestionType {
  SHORT_ANSWER = 'SHORT_ANSWER',
  PARAGRAPH = 'PARAGRAPH',
  MULTIPLE_CHOICE = 'MULTIPLE_CHOICE',
  CHECKBOXES = 'CHECKBOXES',
  DROPDOWN = 'DROPDOWN'
}

export interface Option {
  id: string;
  text: string;
}

export interface Question {
  id: string;
  type: QuestionType;
  title: string;
  required: boolean;
  options?: Option[]; // For choice-based questions
}

export interface FormSchema {
  id: string;
  title: string;
  description: string;
  questions: Question[];
  headerImage?: string; // URL or base64
}

export enum AppView {
  FORM_BUILDER = 'FORM_BUILDER',
  FORM_PREVIEW = 'FORM_PREVIEW',
  IMAGE_EDITOR = 'IMAGE_EDITOR'
}
