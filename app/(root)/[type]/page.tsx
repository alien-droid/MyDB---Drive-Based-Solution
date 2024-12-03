import FileCard from "@/components/FileCard";
import Sort from "@/components/Sort";
import { navItems } from "@/constants";
import { getFiles, getTotalSpaceUsed } from "@/lib/actions/file.actions";
import { cn, convertFileSize, getFileIcon, getFileTypesParams } from "@/lib/utils";
import Image from "next/image";
import { Models } from "node-appwrite";
import React from "react";

const page = async ({ searchParams, params }: SearchParamProps) => {
  const type = ((await params)?.type as string) || "";
  const searchText = ((await searchParams)?.query as string) || "";
  const sort = ((await searchParams)?.sort as string) || "";

  const types = getFileTypesParams(type) as FileType[];
  const files = await getFiles({ types, searchText, sort });
  const totalSpace = await getTotalSpaceUsed();
  let spaceUsed = 0;
  types.forEach((type) => {
    spaceUsed += totalSpace[type].size;
  });
  const icon = navItems.find((item) => item.url === `/${type}`)?.icon;
  return (
    <div className="page-container">
      <section className="w-full">
        <div className="flex items-center gap-4">
          <h1 className="h1 capitalize text-brand-100">{type}</h1>
          <Image
            src={icon ?? ""}
            alt={type}
            width={25}
            height={25}
            className='nav-icon'  
          />
        </div>
        <div className="total-size-section">
          <p className="body-1">
            Total :{" "}
            <span className="h5">
              {spaceUsed && convertFileSize(spaceUsed)}
            </span>
          </p>
          <div className="sort-container">
            <p className="body-1 text-light-200 hidden sm:block">Sort By:</p>
            <Sort />
          </div>
        </div>
      </section>
      {files.total > 0 ? (
        <section className="file-list">
          {files.documents.map((file: Models.Document) => {
            return <FileCard key={file.$id} file={file} />;
          })}
        </section>
      ) : (
        <p className="empty-list">No Files Uploaded 😞</p>
      )}
    </div>
  );
};

export default page;
