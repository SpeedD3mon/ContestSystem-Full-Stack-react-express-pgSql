type UserRole = "admin" | "vip" | "signed-in";

interface AuthUser {
  user_id: number;
  username: string;
  email: string;
  role: string;
  token: string;
}
