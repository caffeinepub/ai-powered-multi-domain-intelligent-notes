import { MedicalReport, Domain } from '../backend';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FileText, Calendar, Eye, Brain, Stethoscope, Scale, File } from 'lucide-react';
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import ReportAnalysis from './ReportAnalysis';

interface ReportCardProps {
  report: MedicalReport;
}

export default function ReportCard({ report }: ReportCardProps) {
  const [isViewOpen, setIsViewOpen] = useState(false);

  const formatDate = (timestamp: bigint) => {
    const date = new Date(Number(timestamp));
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const getDomainInfo = (domain: Domain) => {
    switch (domain) {
      case Domain.medical:
        return { icon: Stethoscope, label: 'Medical', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' };
      case Domain.legal:
        return { icon: Scale, label: 'Legal', color: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400' };
      default:
        return { icon: File, label: 'General', color: 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400' };
    }
  };

  const domainInfo = getDomainInfo(report.domain);
  const DomainIcon = domainInfo.icon;

  return (
    <>
      <Card className="hover:shadow-xl transition-all hover:-translate-y-1 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-amber-200/50 dark:border-gray-700/50">
        <CardHeader>
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <DomainIcon className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0" />
              <CardTitle className="text-lg font-semibold text-foreground truncate">
                Document #{report.id}
              </CardTitle>
            </div>
            <Badge className={domainInfo.color}>
              {domainInfo.label}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="w-4 h-4" />
              Uploaded {formatDate(report.uploadTimestamp)}
            </div>
            {report.isAnalysed ? (
              <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
                <Brain className="w-4 h-4" />
                AI analysis available
              </div>
            ) : (
              <div className="flex items-center gap-2 text-sm text-amber-600 dark:text-amber-400">
                <Brain className="w-4 h-4" />
                Ready for analysis
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter className="pt-4 border-t border-amber-200/50 dark:border-gray-700/50">
          <Button
            onClick={() => setIsViewOpen(true)}
            className="w-full bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white"
          >
            <Eye className="w-4 h-4 mr-2" />
            View & Analyze
          </Button>
        </CardFooter>
      </Card>

      <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <DomainIcon className="w-5 h-5" />
              {domainInfo.label} Document Analysis
            </DialogTitle>
          </DialogHeader>
          <ReportAnalysis report={report} />
        </DialogContent>
      </Dialog>
    </>
  );
}
