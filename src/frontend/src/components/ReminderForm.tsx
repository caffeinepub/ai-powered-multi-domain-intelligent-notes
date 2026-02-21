import { useState } from 'react';
import { useCreateRevisionReminder } from '../hooks/useReminders';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Save, X } from 'lucide-react';

interface ReminderFormProps {
  onClose: () => void;
}

export default function ReminderForm({ onClose }: ReminderFormProps) {
  const [topic, setTopic] = useState('');
  const [nextRevision, setNextRevision] = useState('');

  const createReminderMutation = useCreateRevisionReminder();

  const handleSubmit = async () => {
    if (!topic.trim()) {
      toast.error('Please enter a topic');
      return;
    }
    if (!nextRevision) {
      toast.error('Please select a revision date');
      return;
    }

    try {
      await createReminderMutation.mutateAsync({
        topic,
        timesRevised: BigInt(0),
        nextRevision,
      });
      toast.success('Reminder created successfully');
      onClose();
    } catch (error) {
      toast.error('Failed to create reminder');
    }
  };

  const isSaving = createReminderMutation.isPending;

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="topic">Topic</Label>
        <Input
          id="topic"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="e.g., Cardiovascular System"
          className="mt-1"
        />
      </div>

      <div>
        <Label htmlFor="next-revision">Next Revision Date</Label>
        <Input
          id="next-revision"
          type="date"
          value={nextRevision}
          onChange={(e) => setNextRevision(e.target.value)}
          className="mt-1"
        />
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
          {isSaving ? 'Creating...' : 'Create Reminder'}
        </Button>
      </div>
    </div>
  );
}
