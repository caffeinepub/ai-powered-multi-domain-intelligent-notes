import { useState } from 'react';
import { useGetUserReminders } from '../hooks/useReminders';
import ReminderCard from '../components/ReminderCard';
import ReminderForm from '../components/ReminderForm';
import { Button } from '@/components/ui/button';
import { Plus, Bell } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

export default function RemindersPage() {
  const { data: reminders, isLoading } = useGetUserReminders();
  const [isFormOpen, setIsFormOpen] = useState(false);

  const activeReminders = reminders?.filter((r) => r.active) || [];
  const inactiveReminders = reminders?.filter((r) => !r.active) || [];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading reminders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Revision Reminders</h1>
          <p className="text-muted-foreground">
            Track your revision progress and schedule review sessions
          </p>
        </div>
        <Button
          onClick={() => setIsFormOpen(true)}
          className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Reminder
        </Button>
      </div>

      {reminders && reminders.length > 0 ? (
        <div className="space-y-8">
          {activeReminders.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold mb-4 text-foreground">Active Reminders</h2>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {activeReminders.map((reminder) => (
                  <ReminderCard key={Number(reminder.id)} reminder={reminder} />
                ))}
              </div>
            </div>
          )}

          {inactiveReminders.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold mb-4 text-muted-foreground">Inactive Reminders</h2>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {inactiveReminders.map((reminder) => (
                  <ReminderCard key={Number(reminder.id)} reminder={reminder} />
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-20">
          <div className="w-24 h-24 bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/20 dark:to-orange-900/20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
            <Bell className="w-12 h-12 text-amber-600 dark:text-amber-400" />
          </div>
          <h3 className="text-2xl font-semibold mb-3 text-foreground">No reminders yet</h3>
          <p className="text-muted-foreground mb-8 max-w-md mx-auto">
            Create your first revision reminder to track your learning progress
          </p>
          <Button
            onClick={() => setIsFormOpen(true)}
            className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white rounded-full shadow-lg"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Reminder
          </Button>
        </div>
      )}

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create Revision Reminder</DialogTitle>
          </DialogHeader>
          <ReminderForm onClose={() => setIsFormOpen(false)} />
        </DialogContent>
      </Dialog>
    </div>
  );
}
