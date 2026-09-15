const base = { fill: "none", stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round", strokeLinejoin: "round" };

function Svg({ children, size = 18, className = "" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className} {...base}>
      {children}
    </svg>
  );
}

export const IconHome = (p) => (
  <Svg {...p}>
    <path d="M3 11.5 12 4l9 7.5" />
    <path d="M5 10v9a1 1 0 0 0 1 1h4v-6h4v6h4a1 1 0 0 0 1-1v-9" />
  </Svg>
);
export const IconUsers = (p) => (
  <Svg {...p}>
    <circle cx="9" cy="8" r="3.2" />
    <path d="M2.5 20a6.5 6.5 0 0 1 13 0" />
    <circle cx="17.5" cy="9" r="2.6" />
    <path d="M15.3 12.2a5.2 5.2 0 0 1 6.2 5.1" />
  </Svg>
);
export const IconCalendar = (p) => (
  <Svg {...p}>
    <rect x="3.5" y="5" width="17" height="15.5" rx="2" />
    <path d="M3.5 9.5h17M8 3v4M16 3v4" />
  </Svg>
);
export const IconClock = (p) => (
  <Svg {...p}>
    <circle cx="12" cy="12" r="8.5" />
    <path d="M12 7.5V12l3 2" />
  </Svg>
);
export const IconBriefcase = (p) => (
  <Svg {...p}>
    <rect x="3" y="7.5" width="18" height="12" rx="2" />
    <path d="M8 7.5V6a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v1.5M3 12.5h18" />
  </Svg>
);
export const IconLogOut = (p) => (
  <Svg {...p}>
    <path d="M9 4H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h3M15.5 16.5 20 12l-4.5-4.5M20 12H9" />
  </Svg>
);
export const IconSettings = (p) => (
  <Svg {...p}>
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 13.5a1.8 1.8 0 0 0 .36 1.98l.04.04a2.2 2.2 0 1 1-3.1 3.1l-.05-.05a1.8 1.8 0 0 0-1.98-.36 1.8 1.8 0 0 0-1.1 1.65V20a2.2 2.2 0 0 1-4.4 0v-.1a1.8 1.8 0 0 0-1.18-1.65 1.8 1.8 0 0 0-1.98.36l-.05.05a2.2 2.2 0 1 1-3.1-3.1l.05-.04a1.8 1.8 0 0 0 .36-1.98A1.8 1.8 0 0 0 1.2 12.4H1.1a2.2 2.2 0 0 1 0-4.4h.1a1.8 1.8 0 0 0 1.65-1.18 1.8 1.8 0 0 0-.36-1.98l-.05-.05a2.2 2.2 0 1 1 3.1-3.1l.04.05a1.8 1.8 0 0 0 1.98.36H7.6A1.8 1.8 0 0 0 9.25 1.1V1a2.2 2.2 0 0 1 4.4 0v.1a1.8 1.8 0 0 0 1.1 1.65 1.8 1.8 0 0 0 1.98-.36l.05-.05a2.2 2.2 0 1 1 3.1 3.1l-.05.04a1.8 1.8 0 0 0-.36 1.98v.05a1.8 1.8 0 0 0 1.65 1.1h.1a2.2 2.2 0 0 1 0 4.4h-.1a1.8 1.8 0 0 0-1.65 1.1Z" />
  </Svg>
);
export const IconHelp = (p) => (
  <Svg {...p}>
    <circle cx="12" cy="12" r="8.5" />
    <path d="M9.2 9.3a2.8 2.8 0 1 1 4 2.55C12.4 12.4 12 12.9 12 14" />
    <path d="M12 17h.01" />
  </Svg>
);
export const IconChart = (p) => (
  <Svg {...p}>
    <path d="M4 20V10M10 20V4M16 20v-7M4 20h16" />
  </Svg>
);
export const IconBuilding = (p) => (
  <Svg {...p}>
    <rect x="4" y="3" width="10" height="18" rx="1" />
    <rect x="14" y="9" width="6" height="12" rx="1" />
    <path d="M7 7h1M11 7h1M7 11h1M11 11h1M7 15h1M11 15h1" />
  </Svg>
);
export const IconUserPlus = (p) => (
  <Svg {...p}>
    <circle cx="9" cy="8" r="3.5" />
    <path d="M2.5 20a6.5 6.5 0 0 1 13 0" />
    <path d="M18 8v6M15 11h6" />
  </Svg>
);
export const IconUserMinus = (p) => (
  <Svg {...p}>
    <circle cx="9" cy="8" r="3.5" />
    <path d="M2.5 20a6.5 6.5 0 0 1 13 0" />
    <path d="M15 11h6" />
  </Svg>
);
export const IconFile = (p) => (
  <Svg {...p}>
    <path d="M6 3h8l5 5v13a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Z" />
    <path d="M14 3v5h5" />
  </Svg>
);
export const IconShield = (p) => (
  <Svg {...p}>
    <path d="M12 3 5 6v6c0 4.5 3 7.5 7 9 4-1.5 7-4.5 7-9V6l-7-3Z" />
  </Svg>
);
export const IconMenu = (p) => (
  <Svg {...p}>
    <path d="M4 7h16M4 12h16M4 17h16" />
  </Svg>
);
export const IconSun = (p) => (
  <Svg {...p}>
    <circle cx="12" cy="12" r="4.2" />
    <path d="M12 2.5v2M12 19.5v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2.5 12h2M19.5 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
  </Svg>
);
export const IconMoon = (p) => (
  <Svg {...p}>
    <path d="M20 14.5A8.5 8.5 0 1 1 9.5 4a6.8 6.8 0 0 0 10.5 10.5Z" />
  </Svg>
);
export const IconBell = (p) => (
  <Svg {...p}>
    <path d="M6 9a6 6 0 0 1 12 0c0 5 2 6 2 6H4s2-1 2-6Z" />
    <path d="M10 19a2 2 0 0 0 4 0" />
  </Svg>
);
export const IconChevronDown = (p) => (
  <Svg {...p}>
    <path d="m6 9 6 6 6-6" />
  </Svg>
);
export const IconArrowRight = (p) => (
  <Svg {...p}>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </Svg>
);
export const IconCheck = (p) => (
  <Svg {...p}>
    <path d="M5 12.5 10 17l9-10.5" />
  </Svg>
);
export const IconX = (p) => (
  <Svg {...p}>
    <path d="M6 6l12 12M18 6 6 18" />
  </Svg>
);
export const IconSwap = (p) => (
  <Svg {...p}>
    <path d="M4 8h13M13 4l4 4-4 4" />
    <path d="M20 16H7M11 12l-4 4 4 4" />
  </Svg>
);
export const IconMapPin = (p) => (
  <Svg {...p}>
    <path d="M12 21s7-6.2 7-11.5A7 7 0 0 0 5 9.5C5 14.8 12 21 12 21Z" />
    <circle cx="12" cy="9.5" r="2.3" />
  </Svg>
);
export const IconLayers = (p) => (
  <Svg {...p}>
    <path d="m12 3 8.5 4.5L12 12 3.5 7.5 12 3Z" />
    <path d="m3.5 12 8.5 4.5 8.5-4.5M3.5 16.5 12 21l8.5-4.5" />
  </Svg>
);
export const IconSearch = (p) => (
  <Svg {...p}>
    <circle cx="11" cy="11" r="7" />
    <path d="m20 20-4.3-4.3" />
  </Svg>
);
export const IconTicket = (p) => (
  <Svg {...p}>
    <path d="M3 8.5A1.5 1.5 0 0 1 4.5 7h15A1.5 1.5 0 0 1 21 8.5V10a2 2 0 0 0 0 4v1.5A1.5 1.5 0 0 1 19.5 17h-15A1.5 1.5 0 0 1 3 15.5V14a2 2 0 0 0 0-4Z" />
  </Svg>
);
