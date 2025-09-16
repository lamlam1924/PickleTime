import React from "react";
import { COLORS } from "../../lib/theme";
export default function CourtIllustration(){
    return (
        <div style={{ borderRadius:24, overflow:'hidden', boxShadow:'0 12px 24px rgba(0,0,0,.25)' }}>
            <svg viewBox="0 0 460 320" style={{ width:'100%', height:'auto', display:'block' }}>
                <defs>
                    <linearGradient id="court2" x1="0" x2="0" y1="0" y2="1">
                        <stop offset="0%" stopColor={COLORS.blueCourt} />
                        <stop offset="100%" stopColor={COLORS.matchPoint} />
                    </linearGradient>
                    <pattern id="grid" width="14" height="14" patternUnits="userSpaceOnUse">
                        <path d="M0 14 H14 M0 0 V14" stroke="#083049" strokeWidth="0.8" opacity="0.45" />
                    </pattern>
                </defs>
                <rect x="0" y="0" width="460" height="320" fill="url(#court2)" rx="20" />
                <rect x="20" y="150" width="420" height="24" fill="url(#grid)" />
                <rect x="30" y="30" width="400" height="260" fill="none" stroke="white" strokeWidth="4" rx="16" />
                <line x1="230" y1="30" x2="230" y2="290" stroke="white" strokeWidth="3" />
            </svg>
        </div>
    );
}