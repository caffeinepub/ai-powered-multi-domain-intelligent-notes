import { useState } from 'react';
import { useCreateTimetableEntry } from '../hooks/useTimetable';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import { Save, X } from 'lucide-react';

interface TimetableEntryFormProps {
  onClose: () => void;
}

export default function TimetableEntryForm({ onClose }: TimetableEntryFormProps) {
  const [entryType, setEntryType] = useState('classes');
  const [title, setTitle] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [location, setLocation] = useState('');
  const [recurring, setRecurring] = useState(false);

  const createEntryMutation = useCreateTimetableEntry();

  const handleSubmit = async () => {
    if (!title.trim()) {
      toast.error('Please enter a title');
      return;
    }
    if (!startTime || !endTime) {
      toast.error('Please enter start and end times');
      return;
    }

    try {
      await createEntryMutation.mutateAsync({
        entryType,
        title,
        startTime,
        endTime,
        location,
        recurring,
      });
      toast.success('Timetable entry created successfully');
      onClose();
    } catch (error) {
      toast.error('Failed to create entry');
    }
  };

  const isSaving = createEntryMutation.isPending;

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="entry-type">Entry Type</Label>
        <Select value={entryType} onValueChange={setEntryType}>
          <SelectTrigger id="entry-type" className="mt-1">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="classes">Class</SelectItem>
            <SelectItem value="study_session">Study Session</SelectItem>
            <SelectItem value="exam">Exam</SelectItem>
            <SelectItem value="deadline">Deadline</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g., Mathematics Lecture"
          className="mt-1"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="start-time">Start Time</Label>
          <Input
            id="start-time"
            type="datetime-local"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="end-time">End Time</Label>
          <Input
            id="end-time"
            type="datetime-local"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            className="mt-1"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="location">Location (Optional)</Label>
        <Input
          id="location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="e.g., Room 101, Online"
          className="mt-1"
        />
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox id="recurring" checked={recurring} onCheckedChange={(checked) => setRecurring(checked as boolean)} />
        <Label htmlFor="recurring" className="cursor-pointer">
          Recurring event
        </Label>
      </div>

      <div className="flex items-center justify-end gap-2 pt-4">
        <Button variant="outline" onClick={onClose} disabled={isSaving}>
          <X className="w-4 h-4 mr-2" />
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={isSaving}
          className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white"
        >
          <Save className="w-4 h-4 mr-2" />
          {isSaving ? 'Creating...' : 'Create Entry'}
        </Button>
      </div>
    </div>
  );
}
