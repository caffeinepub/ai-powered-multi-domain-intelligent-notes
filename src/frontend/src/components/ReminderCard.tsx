import { RevisionReminder } from '../backend';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bell, Calendar, CheckCircle2, XCircle } from 'lucide-react';
import { useUpdateReminder, useDeactivateReminder } from '../hooks/useReminders';
import { toast } from 'sonner';

interface ReminderCardProps {
  reminder: RevisionReminder;
}

export default function ReminderCard({ reminder }: ReminderCardProps) {
  const updateReminderMutation = useUpdateReminder();
  const deactivateReminderMutation = useDeactivateReminder();

  const handleMarkRevised = async () => {
    try {
      const newCount = Number(reminder.timesRevised) + 1;
      const nextDate = new Date();
      nextDate.setDate(nextDate.getDate() + 7); // Schedule next revision in 7 days
      await updateReminderMutation.mutateAsync({
        reminderId: reminder.id,
        timesRevised: BigInt(newCount),
        nextRevision: nextDate.toISOString().split('T')[0],
      });
      toast.success('Revision recorded successfully');
    } catch (error) {
      toast.error('Failed to update reminder');
    }
  };

  const handleDeactivate = async () => {
    try {
      await deactivateReminderMutation.mutateAsync(reminder.id);
      toast.success('Reminder deactivated');
    } catch (error) {
      toast.error('Failed to deactivate reminder');
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <Card className={`hover:shadow-lg transition-all bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-amber-200/50 dark:border-gray-700/50 ${!reminder.active ? 'opacity-60' : ''}`}>
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <Bell className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0" />
            <CardTitle className="text-lg font-semibold text-foreground truncate">
              {reminder.topic}
            </CardTitle>
          </div>
          <Badge className="bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400">
            {Number(reminder.timesRevised)}x
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="w-4 h-4" />
            Next: {formatDate(reminder.nextRevision)}
          </div>
          <div className="flex items-center gap-2 text-sm">
            {reminder.active ? (
              <Badge variant="outline" className="gap-1 text-green-600 border-green-600">
                <CheckCircle2 className="w-3 h-3" />
                Active
              </Badge>
            ) : (
              <Badge variant="outline" className="gap-1 text-gray-600 border-gray-600">
                <XCircle className="w-3 h-3" />
                Inactive
              </Badge>
            )}
          </div>
        </div>
      </CardContent>
      {reminder.active && (
        <CardFooter className="pt-4 border-t border-amber-200/50 dark:border-gray-700/50 gap-2">
          <Button
            onClick={handleMarkRevised}
            disabled={updateReminderMutation.isPending}
            className="flex-1 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white"
          >
            <CheckCircle2 className="w-4 h-4 mr-2" />
            Mark Revised
          </Button>
          <Button
            variant="outline"
            onClick={handleDeactivate}
            disabled={deactivateReminderMutation.isPending}
          >
            Deactivate
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
