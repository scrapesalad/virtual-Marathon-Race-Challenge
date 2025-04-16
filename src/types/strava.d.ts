declare module 'strava-v3' {
  export interface StravaActivity {
    id: number;
    name: string;
    distance: number;
    moving_time: number;
    elapsed_time: number;
    total_elevation_gain: number;
    type: string;
    start_date: string;
    start_date_local: string;
    timezone: string;
    start_latlng: [number, number];
    end_latlng: [number, number];
    map: {
      id: string;
      summary_polyline: string;
      polyline: string;
    };
  }

  export interface StravaAthlete {
    id: number;
    username: string;
    firstname: string;
    lastname: string;
    city: string;
    state: string;
    country: string;
    profile: string;
  }

  export interface StravaClient {
    athlete: {
      listActivities(params: { access_token: string; per_page?: number; page?: number }): Promise<StravaActivity[]>;
      get(params: { access_token: string }): Promise<StravaAthlete>;
    };
    oauth: {
      getToken(params: {
        client_id: string;
        client_secret: string;
        code: string;
        grant_type?: string;
      }): Promise<{
        token_type: string;
        expires_at: number;
        expires_in: number;
        refresh_token: string;
        access_token: string;
        athlete: StravaAthlete;
      }>;
    };
  }

  const strava: StravaClient;
  export default strava;
} 