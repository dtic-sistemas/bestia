// User
export interface User {
  id: string;
  email: string;
  created_at: string;
  updated_at: string;
}

// Pet
export interface Pet {
  id: string;
  owner_id: string;
  name: string;
  species: 'gato' | 'perro' | 'otro';
  photo_url: string;
  created_at: string;
  total_votes: number;
  wins: number;
  losses: number;
}

// Duel
export interface Duel {
  id: string;
  pet1_id: string;
  pet2_id: string;
  winner_id: string | null;
  bracket_round: number | null;
  is_consolation: boolean;
  created_at: string;
  expires_at: string;
  result_displayed_at: string | null;
}

// Vote
export interface Vote {
  id: string;
  duel_id: string;
  pet_id: string;
  user_ip: string;
  device_fingerprint: string;
  created_at: string;
}

// Email Signup
export interface EmailSignup {
  id: string;
  email: string;
  device_fingerprint: string;
  source_duel_id: string;
  created_at: string;
  converted_to_user_id: string | null;
}
