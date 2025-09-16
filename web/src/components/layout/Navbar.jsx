import React from "react";
import { Link, NavLink } from "react-router-dom";
import { COLORS } from "../../lib/theme";
export default function Navbar(){
    return (
        <header style={{ position:'sticky', top:0, zIndex:40, backdropFilter:'blur(4px)', background:'rgba(255,255,255,.7)', borderBottom:'1px solid #e2e8f0' }}>
            <div style={{ maxWidth:1120, margin:'0 auto', padding:'12px 16px', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                <Link to="/" style={{ display:'flex', alignItems:'center', gap:8, textDecoration:'none' }}>
                    <div style={{ height:32, width:32, borderRadius:999, display:'grid', placeItems:'center', background:COLORS.matchPoint, boxShadow:'0 2px 6px rgba(0,0,0,.1)' }}>
                        <span style={{ fontWeight:900, color:COLORS.courtSide }}>P</span>
                    </div>
                    <span style={{ fontWeight:800, fontSize:20, color:COLORS.courtSide }}>PickleTime</span>
                </Link>
                <nav style={{ display:'flex', gap:16 }}>
                    <NavLink to="/" style={{ textDecoration:'none', color:'#334155' }}>Home</NavLink>
                    <NavLink to="/login" style={{ textDecoration:'none', color:'#334155' }}>Login</NavLink>
                </nav>
                <Link to="/login" style={{ padding:'8px 14px', borderRadius:12, fontWeight:600, color:'#fff', background:COLORS.dropShot, textDecoration:'none', boxShadow:'0 2px 6px rgba(0,0,0,.15)' }}>Book a Court</Link>
            </div>
        </header>
    );
}