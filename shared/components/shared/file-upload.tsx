// FileUpload.tsx
import { UploadButton } from '@/shared/lib/uploadthing';
import { cn } from '@/shared/lib/utils';

interface FileUploadProps {
  onUploadSuccess: (url: string) => void;
  className?: string;
}


const FileUpload: React.FC<FileUploadProps> = ({ onUploadSuccess, className }) => {
  return (
    <div>
      <UploadButton 
        endpoint="imageUploader"
        onClientUploadComplete={(res) => onUploadSuccess(res[0].url)}
      />
    </div>
  );
};

export default FileUpload;
