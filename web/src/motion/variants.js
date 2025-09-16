export const fadeUp = {
    hidden: { opacity: 0, y: 16 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};
export const appear = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { duration: 0.35 } },
};
export const stagger = {
    show: { transition: { staggerChildren: 0.08 } },
};