import Link from "next/link";
import { Business } from "@/lib/api";

interface BusinessCardProps {
  business: Business;
  locale: string;
}

export default function BusinessCard({ business, locale }: BusinessCardProps) {
  const getCategoryName = () => {
    if (!business.category) return "";
    switch (locale) {
      case "ar":
        return business.category.name_ar;
      case "fr":
        return business.category.name_fr;
      case "es":
        return business.category.name_es;
      default:
        return business.category.name_en;
    }
  };

  return (
    <Link href={`/${locale}/businesses/${business.id}`}>
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
        {business.images.length > 0 ? (
          <div className="h-48 bg-gray-200">
            <img
              src={business.images[0]}
              alt={business.name}
              className="w-full h-full object-cover"
            />
          </div>
        ) : (
          <div className="h-48 bg-gray-200 flex items-center justify-center">
            <span className="text-gray-400">No Image</span>
          </div>
        )}
        <div className="p-4">
          <h3 className="text-lg font-semibold mb-2">{business.name}</h3>
          {getCategoryName() && (
            <p className="text-sm text-gray-500 mb-1">{getCategoryName()}</p>
          )}
          {business.city && (
            <p className="text-sm text-gray-600 mb-2">{business.city}</p>
          )}
          {business.description && (
            <p className="text-sm text-gray-700 line-clamp-2">{business.description}</p>
          )}
        </div>
      </div>
    </Link>
  );
}
