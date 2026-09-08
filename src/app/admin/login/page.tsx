import Image from "next/image";
import { LoginForm } from "./login-form";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Acceso privado" };

export default function AdminLoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-primary px-4">
      <div className="w-full max-w-sm rounded-xl bg-cream p-8 shadow-lg">
        <div className="mb-6 flex flex-col items-center gap-2">
          <Image src="/logo-placeholder.svg" alt="Escudo CSD Algarrobo" width={60} height={70} />
          <h1 className="font-serif text-lg font-bold text-primary">Panel administrativo</h1>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}
