export interface NavLink {
  label: string;
  href: string;
}

export interface TrustedCompany {
  name: string;
  icon: string;
}

export interface Stat {
  label: string;
  value: string;
  emphasis?: boolean;
}

export interface Testimonial {
  initials: string;
  name: string;
  role: string;
  quote: string;
  avatarClassName: string;
}
