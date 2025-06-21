export interface DiveLog {
  id: string;
  user_id: string;
  date: string;
  spot_name: string;
  dive_number: number;
  average_depth?: number;
  max_depth?: number;
  entry_time?: string;
  exit_time?: string;
  guide_name?: string;
  max_temp?: number;
  min_temp?: number;
  equipment?: string;
  weight?: number;
  created_at?: string;
  updated_at?: string;
}
