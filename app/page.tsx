import { Gift } from "lucide-react";
import { CreateGroupForm } from "@/components/forms";

export default function Home() {
  return (
    <main className="flex-1 flex flex-col items-center justify-center p-6 sm:p-12">
      <div className="max-w-md w-full space-y-8 relative">
        <div className="absolute -top-32 -left-32 w-64 h-64 bg-rose-600/30 rounded-full blur-3xl opacity-50 mix-blend-screen pointer-events-none"></div>
        <div className="absolute -bottom-32 -right-32 w-64 h-64 bg-amber-500/20 rounded-full blur-3xl opacity-50 mix-blend-screen pointer-events-none"></div>

        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center p-4 bg-neutral-900 text-neutral-300 rounded-2xl mb-4 border border-neutral-800">
            <Gift className="w-8 h-8" strokeWidth={1.5} />
          </div>
          <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-neutral-100">
            Wichteln <span className="text-neutral-400">Organisator</span>
          </h1>
          <p className="text-neutral-400 text-base max-w-sm mx-auto">
            Erstelle eine Gruppe, du Otto
          </p>
        </div>

        <div className="bg-neutral-900/50 border border-neutral-800 rounded-2xl p-6 sm:p-8 relative overflow-hidden shadow-sm">
          <CreateGroupForm />
        </div>
      </div>
    </main>
  );
}
