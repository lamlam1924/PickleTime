import React from "react";
import FeatureCard from "./FeatureCard";
import Section from "../layout/Section";
import { COLORS } from "../../lib/theme";
export default function FeatureGrid(){
    const items = [
        { t:'Instant booking', d:'Real‑time availability in a few taps', c:COLORS.smashHit },
        { t:'Smart pricing', d:'Peak/off‑peak & memberships', c:COLORS.doubleBounce },
        { t:'Club tools', d:'Owners manage courts & requests', c:COLORS.matchPoint },
    ];
    return (
        <Section id="features">
            <div style={{ display:'grid', gap:16 }}>
                {items.map(i => <FeatureCard key={i.t} title={i.t} desc={i.d} barColor={i.c} />)}
            </div>
        </Section>
    );
}