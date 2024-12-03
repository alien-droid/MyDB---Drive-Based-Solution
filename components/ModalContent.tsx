import { Models } from "node-appwrite";
import React from "react";
import Thumbnail from "./Thumbnail";
import DateTime from "./DateTime";
import { convertFileSize, formatDateTime } from "@/lib/utils";
import { Separator } from "./ui/separator";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import Image from "next/image";

const ImageThumbnail = ({ file }: { file: Models.Document }) => (
  <div className="file-details-thumbnail">
    <Thumbnail type={file.type} extension={file.extension} url={file.url} />
    <div className="flex flex-col ">
      <p className="subtitle-2 mb-1">{file.name}</p>
      <DateTime date={file.$createdAt} className="caption" />
    </div>
  </div>
);

const DetailRow = ({ label, value }: { label: string; value: string }) => (
  <div className="flex">
    <p className="file-details-label text-left">{label}</p>
    <p className="file-details-value text-left">{value}</p>
  </div>
);

export const FileDetailsModalContent = ({
  file,
}: {
  file: Models.Document;
}) => {
  return (
    <>
      <ImageThumbnail file={file} />
      <div className="space-y-4 px-2 pt-2">
        <DetailRow label="Format" value={file.extension} />
        <DetailRow label="Size" value={convertFileSize(file.size)} />
        <DetailRow
          label="Last Edited"
          value={formatDateTime(file.$updatedAt)}
        />
        <Separator className="bg-light-200/30 my-4" />
        <DetailRow label="Owner" value={file.owner.fullName} />
        <DetailRow label="Created" value={formatDateTime(file.$createdAt)} />
      </div>
    </>
  );
};

export const ShareInput = ({
  file,
  onInputChange,
  onRemove,
}: {
  file: Models.Document;
  onInputChange: React.Dispatch<React.SetStateAction<string[]>>;
  onRemove: (email: string) => void;
}) => {
  return (
    <>
      <ImageThumbnail file={file} />
      <div className="share-wrapper">
        <p className="subtitle-2 text-light-100 pl-1">Share with people!</p>
        <Input
          className="share-input-field"
          placeholder="Enter email address"
          type="email"
          onChange={(e) => onInputChange(e.target.value.trim().split(","))}
        />
        <Separator className="bg-light-200/30 mt-4" />
        <div className="pt-3">
          <div className="flex justify-between">
            <p className="subtitle-2 text-light-100">Shared with</p>
            <p className="subtitle-2 text-light-200">
              {file.users.length} users
            </p>
          </div>
          <ul className="pt-2">
            {file.users.map((e: string) => (
              <li key={e} className="flex items-center gap-2 justify-between">
                <p className="subtitle-2">{e}</p>
                <Button onClick={() => onRemove(e)} className="share-remove-user">
                  <Image
                    src="/assets/icons/remove.svg"
                    alt="remove"
                    width={22}
                    height={22}
                    className="remove-icon"
                  />
                </Button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
};
