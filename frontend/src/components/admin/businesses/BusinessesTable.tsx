"use client";

interface Business {
  id: string;
  name: string;
  lbId: string;
  image: string;
  owner: string;
  category: string;
  categoryColor: string;
  categoryTextColor: string;
  city: string;
  submittedDate: string;
  status: "Pending" | "Approved" | "Rejected";
  isSelected: boolean;
}

const businesses: Business[] = [
  {
    id: "1",
    name: "Café des Épices",
    lbId: "LB-9842",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBQM8h5N88Q7_R5GvKGCLnSeTnAhkrJTmXDMWJdBo-bk9GHYsOtGINCO4uuqF0lLNbtR67VLzNx-qwHAtPXBSIzk0hr5poYnxelkCC7nyKOozlb_YvNCXZj3-mXeuSqHwm9IuQ2rv1jQvj8_eVN47Rdvu0UrbDoeXrG9_QLXuI8J5iRv5mnIGIPj-9vuKGHFXPxeTA_g2GpLlAdqXJ1WAnCUlEwunD4kcYLQv6MxtCpYtx6dJ69sS82yFhT1yRUiG63d8Ey-W4JD5M",
    owner: "Yassine Amrani",
    category: "Restaurant",
    categoryColor: "bg-secondary-container",
    categoryTextColor: "text-on-secondary-container",
    city: "Marrakech",
    submittedDate: "Oct 24, 2023",
    status: "Pending",
    isSelected: true,
  },
  {
    id: "2",
    name: "Atlas Leather Craft",
    lbId: "LB-7721",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCIqGFqkirKDNsG7XCO6aIIqOpleQPujAMwfKGiJgFTyJclhAQjrGXk66ZrAjvNWfjkcOlUfJE5W8mbnnD9Y9V20Svwfazw_e8NKiy8OQ0vxQUNy4na-OhlTuq3Mj5W8xj78EzcZZeR2EYGhc_npkLjYWbdguMWMs-cUnI6SMmJFjymC_0fFgW6c6iYBujPsYA1SqsoW_Iv4VEMOdjV_w4BDVDZ_e4R65fqQQrWgMT0I8h8tqMcM3VuwetFNnT_DhsXEDWp8yywyE0",
    owner: "Fatima Zahra",
    category: "Artisan",
    categoryColor: "bg-tertiary-fixed",
    categoryTextColor: "text-on-tertiary-fixed-variant",
    city: "Fez",
    submittedDate: "Oct 22, 2023",
    status: "Approved",
    isSelected: false,
  },
  {
    id: "3",
    name: "Riad Al-Hamra",
    lbId: "LB-4410",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCsU-jSGliFqGTZnrivyXzkTFfnhYBN0ZZPSOhyuXvNz_PlVUiRODQh-1iZdYCmfdOclmyVjy9KOfEvHXPCWZCA1lP6Qy8HLFbfiZsfqAcCGnvaUKF37v92yCJkzQN3OSMGpTPRkZhJu9L0sZfA2m3hvKLka6FUqovNL1DIawFEhJ7wIyrc8n8VNAU9KauFzyP1cRt9AcSBZZvoH5lqGtdHETAlpcB5NJvurUkJOeoh9Kyrax1y3Agog0D5oGCHX8gJEyvqiZzEFv4",
    owner: "Omar Bennani",
    category: "Hotel",
    categoryColor: "bg-primary-fixed",
    categoryTextColor: "text-on-primary-fixed-variant",
    city: "Casablanca",
    submittedDate: "Oct 21, 2023",
    status: "Rejected",
    isSelected: false,
  },
];

export default function BusinessesTable() {
  return (
    <div className="bg-surface-container-lowest rounded-lg shadow-sm overflow-hidden">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-surface-container-low text-on-surface-variant uppercase text-[11px] font-bold tracking-widest">
            <th className="px-6 py-4">Business Name</th>
            <th className="px-6 py-4">Owner</th>
            <th className="px-6 py-4">Category</th>
            <th className="px-6 py-4">City</th>
            <th className="px-6 py-4">Submitted Date</th>
            <th className="px-6 py-4">Status</th>
            <th className="px-6 py-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-surface-container">
          {businesses.map((business) => (
            <tr
              key={business.id}
              className={`hover:bg-surface-container-low transition-colors ${
                business.isSelected ? "bg-primary/5 border-l-4 border-primary" : ""
              }`}
            >
              <td className="px-6 py-5">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-lg ${
                      business.isSelected ? "bg-primary-fixed" : "bg-surface-container"
                    } overflow-hidden`}
                  >
                    <img
                      className="w-full h-full object-cover"
                      src={business.image}
                    />
                  </div>
                  <div>
                    <p className="font-bold text-on-surface">{business.name}</p>
                    <p className="text-xs text-on-surface-variant">ID: {business.lbId}</p>
                  </div>
                </div>
              </td>
              <td className="px-6 py-5 text-sm font-medium">{business.owner}</td>
              <td className="px-6 py-5">
                <span
                  className={`${business.categoryColor} ${business.categoryTextColor} text-[10px] px-2 py-1 rounded-full font-bold uppercase tracking-wider`}
                >
                  {business.category}
                </span>
              </td>
              <td className="px-6 py-5 text-sm">{business.city}</td>
              <td className="px-6 py-5 text-sm">{business.submittedDate}</td>
              <td className="px-6 py-5">
                <span
                  className={`flex items-center gap-1.5 font-bold text-xs uppercase tracking-wide ${
                    business.status === "Pending"
                      ? "text-primary"
                      : business.status === "Approved"
                      ? "text-secondary"
                      : "text-error"
                  }`}
                >
                  {business.status === "Pending" && (
                    <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                  )}
                  {business.status}
                </span>
              </td>
              <td className="px-6 py-5 text-right">
                <button className="text-primary hover:underline font-bold text-sm">
                  View Details
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="px-6 py-4 bg-surface-container-low flex justify-between items-center border-t border-surface-variant">
        <span className="text-xs text-on-surface-variant font-medium">
          Showing 1-10 of 142 businesses
        </span>
        <div className="flex gap-2">
          <button
            className="w-8 h-8 rounded-full flex items-center justify-center bg-surface-container-highest text-outline disabled:opacity-50"
            disabled
          >
            <span className="material-symbols-outlined text-sm">chevron_left</span>
          </button>
          <button className="w-8 h-8 rounded-full flex items-center justify-center bg-primary text-on-primary font-bold text-xs">
            1
          </button>
          <button className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-surface-container-highest text-on-surface font-bold text-xs">
            2
          </button>
          <button className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-surface-container-highest text-on-surface font-bold text-xs">
            3
          </button>
          <button className="w-8 h-8 rounded-full flex items-center justify-center bg-surface-container-highest text-outline">
            <span className="material-symbols-outlined text-sm">chevron_right</span>
          </button>
        </div>
      </div>
    </div>
  );
}
