"use client";
import React from "react";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Separator } from "./ui/separator";
import { navItems } from "@/constants";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import FileUploader from "./FileUploader";
import { signOutUser } from "@/lib/actions/user.actions";

interface MobileNavigationProps {
  accountId: string;
  avatar: string;
  fullName: string;
  email: string;
  $id: string;
}

const MobileNavigation = ({
  accountId,
  avatar,
  fullName,
  email,
  $id: ownerId,
}: MobileNavigationProps) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const pathname = usePathname();
  return (
    <header className="mobile-header">
      <Image
        src="/assets/icons/logo-full-brand.svg"
        alt="logo"
        width={120}
        height={53}
        className="h-auto"
      />
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger>
          <Image
            src="/assets/icons/menu.svg"
            alt="menu"
            width={30}
            height={30}
          />
        </SheetTrigger>
        <SheetContent className="shad-sheet h-screen px-3">
          <SheetTitle>
            <div className="header-user">
              <Image
                src={avatar}
                alt="avatar"
                width={45}
                height={45}
                className="header-user-avatar"
              />
              <div className="sm:hidden lg:block">
                <p className="subtitle-2 capitalize">{fullName}</p>
                <p className="caption">{email}</p>
              </div>
            </div>
            <Separator className="bg-light-200/20 my-4" />
          </SheetTitle>
          <nav className="mobile-nav">
            <ul className="mobile-nav-list">
              {navItems.map(({ url, name, icon }) => {
                const active = pathname === url;
                return (
                  <Link href={url} key={name} className="lg:w-full">
                    <li
                      className={cn("mobile-nav-item", active && "shad-active")}
                    >
                      <Image
                        src={icon}
                        alt={name}
                        width={22}
                        height={22}
                        className={cn("nav-icon", active && "nav-icon-active")}
                      />
                      <span>{name}</span>
                    </li>
                  </Link>
                );
              })}
            </ul>
          </nav>
          <Separator className="bg-light-200/20 my-4" />
          <div className="flex flex-col justify-between gap-5 pb-5">
            <FileUploader accountId={accountId} ownerId={ownerId} />
            <Button
              type="submit"
              className="mobile-sign-out-button"
              onClick={async () => signOutUser()}
            >
              <Image
                alt="sign-out"
                src="/assets/icons/logout.svg"
                width={25}
                height={25}
              />
              <p>Sign Out</p>
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </header>
  );
};

export default MobileNavigation;
