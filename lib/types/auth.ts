export interface UserProfile {
  data: {
    firstname_en: string;
    lastname_en: string;
    firstname_th: string;
    lastname_th: string;
    position_en: string;
    position_th: string;
    avatar_url?: string;
    email?: string;
  };
  full_name_en?: string;
}

export interface UserInfo {
  data: {
    email: string;
    [key: string]: unknown;
  };
}

export interface AuthSession {
  profile: UserProfile;
  userinfo: UserInfo;
}

export interface AppUser {
  name: string;
  role: string;
  avatar?: string;
}
