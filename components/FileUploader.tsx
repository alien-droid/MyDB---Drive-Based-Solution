"use client";
import React, { use, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "./ui/button";
import { cn, convertFileToUrl, getFileType } from "@/lib/utils";
import Image from "next/image";
import Thumbnail from "./Thumbnail";
import { MAX_FILE_SIZE } from "@/constants";
import { useToast } from "@/hooks/use-toast";
import { uploadFile } from "@/lib/actions/file.actions";
import { usePathname } from "next/navigation";

interface FileUploaderProps {
  ownerId: string;
  accountId: string;
  className?: string;
}

const FileUploader = ({ ownerId, accountId, className }: FileUploaderProps) => {
  const [files, setFiles] = React.useState<File[]>([]);
  const { toast } = useToast();
  const path = usePathname();
  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      setFiles(acceptedFiles);
      const uploadedFilePromises = acceptedFiles.map(async (file) => {
        if (file.size > MAX_FILE_SIZE) {
          setFiles((prevFiles) =>
            prevFiles.filter((file) => file.name !== file.name)
          );
          return toast({
            description: (
              <p className="body-2 text-white">
                <span className="font-semibold">
                  {file.name} is too large. Max file size is
                  {MAX_FILE_SIZE / 1024 / 1024} MB.
                </span>
              </p>
            ),
            className: "error-toast",
          });
        }
        return uploadFile({ file, accountId, ownerId, path }).then(
          (uploadedFile) => {
            if (uploadedFile) {
              // remove file from list if upload completed
              setFiles((prevFiles) =>
                prevFiles.filter((file) => file.name !== file.name)
              );
            }
          }
        );
      });
      await Promise.all(uploadedFilePromises);
    },
    [accountId, ownerId, path]
  );
  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  const handleRemoveFile = (
    e: React.MouseEvent<HTMLImageElement, MouseEvent>,
    fileName: string
  ) => {
    e.stopPropagation();
    setFiles((prevFiles) => prevFiles.filter((file) => file.name !== fileName));
  };

  return (
    <div {...getRootProps()} className="cursor-pointer">
      <input {...getInputProps()} />
      <Button type="button" className={cn("uploader-button")}>
        <Image
          src="/assets/icons/upload.svg"
          alt="upload"
          width={24}
          height={24}
        />
        <p>Upload</p>
      </Button>
      {files.length > 0 && (
        <ul className="uploader-preview-list">
          <h4 className="h4 text-light-100">Uploading </h4>
          {files.map((file, index) => {
            const { type, extension } = getFileType(file.name);
            return (
              <li
                key={`${file.name}-${index}`}
                className="uploader-preview-item"
              >
                <div className="flex items-center gap-3">
                  <Thumbnail
                    type={type}
                    extension={extension}
                    url={convertFileToUrl(file)}
                  />
                  <div className="preview-item-name">
                    <p>{file.name}</p>
                    <Image
                      src="/assets/icons/file-loader.gif"
                      alt="loading"
                      width={80}
                      height={25}
                    />
                  </div>
                </div>
                <Image
                  src="/assets/icons/remove.svg"
                  alt="remove"
                  width={20}
                  height={20}
                  className="remove-icon"
                  onClick={(e) => handleRemoveFile(e, file.name)}
                />
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default FileUploader;
