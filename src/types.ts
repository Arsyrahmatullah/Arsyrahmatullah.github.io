export interface GithubRepo {
  title: string;
  subtitle: string;
  description: string;
  primaryLanguage: string;
  stars: string;
  url: string;
  systemClass: string;
  coverImg: string;
}

export interface FlightAct {
  id: string;
  start: number;
  end: number;
  mode: 'punch' | 'read';
}
