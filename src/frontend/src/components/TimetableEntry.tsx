import { TimetableEntry as TimetableEntryType, EntryType } from '../backend';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, MapPin, Repeat, Trash2, BookOpen, GraduationCap, Calendar as CalendarIcon, FileText } from 'lucide-react';
import { useDeleteTimetableEntry } from '../hooks/useTimetable';
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

interface TimetableEntryProps {
  entry: TimetableEntryType;
}

export default function TimetableEntry({ entry }: TimetableEntryProps) {
  const deleteEntryMutation = useDeleteTimetableEntry();

  const handleDelete = async () => {
    try {
      await deleteEntryMutation.mutateAsync(entry.id);
      toast.success('Entry deleted successfully');
    } catch (error) {
      toast.error('Failed to delete entry');
    }
  };

  const getEntryTypeInfo = (type: EntryType) => {
    switch (type) {
      case EntryType.classes:
        return { icon: BookOpen, label: 'Class', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' };
      case EntryType.studySession:
        return { icon: GraduationCap, label: 'Study', color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' };
      case EntryType.exam:
        return { icon: FileText, label: 'Exam', color: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' };
      case EntryType.deadline:
        return { icon: CalendarIcon, label: 'Deadline', color: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400' };
      default:
        return { icon: CalendarIcon, label: 'Other', color: 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400' };
    }
  };

  const typeInfo = getEntryTypeInfo(entry.entryType);
  const TypeIcon = typeInfo.icon;

  return (
    <Card className="hover:shadow-lg transition-all bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-amber-200/50 dark:border-gray-700/50">
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-4 flex-1 min-w-0">
            <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl flex items-center justify-center flex-shrink-0">
              <TypeIcon className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="font-semibold text-lg text-foreground truncate">{entry.title}</h3>
                <Badge className={typeInfo.color}>{typeInfo.label}</Badge>
                {entry.recurring && (
                  <Badge variant="outline" className="gap-1">
                    <Repeat className="w-3 h-3" />
                    Recurring
                  </Badge>
                )}
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="w-4 h-4" />
                  {entry.startTime} - {entry.endTime}
                </div>
                {entry.location && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="w-4 h-4" />
                    {entry.location}
                  </div>
                )}
              </div>
            </div>
          </div>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="hover:bg-rose-100 hover:text-rose-600 dark:hover:bg-rose-900/20 flex-shrink-0"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Entry</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete this timetable entry? This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete} className="bg-rose-600 hover:bg-rose-700">
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </CardContent>
    </Card>
  );
}
