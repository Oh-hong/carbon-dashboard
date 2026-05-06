"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Activity,
  Settings,
  Upload,
  Leaf,
  Menu,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet";
import { useState } from "react";

const navigation = [
  { name: "대시보드", href: "/", icon: LayoutDashboard },
  { name: "활동 데이터", href: "/activities", icon: Activity },
  { name: "배출계수 관리", href: "/emission-factors", icon: Settings },
  { name: "데이터 임포트", href: "/import", icon: Upload },
];

// 사이드바 내부 콘텐츠 (재사용)
function SidebarContent({ collapsed = false, onNavigate }: { collapsed?: boolean; onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <>
      {/* 네비게이션 */}
      <nav className="flex-1 space-y-1 px-3 py-4">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={onNavigate}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-emerald-50 text-emerald-700"
                  : "text-gray-700 hover:bg-gray-100 hover:text-gray-900",
                collapsed && "justify-center px-2"
              )}
              title={collapsed ? item.name : undefined}
            >
              <item.icon className={cn("h-5 w-5 shrink-0", isActive ? "text-emerald-600" : "text-gray-400")} />
              {!collapsed && <span>{item.name}</span>}
            </Link>
          );
        })}
      </nav>

      {/* 하단 정보 */}
      {!collapsed && (
        <div className="border-t border-gray-200 p-4">
          <div className="rounded-lg bg-emerald-50 p-3">
            <p className="text-xs font-medium text-emerald-800">PCF Dashboard</p>
            <p className="text-xs text-emerald-600">탄소 배출 관리 시스템</p>
          </div>
        </div>
      )}
    </>
  );
}

// 모바일 드로어 (Sheet)
export function MobileSidebar() {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        render={
          <Button variant="ghost" size="icon" className="lg:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">메뉴 열기</span>
          </Button>
        }
      />
      <SheetContent side="left" className="w-64 p-0" showCloseButton={false}>
        <SheetTitle className="sr-only">네비게이션 메뉴</SheetTitle>
        {/* 로고 */}
        <div className="flex h-16 items-center gap-2 border-b border-gray-200 px-6">
          <Leaf className="h-8 w-8 text-emerald-600" />
          <span className="text-xl font-bold text-gray-900">Carbon</span>
        </div>
        <SidebarContent onNavigate={() => setOpen(false)} />
      </SheetContent>
    </Sheet>
  );
}

// 데스크탑 사이드바 (접기/펼치기 기능)
export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={cn(
        "hidden lg:flex h-screen flex-col border-r border-gray-200 bg-white transition-all duration-300",
        collapsed ? "w-16" : "w-64"
      )}
    >
      {/* 로고 + 접기 버튼 */}
      <div className={cn(
        "flex h-16 items-center border-b border-gray-200",
        collapsed ? "justify-center px-2" : "justify-between px-4"
      )}>
        <div className={cn("flex items-center", collapsed ? "" : "gap-2")}>
          <Leaf className="h-8 w-8 text-emerald-600 shrink-0" />
          {!collapsed && <span className="text-xl font-bold text-gray-900">Carbon</span>}
        </div>
        {!collapsed && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCollapsed(true)}
            className="h-8 w-8"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* 펼치기 버튼 (접힌 상태) */}
      {collapsed && (
        <div className="p-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCollapsed(false)}
            className="w-full h-8"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}

      <SidebarContent collapsed={collapsed} />
    </aside>
  );
}
