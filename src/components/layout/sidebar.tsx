"use client";

import Link from "next/link";
import {
    LayoutDashboard,
    Users,
    Store,
    Building2,
    Route,
    Calendar,
    Upload,
    Settings,
} from "lucide-react";

const menu = [
    {
        title: "Dashboard",
        href: "/dashboard",
        icon: LayoutDashboard,
    },
    {
        title: "Promotores",
        href: "/dashboard/promotores",
        icon: Users,
    },
    {
        title: "Indústrias",
        href: "/dashboard/industrias",
        icon: Building2,
    },
    {
        title: "Lojas",
        href: "/dashboard/lojas",
        icon: Store,
    },
    {
        title: "Rotas",
        href: "/dashboard/rotas",
        icon: Route,
    },
    {
        title: "Operações",
        href: "/dashboard/operacoes",
        icon: Calendar,
    },
    {
        title: "Importações",
        href: "/dashboard/importacoes",
        icon: Upload,
    },
    {
        title: "Configurações",
        href: "/dashboard/configuracoes",
        icon: Settings,
    },
];

export function Sidebar() {
    return (
        <aside className="w-72 border-r min-h-screen bg-white">
            <div className="p-6 border-b">
                <h1 className="text-2xl font-bold">
                    MK9 Analytics
                </h1>

                <p className="text-sm text-muted-foreground">
                    Trade Marketing
                </p>
            </div>

            <nav className="p-4 space-y-2">
                {menu.map((item) => {
                    const Icon = item.icon;

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className="flex items-center gap-3 rounded-lg px-4 py-3 hover:bg-gray-100 transition"
                        >
                            <Icon size={18} />
                            {item.title}
                        </Link>
                    );
                })}
            </nav>
        </aside>
    );
}