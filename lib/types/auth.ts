export interface UserProfile {
  data: {
    firstname_en: string;
    lastname_en: string;
    firstname_th: string;
    lastname_th: string;
    title?: string;
    spacial_title?: string;
    position_en?: string;
    position_th?: string;
    department?: {
      id: string;
      name_th: string;
      name_en: string;
    };
    avatar_url?: string;
    email?: string;
  };
  full_name_en?: string;
}

export interface UserInfo {
  data: {
    email: string;
    role?: string;
    avatar?: string | null;
    [key: string]: unknown;
  };
}

export interface AuthSession {
  profile: UserProfile;
  userinfo: UserInfo;
}

export interface AppUser {
  name_en: string;
  name_th: string;
  role_en: string;
  role_th: string;
  avatar?: string;
}
