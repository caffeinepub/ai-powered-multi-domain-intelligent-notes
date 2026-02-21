import { useState, useEffect } from 'react';
import { MedicalReport, Domain } from '../backend';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useSaveAnalysis } from '../hooks/useReports';
import { Brain, Save, FileText, AlertCircle, Stethoscope, Scale } from 'lucide-react';
import { toast } from 'sonner';
import LegalAnalysisView from './LegalAnalysisView';

interface ReportAnalysisProps {
  report: MedicalReport;
}

export default function ReportAnalysis({ report }: ReportAnalysisProps) {
  const [analysis, setAnalysis] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const saveAnalysisMutation = useSaveAnalysis();

  useEffect(() => {
    if (report.analysis) {
      setAnalysis(report.analysis);
    } else {
      setIsEditing(true);
    }
  }, [report]);

  const handleSave = async () => {
    if (!analysis.trim()) {
      toast.error('Please enter analysis text');
      return;
    }

    try {
      await saveAnalysisMutation.mutateAsync({ reportId: report.id, analysis });
      toast.success('Analysis saved successfully');
      setIsEditing(false);
    } catch (error) {
      toast.error('Failed to save analysis');
    }
  };

  const formatDate = (timestamp: bigint) => {
    const date = new Date(Number(timestamp));
    return date.toLocaleDateString('en-US', { 
      month: 'long', 
      day: 'numeric', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const isLegal = report.domain === Domain.legal;

  return (
    <div className="space-y-6">
      {/* Report Info */}
      <div className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-lg p-4 border border-amber-200 dark:border-amber-800">
        <div className="flex items-center gap-3 mb-3">
          {isLegal ? (
            <Scale className="w-6 h-6 text-purple-600 dark:text-purple-400" />
          ) : (
            <Stethoscope className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          )}
          <div>
            <h3 className="font-semibold text-foreground">Document #{report.id}</h3>
            <p className="text-sm text-muted-foreground">Uploaded {formatDate(report.uploadTimestamp)}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {report.isAnalysed ? (
            <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
              <Brain className="w-3 h-3 mr-1" />
              Analyzed
            </Badge>
          ) : (
            <Badge variant="secondary">
              <AlertCircle className="w-3 h-3 mr-1" />
              Pending Analysis
            </Badge>
          )}
          <Badge className={isLegal ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400' : 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'}>
            {isLegal ? 'Legal Document' : 'Medical Report'}
          </Badge>
        </div>
      </div>

      {/* Document Preview */}
      <div>
        <Label className="text-base font-semibold mb-2 block">Document</Label>
        <div className="bg-muted/50 rounded-lg p-4 border border-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FileText className="w-8 h-8 text-amber-600 dark:text-amber-400" />
              <div>
                <p className="text-sm font-medium">{isLegal ? 'Legal Document' : 'Medical Report'}</p>
                <p className="text-xs text-muted-foreground">View original file</p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.open(report.file.getDirectURL(), '_blank')}
            >
              Open File
            </Button>
          </div>
        </div>
      </div>

      {/* Conditional Analysis View */}
      {isLegal ? (
        <LegalAnalysisView reportId={report.id} />
      ) : (
        <div>
          <div className="flex items-center justify-between mb-2">
            <Label className="text-base font-semibold">AI Analysis</Label>
            {!isEditing && report.isAnalysed && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsEditing(true)}
              >
                Edit
              </Button>
            )}
          </div>

          {!report.isAnalysed && (
            <Alert className="mb-4 bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
              <Brain className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              <AlertDescription className="text-blue-800 dark:text-blue-200">
                Add your analysis of this medical report. Include key findings, diagnoses, and recommendations.
              </AlertDescription>
            </Alert>
          )}

          {isEditing ? (
            <div className="space-y-4">
              <Textarea
                value={analysis}
                onChange={(e) => setAnalysis(e.target.value)}
                placeholder="Enter detailed analysis of the medical report...&#10;&#10;Include:&#10;- Key findings&#10;- Diagnoses&#10;- Medical terms explained&#10;- Recommendations"
                rows={15}
                className="resize-none"
              />
              <div className="flex items-center justify-end gap-2">
                {report.isAnalysed && (
                  <Button
                    variant="outline"
                    onClick={() => {
                      setAnalysis(report.analysis || '');
                      setIsEditing(false);
                    }}
                    disabled={saveAnalysisMutation.isPending}
                  >
                    Cancel
                  </Button>
                )}
                <Button
                  onClick={handleSave}
                  disabled={saveAnalysisMutation.isPending}
                  className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {saveAnalysisMutation.isPending ? 'Saving...' : 'Save Analysis'}
                </Button>
              </div>
            </div>
          ) : (
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-border">
              <div className="prose prose-sm dark:prose-invert max-w-none">
                <p className="whitespace-pre-wrap text-foreground">{analysis}</p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
