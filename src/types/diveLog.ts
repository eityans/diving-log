export enum TankMaterial {
  Steel = 0,
  Aluminum = 1,
}

export interface DiveLog {
  id: string;
  user_id: string;
  date: string;
  spot_name: string;
  point_name?: string;
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
  visibility?: number;
  air_remaining?: number;
  tank_capacity?: number;
  tank_material?: TankMaterial;
  memo?: string;
  created_at?: string;
  updated_at?: string;
}
