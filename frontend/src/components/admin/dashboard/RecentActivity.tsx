'use client';

interface Activity {
  id: string;
  icon: string;
  iconBg: string;
  iconText: string;
  message: string;
  highlight: string;
  time: string;
  details: string;
}

const defaultActivities: Activity[] = [
  {
    id: '1',
    icon: 'add_business',
    iconBg: 'bg-secondary-container',
    iconText: 'text-on-secondary-container',
    message: 'New business registered:',
    highlight: 'Café des Épices, Fès',
    time: '2 minutes ago',
    details: 'ID: #LB-9421',
  },
  {
    id: '2',
    icon: 'report',
    iconBg: 'bg-error-container',
    iconText: 'text-error',
    message: 'Review flagged by AI on',
    highlight: 'Dar Hatim',
    time: '45 minutes ago',
    details: 'Policy Violation',
  },
  {
    id: '3',
    icon: 'person_add',
    iconBg: 'bg-primary-container/20',
    iconText: 'text-primary',
    message: 'New tourist registered from',
    highlight: 'France',
    time: '2 hours ago',
    details: 'Verified Email',
  },
  {
    id: '4',
    icon: 'update',
    iconBg: 'bg-surface-container-high',
    iconText: 'text-on-surface-variant',
    message: 'System Maintenance Completed',
    highlight: '',
    time: '5 hours ago',
    details: 'Version 2.4.1',
  },
];

interface RecentActivityProps {
  activities?: Activity[] | null;
}

export default function RecentActivity({ activities }: RecentActivityProps) {
  const items = activities && activities.length > 0 ? activities : defaultActivities;

  return (
    <div className="bg-surface-container-lowest p-8 rounded-xl shadow-sm border border-outline-variant/10">
      <div className="flex justify-between items-center mb-8">
        <h3 className="text-xl font-bold font-headline">Recent Activity</h3>
        <button className="text-xs font-bold text-primary hover:underline">View All</button>
      </div>
      <div className="space-y-8 relative">
        <div className="absolute left-4 top-2 bottom-2 w-0.5 bg-outline-variant/20"></div>
        {items.map((activity) => (
          <div key={activity.id} className="relative flex gap-6">
            <div
              className={`w-8 h-8 rounded-full ${activity.iconBg} flex items-center justify-center z-10 ${activity.iconText}`}
            >
              <span className="material-symbols-outlined text-sm">{activity.icon}</span>
            </div>
            <div>
              <p className="text-sm font-bold">
                {activity.message}{' '}
                {activity.highlight && <span className="text-primary">{activity.highlight}</span>}
              </p>
              <p className="text-xs text-on-surface-variant mt-1">
                {activity.time} • {activity.details}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
