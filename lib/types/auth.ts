export interface UserProfile {
  status?: number;
  message?: string;
  data: {
    firstname_en: string;
    lastname_en: string;
    firstname_th: string;
    lastname_th: string;
    title?: string;
    spacial_title?: string;
    gender?: string;
    birth_date?: string | null;
    position_en?: string;
    position_th?: string;
    department?: {
      id: string;
      name_th: string;
      name_en: string;
    };
    major?: {
      id: string;
      name_th: string;
      name_en: string;
      degree?: {
        id: number;
        name_th: string;
        name_en: string;
      };
    };
    minor?: string;
    role?: string;
    avatar_url?: string;
    email?: string;
  };
  full_name_en?: string;
}

export interface UserInfo {
  status?: number;
  message?: string;
  data: {
    id?: string;
    email: string;
    email_second?: string;
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
  name: string;
  role: string;
  avatar?: string;
  position?: string;
}
