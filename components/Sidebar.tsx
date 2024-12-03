"use client";
import { avatarPlaceholder, navItems } from "@/constants";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

interface SidebarProps {
  avatar: string;
  fullName: string;
  email: string;
}

const Sidebar = ({ fullName, email, avatar }: SidebarProps) => {
  const pathname = usePathname();

  return (
    <aside className="sidebar">
      <Link href="/">
        <Image
          src="/assets/icons/MyDB.svg"
          alt="logo"
          width={220}
          height={82}
          className="hidden h-auto w-auto lg:block"
        />
        <Image
          src="/assets/icons/logo-brand.svg"
          alt="logo"
          width={54}
          height={54}
          className="lg:hidden"
        />
      </Link>
      <nav className="sidebar-nav">
        <ul className="flex flex-1 flex-col gap-6">
          {navItems.map(({ url, name, icon }) => {
            const active = pathname === url;
            return (
              <Link href={url} key={name} className="lg:w-full">
                <li className={cn("sidebar-nav-item", active && "shad-active")}>
                  <Image
                    src={icon}
                    alt={name}
                    width={22}
                    height={22}
                    className={cn("nav-icon", active && "nav-icon-active")}
                  />
                  <span className="lg:block hidden">{name}</span>
                </li>
              </Link>
            );
          })}
        </ul>
      </nav>
      <Image
        src="/assets/images/folder-2.jpeg"
        alt="logo"
        width={506}
        height={420}
        className="w-auto h-auto"
      />
      <div className="sidebar-user-info">
        <Image
          src={avatar}
          alt="avatar"
          width={45}
          height={45}
          className="sidebar-user-avatar"
        />
        <div className="hidden lg:block">
          <p className="subtitle-2 capitalize">{fullName}</p>
          <p className="caption">{email}</p>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
