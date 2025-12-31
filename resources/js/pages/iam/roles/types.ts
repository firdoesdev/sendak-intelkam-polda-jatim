export type TPermission = {
  id: number;
  name: string;
  guard_name: string;
  created_at: string;
  updated_at: string;
};

export type TRole = {
  id: number;
  name: string;
  guard_name: string;
  created_at: string;
  updated_at: string;
  permissions?: TPermission[];
}