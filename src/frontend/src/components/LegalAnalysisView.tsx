import { useState } from 'react';
import { useGetLegalAnalysis, useSaveLegalAnalysis } from '../hooks/useReports';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Scale, Save, Plus, X, FileText, Users, Calendar as CalendarIcon, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import type { Clause, Obligation, Right, Party, DateInfo } from '../backend';

interface LegalAnalysisViewProps {
  reportId: string;
}

export default function LegalAnalysisView({ reportId }: LegalAnalysisViewProps) {
  const { data: legalAnalysis, isLoading } = useGetLegalAnalysis(reportId);
  const saveLegalAnalysisMutation = useSaveLegalAnalysis();

  const [summary, setSummary] = useState('');
  const [clauses, setClauses] = useState<Clause[]>([]);
  const [obligations, setObligations] = useState<Obligation[]>([]);
  const [rights, setRights] = useState<Right[]>([]);
  const [parties, setParties] = useState<Party[]>([]);
  const [dates, setDates] = useState<DateInfo[]>([]);
  const [isEditing, setIsEditing] = useState(false);

  useState(() => {
    if (legalAnalysis) {
      setSummary(legalAnalysis.summary);
      setClauses(legalAnalysis.clauses);
      setObligations(legalAnalysis.obligations);
      setRights(legalAnalysis.rights);
      setParties(legalAnalysis.parties);
      setDates(legalAnalysis.dates);
    } else {
      setIsEditing(true);
    }
  });

  const handleSave = async () => {
    if (!summary.trim()) {
      toast.error('Please enter a summary');
      return;
    }

    try {
      await saveLegalAnalysisMutation.mutateAsync({
        documentId: reportId,
        clauses,
        obligations,
        rights,
        parties,
        dates,
        summary,
      });
      toast.success('Legal analysis saved successfully');
      setIsEditing(false);
    } catch (error) {
      toast.error('Failed to save legal analysis');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
      </div>
    );
  }

  const hasAnalysis = legalAnalysis !== null;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Label className="text-base font-semibold flex items-center gap-2">
          <Scale className="w-5 h-5" />
          Legal Document Analysis
        </Label>
        {!isEditing && hasAnalysis && (
          <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
            Edit
          </Button>
        )}
      </div>

      {!hasAnalysis && (
        <Alert className="bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800">
          <AlertCircle className="h-4 w-4 text-purple-600 dark:text-purple-400" />
          <AlertDescription className="text-purple-800 dark:text-purple-200">
            Add legal analysis including clauses, obligations, rights, parties, and important dates.
          </AlertDescription>
        </Alert>
      )}

      {isEditing ? (
        <div className="space-y-6">
          <div>
            <Label>Summary</Label>
            <Textarea
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              placeholder="Enter a brief summary of the legal document..."
              rows={4}
              className="mt-1"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <Label>Parties</Label>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setParties([...parties, { name: '', role: '' }])}
              >
                <Plus className="w-4 h-4 mr-1" />
                Add Party
              </Button>
            </div>
            <div className="space-y-2">
              {parties.map((party, idx) => (
                <div key={idx} className="flex gap-2">
                  <Input
                    placeholder="Party name"
                    value={party.name}
                    onChange={(e) => {
                      const newParties = [...parties];
                      newParties[idx].name = e.target.value;
                      setParties(newParties);
                    }}
                  />
                  <Input
                    placeholder="Role"
                    value={party.role}
                    onChange={(e) => {
                      const newParties = [...parties];
                      newParties[idx].role = e.target.value;
                      setParties(newParties);
                    }}
                  />
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => setParties(parties.filter((_, i) => i !== idx))}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <Label>Key Clauses</Label>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setClauses([...clauses, { title: '', content: '', explanation: '' }])}
              >
                <Plus className="w-4 h-4 mr-1" />
                Add Clause
              </Button>
            </div>
            <div className="space-y-3">
              {clauses.map((clause, idx) => (
                <div key={idx} className="border rounded-lg p-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <Input
                      placeholder="Clause title"
                      value={clause.title}
                      onChange={(e) => {
                        const newClauses = [...clauses];
                        newClauses[idx].title = e.target.value;
                        setClauses(newClauses);
                      }}
                      className="flex-1"
                    />
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => setClauses(clauses.filter((_, i) => i !== idx))}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                  <Textarea
                    placeholder="Clause content"
                    value={clause.content}
                    onChange={(e) => {
                      const newClauses = [...clauses];
                      newClauses[idx].content = e.target.value;
                      setClauses(newClauses);
                    }}
                    rows={2}
                  />
                  <Textarea
                    placeholder="Explanation"
                    value={clause.explanation}
                    onChange={(e) => {
                      const newClauses = [...clauses];
                      newClauses[idx].explanation = e.target.value;
                      setClauses(newClauses);
                    }}
                    rows={2}
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-4">
            {hasAnalysis && (
              <Button variant="outline" onClick={() => setIsEditing(false)} disabled={saveLegalAnalysisMutation.isPending}>
                Cancel
              </Button>
            )}
            <Button
              onClick={handleSave}
              disabled={saveLegalAnalysisMutation.isPending}
              className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white"
            >
              <Save className="w-4 h-4 mr-2" />
              {saveLegalAnalysisMutation.isPending ? 'Saving...' : 'Save Analysis'}
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-border">
            <h3 className="font-semibold mb-2 flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Summary
            </h3>
            <p className="text-sm text-foreground whitespace-pre-wrap">{summary}</p>
          </div>

          {parties.length > 0 && (
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-border">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Users className="w-4 h-4" />
                Parties
              </h3>
              <div className="space-y-2">
                {parties.map((party, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-sm">
                    <span className="font-medium">{party.name}</span>
                    <span className="text-muted-foreground">-</span>
                    <span className="text-muted-foreground">{party.role}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {clauses.length > 0 && (
            <div>
              <h3 className="font-semibold mb-3">Key Clauses</h3>
              <Accordion type="single" collapsible className="space-y-2">
                {clauses.map((clause, idx) => (
                  <AccordionItem key={idx} value={`clause-${idx}`} className="border rounded-lg px-4">
                    <AccordionTrigger className="text-sm font-medium hover:no-underline">
                      {clause.title}
                    </AccordionTrigger>
                    <AccordionContent className="space-y-2 text-sm">
                      <div>
                        <p className="font-medium text-muted-foreground mb-1">Content:</p>
                        <p className="whitespace-pre-wrap">{clause.content}</p>
                      </div>
                      <div>
                        <p className="font-medium text-muted-foreground mb-1">Explanation:</p>
                        <p className="whitespace-pre-wrap">{clause.explanation}</p>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
