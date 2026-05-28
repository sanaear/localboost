"use client";

import Link from "next/link";
import { useParams, usePathname } from "next/navigation";

const translations: Record<string, { welcome: string; description: string }> = {
  en: { welcome: "Welcome to LocalBoost", description: "Your local business directory" },
  fr: { welcome: "Bienvenue sur LocalBoost", description: "Votre annuaire d'entreprises locales" },
  es: { welcome: "Bienvenido a LocalBoost", description: "Tu directorio de negocios locales" },
  ar: { welcome: "مرحبا بك في LocalBoost", description: "دليل الأعمال المحلي الخاص بك" },
};

export default function Home() {
  const params = useParams<{ locale: string }>();
  const pathname = usePathname();
  const t = translations[params.locale] || translations.en;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8">
      <h1 className="text-4xl font-bold mb-4">{t.welcome}</h1>
      <p className="text-lg mb-8">{t.description}</p>
      
      <div className="flex gap-4 mb-8">
        <Link 
          href={`/${params.locale}/businesses`}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
        >
          Browse Businesses
        </Link>
      </div>

      <div className="flex gap-4">
        <Link href="/en" className="px-4 py-2 border rounded hover:bg-gray-100">English</Link>
        <Link href="/fr" className="px-4 py-2 border rounded hover:bg-gray-100">Français</Link>
        <Link href="/es" className="px-4 py-2 border rounded hover:bg-gray-100">Español</Link>
        <Link href="/ar" className="px-4 py-2 border rounded hover:bg-gray-100">العربية</Link>
      </div>
    </div>
  );
}
