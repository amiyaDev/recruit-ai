// backend/schemas/user_schemas.py -> UserUpdate (both fields optional server-side
// for partial updates; the profile form always sends both since they're
// always populated in the UI).
export interface UserUpdatePayload {
  name?: string;
  email?: string;
}
