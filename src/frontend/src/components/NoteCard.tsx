import { Note, Domain } from '../backend';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2, Calendar, Sparkles, Stethoscope, Scale, FileText } from 'lucide-react';
import { useDeleteNote } from '../hooks/useNotes';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

interface NoteCardProps {
  note: Note;
  onEdit: (noteId: string) => void;
}

export default function NoteCard({ note, onEdit }: NoteCardProps) {
  const deleteNoteMutation = useDeleteNote();

  const handleDelete = async () => {
    try {
      await deleteNoteMutation.mutateAsync(note.id);
      toast.success('Note deleted successfully');
    } catch (error) {
      toast.error('Failed to delete note');
    }
  };

  const formatDate = (timestamp: bigint) => {
    const date = new Date(Number(timestamp));
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const getPreview = (content: string, maxLength: number = 150) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + '...';
  };

  const getDomainInfo = (domain: Domain) => {
    switch (domain) {
      case Domain.medical:
        return { icon: Stethoscope, label: 'Medical', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' };
      case Domain.legal:
        return { icon: Scale, label: 'Legal', color: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400' };
      default:
        return { icon: FileText, label: 'General', color: 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400' };
    }
  };

  const domainInfo = getDomainInfo(note.domain);
  const DomainIcon = domainInfo.icon;

  // Simulate AI insights
  const aiInsight = note.content.length > 100 
    ? `Key points: ${note.content.split('.')[0]}...` 
    : 'AI analysis available';

  return (
    <Card className="hover:shadow-xl transition-all hover:-translate-y-1 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-amber-200/50 dark:border-gray-700/50">
      <CardHeader>
        <div className="flex items-start justify-between gap-2 mb-2">
          <CardTitle className="text-lg font-semibold text-foreground line-clamp-2 flex-1">
            {note.title || 'Untitled Note'}
          </CardTitle>
          <Badge className={domainInfo.color}>
            <DomainIcon className="w-3 h-3 mr-1" />
            {domainInfo.label}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-sm text-muted-foreground line-clamp-4 whitespace-pre-wrap">
          {getPreview(note.content)}
        </p>
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg p-3 border border-purple-200 dark:border-purple-800">
          <div className="flex items-start gap-2">
            <Sparkles className="w-4 h-4 text-purple-600 dark:text-purple-400 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-purple-800 dark:text-purple-200 line-clamp-2">
              {aiInsight}
            </p>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex items-center justify-between pt-4 border-t border-amber-200/50 dark:border-gray-700/50">
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <Calendar className="w-3 h-3" />
          {formatDate(note.timestamp)}
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit(note.id)}
            className="hover:bg-amber-100 dark:hover:bg-gray-700"
          >
            <Edit className="w-4 h-4" />
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="hover:bg-rose-100 hover:text-rose-600 dark:hover:bg-rose-900/20"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Note</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete this note? This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDelete}
                  className="bg-rose-600 hover:bg-rose-700"
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </CardFooter>
    </Card>
  );
}
