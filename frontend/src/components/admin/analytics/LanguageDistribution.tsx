"use client";

interface Language {
  name: string;
  percentage: number;
  color: string;
}

export default function LanguageDistribution() {
  const languages: Language[] = [
    { name: "French", percentage: 45, color: "bg-primary" },
    { name: "English", percentage: 30, color: "bg-secondary" },
    { name: "Arabic", percentage: 15, color: "bg-tertiary" },
    { name: "Other", percentage: 10, color: "bg-outline-variant" },
  ];

  return (
    <div className="bg-surface-container-lowest rounded-xl p-8 shadow-sm border border-outline-variant/10">
      <h3 className="text-lg font-headline font-bold text-on-surface mb-8">Language Distribution</h3>

      <div className="flex items-center gap-12">
        <div className="relative w-40 h-40">
          <div
            className="w-full h-full rounded-full"
            style={{
              background:
                "conic-gradient(#825500 0% 45%, #006C4C 45% 75%, #AC3400 75% 90%, #d7c3ae 90% 100%)",
            }}
          ></div>
          <div className="absolute inset-4 bg-surface-container-lowest rounded-full flex items-center justify-center">
            <span className="text-xs font-label text-slate-400 text-center uppercase leading-tight">
              Visitor
              <br />
              Locales
            </span>
          </div>
        </div>

        <div className="flex-1 space-y-4">
          {languages.map((language, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className={`w-3 h-3 rounded-full ${language.color}`}></span>
                <span className="text-sm font-medium text-on-surface">{language.name}</span>
              </div>
              <span className="text-sm font-bold text-on-surface">{language.percentage}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
