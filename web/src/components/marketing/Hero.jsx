import React from "react";
import { motion } from "framer-motion";
import { COLORS } from "../../lib/theme";
import Button from "../ui/Button";
import CourtIllustration from "../illustrations/CourtIllustration";
import { stagger, fadeUp } from "../../motion/variants";
export default function Hero(){
    return (
        <section>
            <div style={{ paddingTop:64, background:`linear-gradient(180deg, ${COLORS.blueCourt} 0%, ${COLORS.sea} 40%, ${COLORS.matchPoint} 100%)` }}>
                <div style={{ maxWidth:1120, margin:'0 auto', padding:'56px 16px', display:'grid', gap:24 }}>
                    <motion.div variants={stagger} initial="hidden" animate="show" style={{ color:'#fff' }}>
                        <motion.h1 variants={fadeUp} style={{ fontSize:40, fontWeight:800, lineHeight:1.15 }}>
                            Drive Your Pickleball Forward with <span style={{ color: COLORS.matchPoint }}>Smash‑Hit</span> Booking
                        </motion.h1>
                        <motion.p variants={fadeUp} style={{ marginTop:12, opacity:.9, fontSize:18 }}>
                            Book courts, join matches, and grow clubs — built for players, owners, and admins.
                        </motion.p>
                        <motion.div variants={fadeUp} style={{ display:'flex', gap:12, marginTop:20 }}>
                            <Button href="/login" color={COLORS.dropShot}>Book a Court</Button>
                            <Button href="#features" variant="ghost">Explore</Button>
                        </motion.div>
                    </motion.div>
                    <CourtIllustration />
                </div>
            </div>
        </section>
    );
}