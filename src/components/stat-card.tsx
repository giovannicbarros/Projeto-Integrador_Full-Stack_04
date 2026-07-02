import type { LucideIcon } from 'lucide-react';
import Link from 'next/link';

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: number;
  href?: string;
}

export function StatCard({ icon: Icon, label, value, href }: StatCardProps) {
  const content = (
    <div className="flex items-center gap-4 rounded border border-gray-200 p-5 transition-colors hover:bg-gray-50">
      <div className="rounded bg-gray-50 p-3">
        <Icon className="h-6 w-6 text-gray-900" />
      </div>
      <div>
        <p className="text-3xl font-bold text-gray-900">{value}</p>
        <p className="text-sm text-gray-500">{label}</p>
      </div>
    </div>
  );

  if (href) {
    return <Link href={href}>{content}</Link>;
  }

  return content;
}
