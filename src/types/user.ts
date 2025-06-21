export interface User {
  id: string;
  token: string;
  max_dive_number: number;
  name?: string;
  email?: string;
  // 他の必要なユーザー情報フィールドを追加
  createdAt?: string;
  updatedAt?: string;
}
