import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Word, WordFormData } from "@/types/word";
import { useToast } from "@/hooks/use-toast";

interface EditWordDialogProps {
  word: Word | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdateWord: (id: string, data: WordFormData) => void;
}

export function EditWordDialog({ word, open, onOpenChange, onUpdateWord }: EditWordDialogProps) {
  const [formData, setFormData] = useState<WordFormData>({
    english: "",
    japanese: "",
    pronunciation: "",
    example: "",
  });
  const { toast } = useToast();

  useEffect(() => {
    if (word) {
      setFormData({
        english: word.english,
        japanese: word.japanese,
        pronunciation: word.pronunciation || "",
        example: word.example || "",
      });
    }
  }, [word]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.english.trim() || !formData.japanese.trim()) {
      toast({
        title: "エラー",
        description: "英語と日本語は必須項目です",
        variant: "destructive",
      });
      return;
    }

    if (word) {
      onUpdateWord(word.id, formData);
      onOpenChange(false);
      
      toast({
        title: "単語を更新しました",
        description: `"${formData.english}" を更新しました`,
      });
    }
  };

  const handleInputChange = (field: keyof WordFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-card border-0 shadow-hover">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold bg-gradient-primary bg-clip-text text-transparent">
            単語を編集
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="edit-english">英語 *</Label>
            <Input
              id="edit-english"
              placeholder="例: beautiful"
              value={formData.english}
              onChange={(e) => handleInputChange("english", e.target.value)}
              className="border-border focus:ring-primary"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="edit-japanese">日本語 *</Label>
            <Input
              id="edit-japanese"
              placeholder="例: 美しい"
              value={formData.japanese}
              onChange={(e) => handleInputChange("japanese", e.target.value)}
              className="border-border focus:ring-primary"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="edit-pronunciation">発音記号 (オプション)</Label>
            <Input
              id="edit-pronunciation"
              placeholder="例: /ˈbjuːtɪfəl/"
              value={formData.pronunciation}
              onChange={(e) => handleInputChange("pronunciation", e.target.value)}
              className="border-border focus:ring-primary"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="edit-example">例文 (オプション)</Label>
            <Textarea
              id="edit-example"
              placeholder="例: The sunset was beautiful tonight."
              value={formData.example}
              onChange={(e) => handleInputChange("example", e.target.value)}
              className="border-border focus:ring-primary resize-none"
              rows={3}
            />
          </div>
          
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1"
            >
              キャンセル
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-gradient-primary hover:opacity-90"
            >
              更新
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}