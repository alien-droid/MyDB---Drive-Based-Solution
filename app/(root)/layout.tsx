import Header from "@/components/Header";
import MobileNavigation from "@/components/MobileNavigation";
import Sidebar from "@/components/Sidebar";
import { getCurrentUser } from "@/lib/actions/user.actions";
import { redirect } from "next/navigation";
import React from "react";
import { Toaster } from "@/components/ui/toaster";

export const dynamic = 'force-dynamic'

const layout = async ({ children }: { children: React.ReactNode }) => {
  const curretUser = await getCurrentUser();
  if (!curretUser) redirect("/sign-in");
  return (
    <main className="flex h-screen">
      <Sidebar {...curretUser} />
      <section className="flex-1 h-full flex-col flex">
        <MobileNavigation {...curretUser} />
        <Header userId={curretUser.$id} accountId={curretUser.accountId} /> 
        <div className="main-content">{children}</div>
      </section>
      <Toaster />
    </main>
  );
};

export default layout;
