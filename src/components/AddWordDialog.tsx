import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { WordFormData } from "@/types/word";
import { useToast } from "@/hooks/use-toast";

interface AddWordDialogProps {
  onAddWord: (word: WordFormData) => void;
}

export function AddWordDialog({ onAddWord }: AddWordDialogProps) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState<WordFormData>({
    english: "",
    japanese: "",
    pronunciation: "",
    example: "",
  });
  const { toast } = useToast();

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

    onAddWord(formData);
    setFormData({ english: "", japanese: "", pronunciation: "", example: "" });
    setOpen(false);
    
    toast({
      title: "単語を追加しました",
      description: `"${formData.english}" を単語帳に追加しました`,
    });
  };

  const handleInputChange = (field: keyof WordFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          className="bg-gradient-primary hover:opacity-90 transition-opacity shadow-hover border-0"
          size="lg"
        >
          <Plus className="mr-2 h-5 w-5" />
          新しい単語を追加
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md bg-card border-0 shadow-hover">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold bg-gradient-primary bg-clip-text text-transparent">
            新しい単語を追加
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="english">英語 *</Label>
            <Input
              id="english"
              placeholder="例: beautiful"
              value={formData.english}
              onChange={(e) => handleInputChange("english", e.target.value)}
              className="border-border focus:ring-primary"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="japanese">日本語 *</Label>
            <Input
              id="japanese"
              placeholder="例: 美しい"
              value={formData.japanese}
              onChange={(e) => handleInputChange("japanese", e.target.value)}
              className="border-border focus:ring-primary"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="pronunciation">発音記号 (オプション)</Label>
            <Input
              id="pronunciation"
              placeholder="例: /ˈbjuːtɪfəl/"
              value={formData.pronunciation}
              onChange={(e) => handleInputChange("pronunciation", e.target.value)}
              className="border-border focus:ring-primary"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="example">例文 (オプション)</Label>
            <Textarea
              id="example"
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
              onClick={() => setOpen(false)}
              className="flex-1"
            >
              キャンセル
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-gradient-primary hover:opacity-90"
            >
              追加
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}