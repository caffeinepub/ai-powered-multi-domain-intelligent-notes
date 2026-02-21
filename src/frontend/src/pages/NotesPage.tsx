import { useState } from 'react';
import { useGetUserNotes, useDeleteNote } from '../hooks/useNotes';
import NoteCard from '../components/NoteCard';
import NoteEditor from '../components/NoteEditor';
import { Button } from '@/components/ui/button';
import { Plus, FileText } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

export default function NotesPage() {
  const { data: notes, isLoading } = useGetUserNotes();
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);

  const handleCreateNew = () => {
    setEditingNoteId(null);
    setIsEditorOpen(true);
  };

  const handleEdit = (noteId: string) => {
    setEditingNoteId(noteId);
    setIsEditorOpen(true);
  };

  const handleClose = () => {
    setIsEditorOpen(false);
    setEditingNoteId(null);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading notes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">AI-Enhanced Notes</h1>
          <p className="text-muted-foreground">
            {notes?.length || 0} {notes?.length === 1 ? 'note' : 'notes'} with intelligent insights
          </p>
        </div>
        <Button
          onClick={handleCreateNew}
          className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all"
        >
          <Plus className="w-4 h-4 mr-2" />
          New Note
        </Button>
      </div>

      {notes && notes.length > 0 ? (
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {notes.map((note) => (
            <NoteCard key={note.id} note={note} onEdit={handleEdit} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <div className="w-24 h-24 bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/20 dark:to-orange-900/20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
            <FileText className="w-12 h-12 text-amber-600 dark:text-amber-400" />
          </div>
          <h3 className="text-2xl font-semibold mb-3 text-foreground">No notes yet</h3>
          <p className="text-muted-foreground mb-8 max-w-md mx-auto">
            Create your first AI-enhanced note to get started with intelligent summaries and insights
          </p>
          <Button
            onClick={handleCreateNew}
            className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white rounded-full shadow-lg"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Note
          </Button>
        </div>
      )}

      <Dialog open={isEditorOpen} onOpenChange={setIsEditorOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingNoteId ? 'Edit Note' : 'Create New Note'}</DialogTitle>
          </DialogHeader>
          <NoteEditor noteId={editingNoteId} onClose={handleClose} />
        </DialogContent>
      </Dialog>
    </div>
  );
}
