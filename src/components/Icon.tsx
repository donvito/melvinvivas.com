import { useId } from "react";

export type IconName =
  | "computer"
  | "folder"
  | "writing"
  | "contact"
  | "notepad"
  | "recycle"
  | "settings"
  | "web"
  | "arrow"
  | "code";

export function Icon({ name, size = 40 }: { name: IconName; size?: number }) {
  const id = useId().replaceAll(":", "");
  const blue = `url(#${id}blue)`;
  const gold = `url(#${id}gold)`;
  const silver = `url(#${id}silver)`;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      aria-hidden="true"
      className="xp-icon"
    >
      <defs>
        <linearGradient
          id={`${id}blue`}
          x1="12"
          y1="10"
          x2="45"
          y2="55"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#8fe4ff" />
          <stop offset=".5" stopColor="#2984e0" />
          <stop offset="1" stopColor="#0648a2" />
        </linearGradient>
        <linearGradient
          id={`${id}gold`}
          x1="15"
          y1="20"
          x2="35"
          y2="60"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#fff4aa" />
          <stop offset=".5" stopColor="#ffd562" />
          <stop offset="1" stopColor="#d99a29" />
        </linearGradient>
        <linearGradient
          id={`${id}silver`}
          x1="10"
          y1="6"
          x2="45"
          y2="55"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#fff" />
          <stop offset=".5" stopColor="#e9e9dd" />
          <stop offset="1" stopColor="#8c9ca3" />
        </linearGradient>
      </defs>
      {name === "computer" && (
        <>
          <path d="M25 44h15v10h9v5H14v-5h11z" fill={silver} stroke="#667583" />
          <rect
            x="7"
            y="5"
            width="49"
            height="40"
            rx="4"
            fill={silver}
            stroke="#647684"
            strokeWidth="1.5"
          />
          <rect
            x="12"
            y="10"
            width="39"
            height="28"
            rx="1"
            fill={blue}
            stroke="#183b68"
          />
          <path d="M13 30q19-15 37-2v9H13z" fill="#7fc444" />
          <path d="M15 13h33" stroke="#ceefff" opacity=".7" />
          <circle cx="48" cy="41" r="1" fill="#47b444" />
        </>
      )}
      {name === "folder" && (
        <>
          <path
            d="M5 15q0-4 4-4h16l6 7h24v36H5z"
            fill="#edb648"
            stroke="#aa7f26"
          />
          <path d="M6 23h53l-6 31H7z" fill={gold} stroke="#bc9038" />
          <path d="M10 26h43" stroke="#fff8bf" strokeWidth="2" />
          <path d="M9 51h41" stroke="#c99b46" opacity=".5" />
        </>
      )}
      {(name === "writing" || name === "notepad") && (
        <>
          <path d="M13 5h37v51H13z" fill={blue} stroke="#325986" />
          <path d="m9 8 36-3 5 49-36 5z" fill="#fffff3" stroke="#778887" />
          <path
            d="m16 18 24-2m-23 9 24-2m-23 9 24-2m-23 9 17-2"
            stroke="#88b5c9"
            strokeWidth="1.5"
          />
          <path d="m11 12 33-3" stroke="#cb4c54" />
          {name === "writing" && (
            <>
              <path
                d="m36 46 15-30 7 4-15 30-8 5z"
                fill={gold}
                stroke="#9c7029"
              />
              <path d="m35 55 2-9 6 4z" fill="#e4c6a0" />
              <path d="m35 55 1-4 3 2z" fill="#333" />
            </>
          )}
        </>
      )}
      {name === "contact" && (
        <>
          <path d="M7 21 32 5l25 16v33H7z" fill={gold} stroke="#ae8836" />
          <path d="M16 10h32v34H16z" fill="#fffef8" stroke="#aaa" />
          <path
            d="M22 19h20m-20 6h20m-20 6h13"
            stroke="#89a7bd"
            strokeWidth="2"
          />
          <path d="m7 21 25 18 25-18v33H7z" fill={gold} stroke="#b5924d" />
          <path d="m7 54 19-19m31 19L38 35" stroke="#c19b53" />
        </>
      )}
      {name === "recycle" && (
        <>
          <path
            d="m14 15 5 42q13 5 26-1l6-41"
            fill={silver}
            fillOpacity=".85"
            stroke="#80929c"
            strokeWidth="1.5"
          />
          <ellipse
            cx="32"
            cy="15"
            rx="20"
            ry="7"
            fill="#edf7fb"
            stroke="#7e919d"
            strokeWidth="2"
          />
          <ellipse cx="32" cy="15" rx="14" ry="3.5" fill="#8faab7" />
          <path
            d="m27 29 5-7 6 8h-4l-2-3-2 3zm13 4 5 7-10 3 1-4 4-1-2-3zm-11 10-9-1 3-10 3 3-1 4h4z"
            fill="#3eaa59"
          />
          <path d="m18 23 3 29" stroke="#fff" strokeWidth="2" />
        </>
      )}
      {name === "web" && (
        <>
          <circle cx="32" cy="32" r="24" fill={blue} stroke="#1162ab" />
          <ellipse
            cx="32"
            cy="32"
            rx="11"
            ry="24"
            stroke="#b0eeff"
            strokeWidth="1.5"
          />
          <path
            d="M9 25h46M9 40h46M32 8v48"
            stroke="#9ce8ff"
            strokeWidth="1.5"
          />
          <ellipse
            cx="32"
            cy="34"
            rx="32"
            ry="12"
            transform="rotate(-35 32 34)"
            stroke="#edbf49"
            strokeWidth="4"
          />
          <path
            d="M21 38h25q3-21-12-21-17 0-17 18 1 16 22 12l7-7"
            stroke="white"
            strokeWidth="5"
          />
        </>
      )}
      {name === "settings" && (
        <>
          <rect
            x="6"
            y="7"
            width="46"
            height="35"
            rx="3"
            fill={silver}
            stroke="#546a89"
          />
          <rect x="11" y="12" width="36" height="24" fill={blue} />
          <path d="m18 55 10-15h9l7 15" fill={silver} stroke="#758595" />
          <path
            d="m37 43 6-6 5 3 7-2 4 8-6 5-1 8-9-1-2-8z"
            fill={gold}
            stroke="#9f842f"
          />
          <circle cx="48" cy="47" r="5" fill="#faf8ed" stroke="#ae8926" />
        </>
      )}
      {name === "code" && (
        <>
          <rect
            x="5"
            y="10"
            width="54"
            height="43"
            rx="3"
            fill={silver}
            stroke="#455b74"
          />
          <path d="M8 13h48v8H8z" fill={blue} />
          <rect x="9" y="23" width="46" height="25" fill="#143652" />
          <path
            d="m23 29-7 6 7 6m17-12 7 6-7 6m-5-14-7 16"
            stroke="#b6f2d1"
            strokeWidth="3"
          />
        </>
      )}
      {name === "arrow" && (
        <>
          <circle cx="32" cy="32" r="26" fill="#4ea931" stroke="#387b1f" />
          <path d="m30 18-14 14 14 14V36h17v-9H30z" fill="white" />
        </>
      )}
    </svg>
  );
}

export function Flag() {
  return (
    <span className="xp-flag" aria-hidden="true">
      <i />
      <i />
      <i />
      <i />
    </span>
  );
}
