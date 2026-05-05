import { StyleSheet } from 'react-native';

// ─── Color Palette ────────────────────────────────────────────────────────────

export const Color = {
  // Brand
  green:        '#003322',
  greenLight:   '#004433',
  greenDeep:    '#002218',
  gold:         '#C5A059',
  goldMuted:    'rgba(197,160,89,0.12)',
  goldBorder:   'rgba(197,160,89,0.2)',
  terracotta:   '#B35C37',
  terracottaDim: 'rgba(179,92,55,0.12)',

  // Neutrals
  white:        '#FFFFFF',
  offWhite:     '#F8F6F1',
  neutral50:    '#F9FAFB',
  neutral100:   '#F3F4F6',
  neutral300:   '#D1D5DB',
  neutral400:   '#9CA3AF',
  neutral600:   '#4B5563',
  neutral900:   '#111827',

  // Semantic
  success:      '#166534',
  successBg:    'rgba(22,101,52,0.08)',
  successBorder:'rgba(22,101,52,0.2)',
  error:        '#B35C37',
  errorBg:      'rgba(179,92,55,0.08)',
  errorBorder:  'rgba(179,92,55,0.2)',

  // Overlay
  scrim:        'rgba(0,0,0,0.65)',
  scrimLight:   'rgba(0,0,0,0.08)',
} as const;

// ─── Typography ───────────────────────────────────────────────────────────────

export const Font = {
  serif:        'PlayfairDisplay_700Bold',
  sans:         'Inter_400Regular',
  sansMedium:   'Inter_500Medium',
  sansBold:     'Inter_700Bold',
} as const;

export const FontSize = {
  xs:   10,
  sm:   12,
  base: 14,
  md:   16,
  lg:   18,
  xl:   22,
  '2xl': 26,
  '3xl': 32,
  '4xl': 44,
  '5xl': 52,
} as const;

export const LineHeight = {
  tight:  1.15,
  normal: 1.4,
  loose:  1.6,
} as const;

// ─── Spacing ──────────────────────────────────────────────────────────────────

export const Space = {
  1:  4,
  2:  8,
  3:  12,
  4:  16,
  5:  20,
  6:  24,
  8:  32,
  10: 40,
  12: 48,
} as const;

// ─── Radii ────────────────────────────────────────────────────────────────────

export const Radius = {
  sm:   8,
  md:   12,
  lg:   16,
  xl:   20,
  '2xl': 24,
  '3xl': 32,
  full: 9999,
} as const;

// ─── Shadows ──────────────────────────────────────────────────────────────────

export const Shadow = {
  card: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.10,
    shadowRadius: 16,
    elevation: 5,
  },
  cta: {
    shadowColor: Color.terracotta,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 14,
    elevation: 6,
  },
  modal: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.18,
    shadowRadius: 40,
    elevation: 12,
  },
  subtle: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
} as const;

// ─── Common StyleSheet snippets ───────────────────────────────────────────────

export const CommonStyles = StyleSheet.create({
  // Backgrounds
  screenBg: { flex: 1, backgroundColor: Color.green },

  // Text
  eyebrow: {
    color: Color.gold,
    fontSize: FontSize.xs,
    letterSpacing: 3,
    textTransform: 'uppercase',
    fontFamily: Font.sansMedium,
  },
  sectionTitle: {
    color: Color.white,
    fontSize: FontSize.lg,
    fontFamily: Font.serif,
  },
  bodyText: {
    color: Color.neutral400,
    fontSize: FontSize.base,
    fontFamily: Font.sans,
    lineHeight: FontSize.base * LineHeight.normal,
  },

  // Containers
  row: { flexDirection: 'row', alignItems: 'center' },
  center: { alignItems: 'center', justifyContent: 'center' },

  // Divider
  divider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.06)',
  },

  // Gold badge
  goldBadge: {
    backgroundColor: Color.goldMuted,
    borderRadius: Radius.full,
    paddingHorizontal: Space[3],
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: Color.goldBorder,
  },
  goldBadgeText: {
    color: Color.gold,
    fontSize: FontSize.sm,
    fontFamily: Font.sansMedium,
  },
});
