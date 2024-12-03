"use client";
import Image from "next/image";
import React from "react";
import { Input } from "./ui/input";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { Models } from "node-appwrite";
import { getFiles } from "@/lib/actions/file.actions";
import Thumbnail from "./Thumbnail";
import DateTime from "./DateTime";
import { useDebounce } from "use-debounce";

const Search = () => {
  const [searchText, setSearchText] = React.useState("");
  const [files, setFiles] = React.useState<Models.Document[]>([]);
  const [open, setOpen] = React.useState(false);
  const searchParams = useSearchParams();
  const query = searchParams.get("query") || "";
  const router = useRouter();
  const path = usePathname();
  const [debouncedSearchText] = useDebounce(searchText, 300);

  React.useEffect(() => {
    const fetchFiles = async () => {
      if (debouncedSearchText.length === 0) {
        setFiles([]);
        setOpen(false);
        return router.push(path.replace(searchParams.toString(), ""));
      }

      const files = await getFiles({
        types: [],
        searchText: debouncedSearchText,
      });
      setFiles(files.documents);
      setOpen(true);
    };
    fetchFiles();
  }, [debouncedSearchText]);

  React.useEffect(() => {
    if (!query) setSearchText("");
  }, [query]);

  const handleItemClick = (file: Models.Document) => {
    setFiles([]);
    setOpen(false);
    router.push(
      `/${file.type === "video" || file.type === "audio" ? "media" : file.type + "s"}/?query=${searchText}`
    );
  };

  return (
    <div className="search">
      <div className="search-input-wrapper">
        <Image
          src="/assets/icons/search.svg"
          alt="search"
          width={20}
          height={20}
        />
        <Input
          type="text"
          placeholder="Searching ..."
          className="search-input"
          onChange={(e) => setSearchText(e.target.value)}
          value={searchText}
        />
        {open && (
          <ul className="search-result">
            {files.length > 0 ? (
              files.map((file: Models.Document) => (
                <li
                  key={file.$id}
                  className="flex items-center justify-between"
                  onClick={() => handleItemClick(file)}
                >
                  <div className="flex cursor-pointer gap-4 items-center">
                    <Thumbnail
                      type={file.type}
                      extension={file.extension}
                      url={file.url}
                      className="size-9 min-w-9"
                    />
                    <p className="subtitle-2 line-clamp-1 text-light-100">
                      {file.name}
                    </p>
                  </div>
                  <DateTime
                    date={file.$createdAt}
                    className="caption line-clamp-1"
                  />
                </li>
              ))
            ) : (
              <p className="empty-result">No results found</p>
            )}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Search;
