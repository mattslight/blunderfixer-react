import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';

export interface StreamingPlatform {
  type: string;
  channel_url: string;
}

export interface Profile {
  player_id?: number;
  id?: string; // the @id field
  url?: string;
  username: string;
  name?: string;
  title?: string;
  avatar?: string;
  followers?: number;
  country?: string; // URL to country
  location?: string;
  last_online?: number;
  joined?: number;
  status?: string; // e.g. "premium"
  is_streamer?: boolean;
  twitch_url?: string;
  verified?: boolean;
  league?: string;
  streaming_platforms?: StreamingPlatform[];
}

interface ProfileContextType {
  profile: Profile;
  setUsername: (u: string) => void;
  isLoading: boolean;
  error: string | null;
}

const PROFILE_KEY = 'bf:profileData';
const ProfileContext = createContext<ProfileContextType | null>(null);

export function ProfileProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<Profile>(() => {
    try {
      const raw = localStorage.getItem(PROFILE_KEY);
      return raw ? JSON.parse(raw) : { username: '' };
    } catch {
      return { username: '' };
    }
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
  }, [profile]);

  const fetchProfile = useCallback(async (username: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch(
        `https://api.chess.com/pub/player/${username.toLowerCase()}`
      );
      if (!res.ok) throw new Error('User not found');
      const data = await res.json();
      setProfile({
        username: data.username,
        player_id: data.player_id,
        id: data['@id'],
        url: data.url,
        name: data.name,
        title: data.title,
        avatar: data.avatar,
        followers: data.followers,
        country: data.country,
        location: data.location,
        last_online: data.last_online,
        joined: data.joined,
        status: data.status,
        is_streamer: data.is_streamer,
        twitch_url: data.twitch_url,
        verified: data.verified,
        league: data.league,
        streaming_platforms: data.streaming_platforms,
      });
    } catch (err) {
      setError(err.message || 'Failed to load profile');
      // keep previous profile.username so input still shows
    } finally {
      setIsLoading(false);
    }
  }, []);

  const setUsername = useCallback((username: string) => {
    setProfile((p) => ({ ...p, username }));
  }, []);

  // on mount or when profile.username changes
  useEffect(() => {
    if (profile.username) fetchProfile(profile.username);
  }, [profile.username, fetchProfile]);

  return (
    <ProfileContext.Provider value={{ profile, setUsername, isLoading, error }}>
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfile() {
  const ctx = useContext(ProfileContext);
  if (!ctx) throw new Error('useProfile must be used within a ProfileProvider');
  return ctx;
}
