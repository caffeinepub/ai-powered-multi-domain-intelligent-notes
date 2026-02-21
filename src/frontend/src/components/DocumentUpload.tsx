import { useState, useRef } from 'react';
import { useUploadMedicalReport } from '../hooks/useReports';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Upload, FileText, AlertCircle, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import { ExternalBlob } from '../backend';

interface DocumentUploadProps {
  onClose: () => void;
}

export default function DocumentUpload({ onClose }: DocumentUploadProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const uploadMutation = useUploadMedicalReport();

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const validTypes = ['application/pdf', 'text/plain'];
      if (!validTypes.includes(file.type)) {
        toast.error('Please select a PDF or text file');
        return;
      }

      const maxSize = 10 * 1024 * 1024; // 10MB
      if (file.size > maxSize) {
        toast.error('File size must be less than 10MB');
        return;
      }

      setSelectedFile(file);
      setUploadProgress(0);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error('Please select a file');
      return;
    }

    try {
      const arrayBuffer = await selectedFile.arrayBuffer();
      const uint8Array = new Uint8Array(arrayBuffer);
      
      const blob = ExternalBlob.fromBytes(uint8Array).withUploadProgress((percentage) => {
        setUploadProgress(percentage);
      });

      await uploadMutation.mutateAsync(blob);
      toast.success('Document uploaded and classified successfully');
      onClose();
    } catch (error) {
      toast.error('Failed to upload document');
      console.error('Upload error:', error);
    }
  };

  const isUploading = uploadMutation.isPending;

  return (
    <div className="space-y-6">
      {/* Medical Icon */}
      <div className="flex justify-center">
        <img
          src="/assets/generated/medical-icon.dim_128x128.png"
          alt="Document"
          className="w-24 h-24"
        />
      </div>

      <Alert className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border-amber-200 dark:border-amber-800">
        <Sparkles className="h-4 w-4 text-amber-600 dark:text-amber-400" />
        <AlertDescription className="text-amber-800 dark:text-amber-200">
          <strong>Automatic Classification:</strong> Our AI will automatically detect if your document is medical, legal, or general content
        </AlertDescription>
      </Alert>

      <div>
        <Label htmlFor="file-upload">Select Document</Label>
        <div className="mt-2">
          <input
            ref={fileInputRef}
            id="file-upload"
            type="file"
            accept=".pdf,.txt"
            onChange={handleFileSelect}
            className="hidden"
          />
          <Button
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="w-full h-32 border-2 border-dashed border-amber-300 dark:border-amber-700 hover:border-amber-400 dark:hover:border-amber-600 hover:bg-amber-50 dark:hover:bg-amber-900/20 transition-all"
          >
            <div className="text-center">
              <Upload className="w-8 h-8 mx-auto mb-2 text-amber-600 dark:text-amber-400" />
              <p className="text-sm font-medium">Click to select file</p>
              <p className="text-xs text-muted-foreground mt-1">PDF or TXT (max 10MB)</p>
            </div>
          </Button>
        </div>
      </div>

      {selectedFile && (
        <div className="bg-muted/50 rounded-lg p-4 border border-border">
          <div className="flex items-center gap-3">
            <FileText className="w-8 h-8 text-amber-600 dark:text-amber-400" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{selectedFile.name}</p>
              <p className="text-xs text-muted-foreground">
                {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
          </div>
        </div>
      )}

      {isUploading && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Uploading...</span>
            <span className="font-medium">{uploadProgress}%</span>
          </div>
          <Progress value={uploadProgress} className="h-2" />
        </div>
      )}

      <div className="flex items-center justify-end gap-2 pt-4">
        <Button variant="outline" onClick={onClose} disabled={isUploading}>
          Cancel
        </Button>
        <Button
          onClick={handleUpload}
          disabled={!selectedFile || isUploading}
          className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white"
        >
          <Upload className="w-4 h-4 mr-2" />
          {isUploading ? 'Uploading...' : 'Upload Document'}
        </Button>
      </div>
    </div>
  );
}
