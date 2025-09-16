import React, { useState } from "react";
import { COLORS } from "../../../lib/theme";
import Section from "../../../components/layout/Section";
import Input from "../../../components/ui/Input";
export default function LoginPage(){
    const [showPwd, setShowPwd] = useState(false);
    return (
        <Section>
            <div style={{ display:'grid', gap:24, gridTemplateColumns:'1fr 1fr' }}>
                <div style={{ display:'none' }} />
                <div style={{ background:'#fff', border:'1px solid #e2e8f0', borderRadius:24, boxShadow:'0 12px 24px rgba(0,0,0,.08)', padding:'32px 28px' }}>
                    <h2 style={{ fontSize:28, fontWeight:800, color:COLORS.courtSide, marginBottom:4 }}>Welcome to PickleTime</h2>
                    <p style={{ color:'#64748b', marginBottom:24 }}>Log in to book courts, join matches, and manage reservations.</p>
                    <form onSubmit={(e)=> e.preventDefault()}>
                        <Input label="Email address" type="email" placeholder="you@example.com" />
                        <Input label="Password" type={showPwd? 'text':'password'} placeholder="••••••••" rightSlot={
                            <button type="button" onClick={()=> setShowPwd(v=>!v)} style={{ fontSize:12, background:'transparent', border:'none', color: COLORS.doubleBounce, cursor:'pointer' }}>
                                {showPwd? 'Hide':'Show'}
                            </button>
                        } />
                        <button type="submit" style={{ width:'100%', padding:'12px 16px', borderRadius:16, fontWeight:700, color:'#fff', background:COLORS.dropShot, border:'none', boxShadow:'0 6px 16px rgba(0,0,0,.15)' }}>LOG IN</button>
                        <div style={{ display:'flex', justifyContent:'space-between', marginTop:10, fontSize:14 }}>
                            <a href="#" style={{ color:'#64748b' }}>Forgot password?</a>
                            <a href="#" style={{ color: COLORS.doubleBounce, fontWeight:600 }}>Create account</a>
                        </div>
                    </form>
                </div>
            </div>
        </Section>
    );
}