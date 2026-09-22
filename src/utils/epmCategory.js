import { Leaf, GraduationCap, Building2, Users, Globe, Calendar as CalendarIcon } from 'lucide-react';

// Single source of truth for how an EPM event's category (one of the fixed ids returned by
// GET /api/epm/events/categories - see EpmCategory on the backend) maps to an icon + accent
// color + list-card image, shared by the Epm landing page and the "All EPMs" listing so the same
// category always looks the same everywhere instead of drifting between two hand-rolled mappings.
const CATEGORY_META = {
  'GAP Workshop': { accent: 'green', icon: Leaf, badge: 'tag-green', img: '/images/epm/epm-compliance.avif' },
  'Capacity Building Trainings': { accent: 'teal', icon: GraduationCap, badge: 'tag-teal', img: '/images/epm/epm-training.avif' },
  'FPO Management Sessions': { accent: 'purple', icon: Building2, badge: 'tag-purple', img: '/images/epm/epm-msme.avif' },
  'EPM Meeting': { accent: 'blue', icon: Users, badge: 'tag-blue', img: '/images/epm/epm-buyer-seller.avif' },
  'Export Workshops': { accent: 'orange', icon: Globe, badge: 'tag-orange', img: '/images/epm/epm-global-market.avif' },
};
const FALLBACK = { accent: 'gray', icon: CalendarIcon, badge: 'tag-orange', img: '/images/epm/epm-packaging.avif' };

export function getCategoryMeta(category) {
  return CATEGORY_META[category] || FALLBACK;
}

export function getCategoryIcon(category) {
  return getCategoryMeta(category).icon;
}
