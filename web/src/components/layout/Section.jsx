import React from "react";
export default function Section({ children, id, style }){
    return (
        <section id={id} style={{ maxWidth:1120, margin:'0 auto', padding:'56px 16px', ...style }}>
            {children}
        </section>
    );
}