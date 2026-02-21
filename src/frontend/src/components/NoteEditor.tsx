import { useState, useEffect } from 'react';
import { useGetNote, useCreateNote, useEditNote } from '../hooks/useNotes';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { toast } from 'sonner';
import { Save, X, Sparkles } from 'lucide-react';

interface NoteEditorProps {
  noteId: string | null;
  onClose: () => void;
}

export default function NoteEditor({ noteId, onClose }: NoteEditorProps) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const { data: note, isLoading } = useGetNote(noteId);
  const createNoteMutation = useCreateNote();
  const editNoteMutation = useEditNote();

  useEffect(() => {
    if (note) {
      setTitle(note.title);
      setContent(note.content);
    }
  }, [note]);

  const handleSave = async () => {
    if (!title.trim()) {
      toast.error('Please enter a title');
      return;
    }

    try {
      if (noteId) {
        await editNoteMutation.mutateAsync({ noteId, title, content });
        toast.success('Note updated successfully');
      } else {
        await createNoteMutation.mutateAsync({ title, content });
        toast.success('Note created with AI insights');
      }
      onClose();
    } catch (error) {
      toast.error(noteId ? 'Failed to update note' : 'Failed to create note');
    }
  };

  const isSaving = createNoteMutation.isPending || editNoteMutation.isPending;

  if (isLoading && noteId) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Alert className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border-purple-200 dark:border-purple-800">
        <Sparkles className="h-4 w-4 text-purple-600 dark:text-purple-400" />
        <AlertDescription className="text-purple-800 dark:text-purple-200">
          AI will automatically analyze your note and provide intelligent insights
        </AlertDescription>
      </Alert>

      <div>
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter note title..."
          className="mt-1"
        />
      </div>

      <div>
        <Label htmlFor="content">Content</Label>
        <Textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write your note here...&#10;&#10;The AI will automatically:&#10;- Classify the domain (medical, legal, or general)&#10;- Extract key points&#10;- Generate summaries"
          rows={14}
          className="mt-1 resize-none"
        />
      </div>

      <div className="flex items-center justify-end gap-2 pt-4">
        <Button variant="outline" onClick={onClose} disabled={isSaving}>
          <X className="w-4 h-4 mr-2" />
          Cancel
        </Button>
        <Button
          onClick={handleSave}
          disabled={isSaving}
          className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white"
        >
          <Save className="w-4 h-4 mr-2" />
          {isSaving ? 'Saving...' : 'Save Note'}
        </Button>
      </div>
    </div>
  );
}
