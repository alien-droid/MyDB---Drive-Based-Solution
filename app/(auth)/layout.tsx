import Image from "next/image";
import React from "react";

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex min-h-screen">
      <section className="bg-brand p-10 hidden w-1/2 justify-center items-center lg:flex xl:w-2/5">
        <div className="flex max-h-[800px] max-w-[430px] flex-col justify-center space-y-12 transition-all lg:h-full lg:space-y-8 xl:max-w-[580px]">
          <Image
            src="/files.svg"
            alt="MyDB Logo"
            width={220}
            height={80}
            className="h-auto"
          />

          <div className="space-y-5 text-white">
            <h1 className="h1">Managing your files has never been easier.</h1>
            <p className="body-1">
              This is a place wher you can store, share, and manage your files.
            </p>
          </div>
          <Image
            alt="Files"
            className="transition-all hover:rotate-2 hover:scale-110"
            src="/assets/images/files.png"
            width={342}
            height={342}
          />
        </div>
      </section>

      <section className="flex flex-1 flex-col items-center bg-white p-4 py-10 lg:justify-center lg:p-10 lg:py-0">
        <div className="mb-16 lg:hidden">
          <Image
            src="/assets/icons/logo-full-brand.svg"
            className="h-auto w-[200px] lg:w-[250px]"
            alt="logo"
            width={224}
            height={82}
          ></Image>
        </div>
        {children}
      </section>
    </div>
  );
};

export default layout;
