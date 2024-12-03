"use client";
import { Models } from "node-appwrite";
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Image from "next/image";
import { actionsDropdownItems } from "@/constants";
import Link from "next/link";
import { constructDownloadUrl } from "@/lib/utils";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { usePathname } from "next/navigation";
import { deleteFile, renameFile, updatedFileUsers } from "@/lib/actions/file.actions";
import { FileDetailsModalContent, ShareInput } from "./ModalContent";

const ActionDropdown = ({ file }: { file: Models.Document }) => {
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);
  const actionItems = actionsDropdownItems
    .filter((item) => item.value !== "download")
    .map((item) => item.value);

  const [action, setAction] = React.useState<ActionType | null>(null);
  const [name, setName] = React.useState(file.name);
  const [isLoading, setIsLoading] = React.useState(false);
  const [emails, setEmails] = React.useState<string[]>([]);
  const path = usePathname();

  const closeModals = () => {
    setIsModalOpen(false);
    setIsDropdownOpen(false);
    setAction(null);
    setName(file.name);
  };

  const handleAction = async () => {
    if (!action) return;
    setIsLoading(true);
    let success = false;
    const actions = {
      rename: () =>
        renameFile({ fileId: file.$id, name, extension: file.extension, path }),
      share: () => updatedFileUsers({ fileId: file.$id, emails, path }),
      delete: () => deleteFile({ fileId: file.$id, bucketFileId: file.bucketFileId, path }),
    };
    success = await actions[action.value as keyof typeof actions]();
    if (success) closeModals()
    setIsLoading(false)
  };

  const handleRemoveEmail = async (email: string) => {
    const newEmails = emails.filter((e) => e !== email);
    const success = await updatedFileUsers({ fileId: file.$id, emails: newEmails, path });
    if (success) setEmails(newEmails);
    closeModals();
  };

  // render modal content based on action
  const renderModalContent = () => {
    if (!action) return null;
    const { label, value } = action;
    return (
      <DialogContent className="shad-dialog-button">
        <DialogHeader className="flex flex-col gap-2">
          <DialogTitle className="text-center text-light-100">
            {label}
          </DialogTitle>
          {value === "rename" && (
            <Input
              value={name}
              type="text"
              onChange={(e) => setName(e.target.value)}
            />
          )}
          {
            value === 'details' && <FileDetailsModalContent file={file} />
          }
          {
            value === 'share' && <ShareInput file={file} onInputChange={setEmails} onRemove={handleRemoveEmail} />
          }
          {
            value === 'delete' && (
                <p className="file-delete-confirmation">
                    Are you sure you want to delete{` `}
                    <span className="delete-file-name">{file.name}</span>{` ? `}
                </p>
            )
          }
        </DialogHeader>
        {["share", "delete", "rename"].includes(value) && (
          <DialogFooter className="flex flex-col gap-3 md:flex-row">
            <Button className="modal-cancel-button" onClick={closeModals}>
              Cancel
            </Button>
            <Button
              className="modal-submit-button"
              onClick={handleAction}
            >
              <p className="capitalize">{label}</p>
              {isLoading && (
                <Image
                  src="/assets/icons/loader.svg"
                  alt="loading"
                  width={20}
                  height={20}
                  className="animate-spin"
                />
              )}
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    );
  };
  return (
    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
      <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
        <DropdownMenuTrigger className="shad-no-focus">
          <Image
            src="/assets/icons/dots.svg"
            alt="dots"
            width={30}
            height={30}
          />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel className="truncate max-w-[200px]">
            {file.name}
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          {actionsDropdownItems.map((actionItem) => {
            const { label, icon, value } = actionItem;
            return (
              <DropdownMenuItem
                key={value}
                onClick={() => {
                  setAction(actionItem);
                  if (actionItems.includes(value)) {
                    setIsModalOpen(true);
                  }
                }}
                className="shad-dropdown-item"
              >
                {value === "download" ? (
                  <Link
                    href={constructDownloadUrl(file.bucketFileId)}
                    download={file.name}
                    className="flex items-center gap-2"
                  >
                    <Image
                      src={icon}
                      alt={label}
                      width={20}
                      height={20}
                      className="opacity-50 hover:opacity-100"
                    />
                    <p className="body-2 truncate">{label}</p>
                  </Link>
                ) : (
                  <div className="flex items-center gap-2">
                    <Image
                      src={icon}
                      alt={label}
                      width={20}
                      height={20}
                      className="opacity-50 hover:opacity-100"
                    />
                    <p className="body-2 truncate">{label}</p>
                  </div>
                )}
              </DropdownMenuItem>
            );
          })}
        </DropdownMenuContent>
      </DropdownMenu>
      {renderModalContent()}
    </Dialog>
  );
};

export default ActionDropdown;
