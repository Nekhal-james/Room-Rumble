import React from 'react';

type IconName = 'trophy' | 'medal-gold' | 'medal-silver' | 'medal-bronze' | 'user' | 'copy' | 'arrow-left' | 'question' | 'logo' | 'clock';

// FIX: Extend React.SVGProps<SVGSVGElement> to allow passing standard SVG attributes like `style`.
interface IconProps extends React.SVGProps<SVGSVGElement> {
  name: IconName;
  className?: string;
}

const ICONS: Record<IconName, React.ReactNode> = {
  'trophy': <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M19 3v4M5 21h14M12 3v18M12 3a4 4 0 00-4 4h8a4 4 0 00-4-4z" />,
  'medal-gold': <g fill="none" stroke="#F9A826" strokeWidth="2"><circle cx="12" cy="14" r="5"/><path d="M9 4l1 5 2-1.5L14 9l1-5H9z"/><path d="M12 19v-5"/></g>,
  'medal-silver': <g fill="none" stroke="#A0AEC0" strokeWidth="2"><circle cx="12" cy="14" r="5"/><path d="M9 4l1 5 2-1.5L14 9l1-5H9z"/><path d="M12 19v-5"/></g>,
  'medal-bronze': <g fill="none" stroke="#CD7F32" strokeWidth="2"><circle cx="12" cy="14" r="5"/><path d="M9 4l1 5 2-1.5L14 9l1-5H9z"/><path d="M12 19v-5"/></g>,
  'user': <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />,
  'copy': <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />,
  'arrow-left': <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />,
  'question': <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01" />,
  'logo': <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />,
  'clock': <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />,
};

const Icon: React.FC<IconProps> = ({ name, className, ...props }) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}>
      {ICONS[name]}
    </svg>
  );
};

export default Icon;
