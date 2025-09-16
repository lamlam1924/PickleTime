import React from "react";
export default function Footer(){
    return (
        <footer style={{ marginTop:64, borderTop:'1px solid #e2e8f0', background:'rgba(255,255,255,.6)' }}>
            <div style={{ maxWidth:1120, margin:'0 auto', padding:'20px 16px', display:'flex', justifyContent:'space-between', color:'#64748b', fontSize:14 }}>
                <div>© {new Date().getFullYear()} PickleTime</div>
                <div style={{ display:'flex', gap:16 }}>
                    <a href="#" style={{ color:'#64748b' }}>Privacy</a>
                    <a href="#" style={{ color:'#64748b' }}>Terms</a>
                </div>
            </div>
        </footer>
    );
}