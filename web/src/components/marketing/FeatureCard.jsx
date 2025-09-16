import React from "react";
import { COLORS } from "../../lib/theme";
export default function FeatureCard({ title, desc, barColor }){
    return (
        <div style={{ border:`1px solid ${barColor}80`, background:'#fff', borderRadius:16, padding:20, boxShadow:'0 4px 10px rgba(0,0,0,.05)' }}>
            <div style={{ height:8, width:48, borderRadius:8, background:barColor, marginBottom:10 }} />
            <div style={{ fontWeight:700, color: COLORS.courtSide }}>{title}</div>
            <div style={{ color:'#475569', marginTop:6 }}>{desc}</div>
        </div>
    );
}