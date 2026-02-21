import { useState } from 'react';
import { useGetUserTimetableEntries } from '../hooks/useTimetable';
import TimetableEntry from '../components/TimetableEntry';
import TimetableEntryForm from '../components/TimetableEntryForm';
import { Button } from '@/components/ui/button';
import { Plus, Calendar } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

export default function TimetablePage() {
  const { data: entries, isLoading } = useGetUserTimetableEntries();
  const [isFormOpen, setIsFormOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading timetable...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Smart Timetable</h1>
          <p className="text-muted-foreground">
            Manage your classes, study sessions, exams, and deadlines
          </p>
        </div>
        <Button
          onClick={() => setIsFormOpen(true)}
          className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Entry
        </Button>
      </div>

      {entries && entries.length > 0 ? (
        <div className="space-y-4">
          {entries.map((entry) => (
            <TimetableEntry key={Number(entry.id)} entry={entry} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <div className="w-24 h-24 bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/20 dark:to-orange-900/20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
            <Calendar className="w-12 h-12 text-amber-600 dark:text-amber-400" />
          </div>
          <h3 className="text-2xl font-semibold mb-3 text-foreground">No timetable entries yet</h3>
          <p className="text-muted-foreground mb-8 max-w-md mx-auto">
            Create your first timetable entry to organize your schedule
          </p>
          <Button
            onClick={() => setIsFormOpen(true)}
            className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white rounded-full shadow-lg"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Entry
          </Button>
        </div>
      )}

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add Timetable Entry</DialogTitle>
          </DialogHeader>
          <TimetableEntryForm onClose={() => setIsFormOpen(false)} />
        </DialogContent>
      </Dialog>
    </div>
  );
}
