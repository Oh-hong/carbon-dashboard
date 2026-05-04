"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Activity,
  Settings,
  Upload,
  Leaf,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navigation = [
  { name: "대시보드", href: "/", icon: LayoutDashboard },
  { name: "활동 데이터", href: "/activities", icon: Activity },
  { name: "배출계수 관리", href: "/emission-factors", icon: Settings },
  { name: "데이터 임포트", href: "/import", icon: Upload },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex h-screen w-64 flex-col border-r border-gray-200 bg-white">
      {/* 로고 */}
      <div className="flex h-16 items-center gap-2 border-b border-gray-200 px-6">
        <Leaf className="h-8 w-8 text-emerald-600" />
        <span className="text-xl font-bold text-gray-900">Carbon Dashboard</span>
      </div>

      {/* 네비게이션 */}
      <nav className="flex-1 space-y-1 px-3 py-4">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-emerald-50 text-emerald-700"
                  : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
              )}
            >
              <item.icon className={cn("h-5 w-5", isActive ? "text-emerald-600" : "text-gray-400")} />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* 하단 정보 */}
      <div className="border-t border-gray-200 p-4">
        <div className="rounded-lg bg-emerald-50 p-3">
          <p className="text-xs font-medium text-emerald-800">PCF Dashboard</p>
          <p className="text-xs text-emerald-600">탄소 배출 관리 시스템</p>
        </div>
      </div>
    </aside>
  );
}
