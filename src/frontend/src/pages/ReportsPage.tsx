import { useState } from 'react';
import { useGetUserReports } from '../hooks/useReports';
import DocumentUpload from '../components/DocumentUpload';
import ReportCard from '../components/ReportCard';
import { FileText, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';

export default function ReportsPage() {
  const { data: reports, isLoading } = useGetUserReports();
  const [isUploadOpen, setIsUploadOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading documents...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Hero Banner */}
      <div className="mb-8 rounded-2xl overflow-hidden shadow-xl">
        <img
          src="/assets/generated/hero-banner.dim_1200x400.png"
          alt="Document Analysis"
          className="w-full h-48 object-cover"
        />
      </div>

      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Document Analysis</h1>
          <p className="text-muted-foreground">
            Upload medical reports and legal documents for AI-powered analysis
          </p>
        </div>
        <Button
          onClick={() => setIsUploadOpen(true)}
          className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all"
        >
          <Upload className="w-4 h-4 mr-2" />
          Upload Document
        </Button>
      </div>

      {reports && reports.length > 0 ? (
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {reports.map((report) => (
            <ReportCard key={report.id} report={report} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <div className="w-24 h-24 bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/20 dark:to-orange-900/20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
            <FileText className="w-12 h-12 text-amber-600 dark:text-amber-400" />
          </div>
          <h3 className="text-2xl font-semibold mb-3 text-foreground">No documents yet</h3>
          <p className="text-muted-foreground mb-8 max-w-md mx-auto">
            Upload your first document for automatic classification and AI-powered analysis
          </p>
          <Button
            onClick={() => setIsUploadOpen(true)}
            className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white rounded-full shadow-lg"
          >
            <Upload className="w-4 h-4 mr-2" />
            Upload Document
          </Button>
        </div>
      )}

      <Dialog open={isUploadOpen} onOpenChange={setIsUploadOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Upload Document</DialogTitle>
            <DialogDescription>
              Upload any document - our AI will automatically classify it as medical, legal, or general
            </DialogDescription>
          </DialogHeader>
          <DocumentUpload onClose={() => setIsUploadOpen(false)} />
        </DialogContent>
      </Dialog>
    </div>
  );
}
