export interface User {
  id: string;
  token: string;
  name?: string;
  email?: string;
  // 他の必要なユーザー情報フィールドを追加
  createdAt?: string;
  updatedAt?: string;
}
