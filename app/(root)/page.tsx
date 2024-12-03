import ActionDropdown from "@/components/ActionDropdown";
import { Chart } from "@/components/Chart";
import DateTime from "@/components/DateTime";
import Thumbnail from "@/components/Thumbnail";
import { getFiles, getTotalSpaceUsed } from "@/lib/actions/file.actions";
import Link from "next/link";
import { Models } from "node-appwrite";

const page = async () => {
  const [files, totalSpace] = await Promise.all([getFiles({ types: [], limit: 5 }), getTotalSpaceUsed()]);

  return (
    <div className="dashboard-container">
      <section>
        <Chart used={totalSpace.used} />
      </section>
      <section className="dashboard-recent-files">
        <h2 className="h3 xl:h2 text-light-100 underline">Recent files uploaded</h2>
        {files && files.total > 0 ? (
          <ul className="flex flex-col gap-5 mt-5">
            {files.documents.map((file: Models.Document) => (
              <Link target="_blank" href={file.url} key={file.$id}>
                <Thumbnail
                  type={file.type}
                  extension={file.extension}
                  url={file.url}
                />

                <div className="recent-file-details">
                  <div className="flex flex-col gap-1">
                    <p className="recent-file-name">{file.name}</p>
                    <DateTime date={file.$createdAt} className="caption" />
                  </div>
                  <ActionDropdown file={file} />
                </div>
              </Link>
            ))}
          </ul>
        ) : (
          <p className="empty-list">No files uploaded 😞</p>
        )}
      </section>
    </div>
  );
}

export default page;
