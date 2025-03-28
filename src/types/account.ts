
export interface Account {
  id: string;
  alias: string;
  email: string;
  password: string;
  color: AccountColor;
  order: number;
  token?: string;
}

export type AccountColor = 
  | 'red' | 'orange' | 'amber' | 'yellow' 
  | 'lime' | 'green' | 'emerald' | 'teal' 
  | 'cyan' | 'sky' | 'blue' | 'indigo' 
  | 'violet' | 'purple' | 'fuchsia' | 'pink' | 'rose';

export const accountColors: AccountColor[] = [
  'red', 'orange', 'amber', 'yellow', 
  'lime', 'green', 'emerald', 'teal', 
  'cyan', 'sky', 'blue', 'indigo', 
  'violet', 'purple', 'fuchsia', 'pink', 'rose'
];
