import React from "react";
import { Construction } from "lucide-react";

export function ComingSoon({ title }) {
  return (
    <div className="flex flex-col items-center justify-center h-[50vh] text-slate-500">
      <div className="bg-slate-100 p-4 rounded-full mb-4">
        <Construction size={48} className="text-slate-400" />
      </div>
      <h2 className="text-2xl font-bold text-slate-700 mb-2">{title}</h2>
      <p>This module is under development (Phase 2/3).</p>
    </div>
  );
}
