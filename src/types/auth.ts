export interface UserData {
  id: string;
  nik: string;
  nama: string;
  nomorKartu: string;
  nomorAnggota: string;
  email: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  userData: UserData | null;
  isLoading: boolean;
}
