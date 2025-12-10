export type Locale = 'en' | 'zh';

export interface NavLink {
  label: string;
  href: string;
}

export interface HeaderCTA {
  login: string;
  getStarted: string;
}

export interface HeaderData {
  links: NavLink[];
  cta: HeaderCTA;
}

export interface FooterColumn {
  title: string;
  links: NavLink[];
}

export interface SocialLink {
  platform: string;
  href: string;
  label: string;
}

export interface NewsletterData {
  title: string;
  subtitle: string;
  placeholder: string;
  button: string;
}

export interface FooterData {
  description: string;
  columns: FooterColumn[];
  social: SocialLink[];
  newsletter: NewsletterData;
  copyright: string;
}

export interface NavigationData {
  header: Record<Locale, HeaderData>;
  footer: Record<Locale, FooterData>;
}

export interface HeroStat {
  value: string;
  label: string;
}

export interface HeroCTA {
  primary: string;
  secondary: string;
}

export interface HeroData {
  badge: string;
  title: string;
  titleHighlight: string;
  subtitle: string;
  cta: HeroCTA;
  stats: HeroStat[];
  trustedBy: string;
}

export interface PainPointItem {
  icon: string;
  title: string;
  description: string;
}

export interface PainPointsData {
  title: string;
  subtitle: string;
  items: PainPointItem[];
}

export interface FeatureItem {
  icon: string;
  title: string;
  description: string;
  badge: string | null;
}

export interface FeaturesData {
  title: string;
  subtitle: string;
  items: FeatureItem[];
}

export interface TestimonialItem {
  quote: string;
  author: string;
  role: string;
  location: string;
  avatar: string;
  rating: number;
}

export interface TestimonialsData {
  title: string;
  subtitle: string;
  items: TestimonialItem[];
}

export interface CTAData {
  title: string;
  subtitle: string;
  primaryButton: string;
  secondaryButton: string;
  note: string;
}

export interface LandingContentData {
  hero: Record<Locale, HeroData>;
  painPoints: Record<Locale, PainPointsData>;
  features: Record<Locale, FeaturesData>;
  testimonials: Record<Locale, TestimonialsData>;
  cta: Record<Locale, CTAData>;
}
