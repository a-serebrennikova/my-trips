import {
  FileUpload,
  FileUploadTrigger,
  FileUploadList,
  FileUploadItem,
  FileUploadItemPreview,
  FileUploadItemMetadata,
  FileUploadItemDelete,
  FileUploadProps,
} from "@/components/ui/file-upload";
import { Button } from "@radix-ui/themes";
import { X } from "lucide-react";

interface IProps {
  file: File | null;
  onFileValidate: FileUploadProps["onFileValidate"];
  onValueChange: FileUploadProps["onValueChange"];
  onFileReject: FileUploadProps["onFileReject"];
  avatarUrl?: string | null;
}

export const UploadAvatar = ({
  file,
  onFileReject,
  onFileValidate,
  onValueChange,
  avatarUrl,
}: IProps) => {
  return (
    <FileUpload
      value={file ? [file] : []}
      onFileValidate={onFileValidate}
      onValueChange={onValueChange}
      onFileReject={onFileReject}
      maxFiles={1}
      multiple={false}
    >
      {/* TODO fix drag and drop */}
      {!file && (
        // <FileUploadDropzone>
        <>
          {/* <div className="flex flex-col items-center gap-1">
            <div className="flex items-center justify-center rounded-full border p-2.5">
              <Upload className="size-6 text-muted-foreground" />
            </div>
            <p className="font-medium text-sm">Drag & drop files here</p>
            <p className="text-muted-foreground text-xs">
              Click to browse
            </p>
          </div> */}
          <FileUploadTrigger asChild>
            <Button variant="outline" size="2" className="mt-2 w-fit">
              {avatarUrl ? "Change avatar" : "Browse avatar"}
            </Button>
          </FileUploadTrigger>
        </>
        // </FileUploadDropzone>
      )}
      <FileUploadList>
        {file && (
          <FileUploadItem key={file.name} value={file}>
            <FileUploadItemPreview />
            <FileUploadItemMetadata />
            <FileUploadItemDelete asChild>
              <Button variant="ghost" size="2" className="size-7">
                <X />
              </Button>
            </FileUploadItemDelete>
          </FileUploadItem>
        )}
      </FileUploadList>
    </FileUpload>
  );
};
