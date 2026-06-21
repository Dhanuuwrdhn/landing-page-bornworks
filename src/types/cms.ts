/**
 * CMS type definitions — mirror the Prisma schema on the NestJS CMS.
 * These types match the JSON shape returned by the CMS API endpoints.
 */

export type Json = Record<string, unknown>;

export interface LocalizedString {
  en: string;
  id: string;
}

/* ── Hero ────────────────────────────────────────────── */
export interface HeroCta {
  label: LocalizedString;
  href: string;
}

export interface HeroSection {
  id?:               number;
  eyebrow:          LocalizedString;
  titleLines:       LocalizedString[];
  typewriterPhrases: {
    en: string[];
    id: string[];
  };
  subtitle:         LocalizedString;
  subtitle2?:       LocalizedString;
  primaryCta:       HeroCta;
  secondaryCta:     HeroCta;
  stats?:           Json;
  updatedAt?:       string;
}

/* ── About ───────────────────────────────────────────── */
export interface AboutValue {
  icon:  string;
  title: string;
  desc:  string;
}

export interface AboutSection {
  id?:        number;
  label:      LocalizedString;
  heading:    LocalizedString;
  sub:        LocalizedString;
  badge:      LocalizedString;
  values:     { en: AboutValue[]; id: AboutValue[] };
  updatedAt?: string;
}

/* ── Services ────────────────────────────────────────── */
export interface ServiceItem {
  id:          string;
  icon:        string;
  title:       LocalizedString;
  description: LocalizedString;
  features:    { en: string[]; id: string[] };
  order:       number;
  createdAt?:  string;
  updatedAt?:  string;
}

/* ── Process ─────────────────────────────────────────── */
export interface ProcessStep {
  id:          string;
  icon?:       string;
  number:      string;
  title:       LocalizedString;
  description: LocalizedString;
  order:       number;
  createdAt?:  string;
  updatedAt?:  string;
}

/* ── Portfolio ────────────────────────────────────────── */
export interface PortfolioItem {
  id:          string;
  title:       LocalizedString;
  description: LocalizedString;
  tags:        { en: string[]; id: string[] };
  imageUrl:    string;
  url:         string;
  accentClass: string;
  bgClass:     string;
  order:       number;
  createdAt?:  string;
  updatedAt?:  string;
}

/* ── CTA ─────────────────────────────────────────────── */
export interface CtaSection {
  id?:             number;
  badge:          LocalizedString;
  line1:          LocalizedString;
  line2:          LocalizedString;
  sub:            LocalizedString;
  waCta:          LocalizedString;
  emailLabel:     LocalizedString;
  note:           LocalizedString;
  whatsappNumber: string;
  waMessage:      LocalizedString;
  updatedAt?:     string;
}

/* ── Footer ──────────────────────────────────────────── */
export interface FooterLink {
  label: string;
  href:  string;
}

export interface FooterLinkGroup {
  title:  string;
  links:  FooterLink[];
}

export interface FooterSection {
  id?:            number;
  desc:           LocalizedString;
  email:          string;
  location:       string;
  copyrightName:  string;
  rights:         LocalizedString;
  backTop:        LocalizedString;
  linkGroups:     { en: FooterLinkGroup[]; id: FooterLinkGroup[] };
  updatedAt?:     string;
}

/* ── Site Settings ────────────────────────────────────── */
export interface SiteSettings {
  id?:             number;
  whatsappNumber: string;
  contactEmails:  string[];
  siteUrl:        string;
  defaultLang:    string;
  updatedAt?:     string;
}

/* ── Section Labels ───────────────────────────────────── */
export interface SectionLabels {
  id?:        number;
  services:  { en: { label: string; sub: string }; id: { label: string; sub: string } };
  process:   { en: { label: string; sub: string }; id: { label: string; sub: string } };
  portfolio: { en: { label: string; view: string }; id: { label: string; view: string } };
  updatedAt?: string;
}

/* ── Full page data (returned by getCmsPageData) ──────── */
export interface CmsPageData {
  hero:           HeroSection;
  about:          AboutSection;
  services:       ServiceItem[];
  process:        ProcessStep[];
  portfolio:       PortfolioItem[];
  cta:            CtaSection;
  footer:         FooterSection;
  sectionLabels?: SectionLabels;
}
