import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
}


export function Input({ label, ...props }: InputProps) {
    return (
        <label className="block">
            <div className="text-xs text-white/70 mb-1.5">{label}</div>
            <input {...props} className="w-full rounded-xl bg-white/90 text-slate-900 placeholder:text-slate-400 px-4 py-3 text-base outline-none" />
        </label>
    )
}