import React from "react";
export default function Input({ label, type='text', placeholder, rightSlot }){
    return (
        <label style={{ display:'block', marginBottom:14 }}>
            {label && <span style={{ fontSize:13, fontWeight:600, color:'#334155' }}>{label}</span>}
            <div style={{ marginTop:6, display:'flex', alignItems:'center', border:'1px solid #d0d7e1', borderRadius:12, padding:'8px 12px' }}>
                <input type={type} placeholder={placeholder} style={{ flex:1, border:'none', outline:'none', padding:'4px 2px' }} />
                {rightSlot}
            </div>
        </label>
    );
}