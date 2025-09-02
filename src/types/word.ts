export interface Word {
  id: string;
  english: string;
  japanese: string;
  pronunciation?: string;
  example?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface WordFormData {
  english: string;
  japanese: string;
  pronunciation?: string;
  example?: string;
}