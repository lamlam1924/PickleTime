import React from "react";
export default function Button({ as:Comp='a', href, onClick, children, variant='primary', color, style, ...rest }){
    const base = {display:'inline-block',padding:'12px 16px',borderRadius:16,fontWeight:700,textDecoration:'none',cursor:'pointer',border:'1px solid transparent'};
    const styles = {
        primary: { ...base, color:'#fff', background: color || '#F98805', boxShadow:'0 6px 16px rgba(0,0,0,.12)' },
        ghost: { ...base, color:'#fff', background:'rgba(255,255,255,.08)', border:'1px solid #fff' },
        outline: { ...base, color: color || '#264414', background:'#fff', border:`1px solid ${color||'#264414'}` },
    };
    const props = { href, onClick, style:{...styles[variant], ...style}, ...rest };
    return <Comp {...props}>{children}</Comp>;
}