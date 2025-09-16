import React from "react";
import { COLORS } from "../../../lib/theme";


function RegisterPage(){
    return (
        <section className="mx-auto max-w-6xl px-4 py-16 grid md:grid-cols-2 gap-10 items-center">
            <div className="bg-white rounded-3xl shadow-xl border p-8 md:p-10 md:col-start-2">
                <h2 className="text-3xl font-extrabold mb-1" style={{ color: COLORS.courtSide }}>Create account</h2>
                <p className="text-slate-600 mb-6">Join the rally — it’s fast and free.</p>
                <form className="space-y-4">
                    <label className="block">
                        <span className="text-sm font-medium text-slate-700">Full name</span>
                        <input type="text" placeholder="Your name" className="mt-1 w-full border rounded-xl px-4 py-2.5" />
                    </label>
                    <label className="block">
                        <span className="text-sm font-medium text-slate-700">Email address</span>
                        <input type="email" placeholder="you@example.com" className="mt-1 w-full border rounded-xl px-4 py-2.5" />
                    </label>
                    <label className="block">
                        <span className="text-sm font-medium text-slate-700">Password</span>
                        <input type="password" placeholder="Create a strong password" className="mt-1 w-full border rounded-xl px-4 py-2.5" />
                    </label>
                    <button type="button" className="w-full py-3 rounded-2xl font-semibold shadow" style={{ background: COLORS.dropShot, color: "white" }}>CREATE ACCOUNT</button>
                </form>
            </div>
        </section>
    );
}

export default RegisterPage;