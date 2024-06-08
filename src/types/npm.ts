export interface NPMResponse {
  objects: Object[];
  total: number;
  time: string;
}

export interface Object {
  package: Package;
  flags: Flags;
  score: Score;
  searchScore: number;
}

export interface Flags {
  insecure: number;
}

export interface Package {
  name: string;
  scope: string;
  version: string;
  description: string;
  keywords: string[];
  date: Date;
  links: Links;
  publisher: Publisher;
  maintainers: Publisher[];
  author?: Author;
}

export interface Author {
  email?: string;
  name?: string;
  username?: string;
}

export interface Links {
  npm: string;
  homepage: string;
  repository: string;
  bugs?: string;
}

export interface Publisher {
  username: string;
  email: string;
}

export interface Score {
  final: number;
  detail: Detail;
}

export interface Detail {
  quality: number;
  popularity: number;
  maintenance: number;
}
