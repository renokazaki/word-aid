import { useState, useEffect } from "react";
import { Search, BookOpen, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Word, WordFormData } from "@/types/word";
import { WordCard } from "@/components/WordCard";
import { AddWordDialog } from "@/components/AddWordDialog";
import { EditWordDialog } from "@/components/EditWordDialog";
import { useToast } from "@/hooks/use-toast";

const STORAGE_KEY = "wordaid-words";

// Sample words for demonstration
const sampleWords: Word[] = [
  {
    id: "1",
    english: "beautiful",
    japanese: "美しい",
    pronunciation: "/ˈbjuːtɪfəl/",
    example: "The sunset was beautiful tonight.",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "2", 
    english: "challenge",
    japanese: "挑戦",
    pronunciation: "/ˈtʃæləndʒ/",
    example: "Learning English is a rewarding challenge.",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

const Index = () => {
  const [words, setWords] = useState<Word[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingWord, setEditingWord] = useState<Word | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const { toast } = useToast();

  // Load words from localStorage on mount
  useEffect(() => {
    const savedWords = localStorage.getItem(STORAGE_KEY);
    if (savedWords) {
      const parsed = JSON.parse(savedWords);
      setWords(parsed.map((word: any) => ({
        ...word,
        createdAt: new Date(word.createdAt),
        updatedAt: new Date(word.updatedAt),
      })));
    } else {
      // If no saved words, use sample words
      setWords(sampleWords);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(sampleWords));
    }
  }, []);

  // Save words to localStorage whenever words change
  useEffect(() => {
    if (words.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(words));
    }
  }, [words]);

  const addWord = (formData: WordFormData) => {
    const newWord: Word = {
      id: Date.now().toString(),
      ...formData,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setWords(prev => [newWord, ...prev]);
  };

  const updateWord = (id: string, formData: WordFormData) => {
    setWords(prev =>
      prev.map(word =>
        word.id === id
          ? { ...word, ...formData, updatedAt: new Date() }
          : word
      )
    );
  };

  const deleteWord = (id: string) => {
    const word = words.find(w => w.id === id);
    setWords(prev => prev.filter(word => word.id !== id));
    
    if (word) {
      toast({
        title: "単語を削除しました",
        description: `"${word.english}" を削除しました`,
      });
    }
  };

  const clearAllWords = () => {
    setWords([]);
    localStorage.removeItem(STORAGE_KEY);
    toast({
      title: "すべての単語を削除しました",
      description: "単語帳をリセットしました",
    });
  };

  const handleEditWord = (word: Word) => {
    setEditingWord(word);
    setIsEditDialogOpen(true);
  };

  const filteredWords = words.filter(word =>
    word.english.toLowerCase().includes(searchTerm.toLowerCase()) ||
    word.japanese.includes(searchTerm) ||
    (word.pronunciation && word.pronunciation.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-accent/20">
      <main className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <header className="text-center mb-12 animate-fade-in">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-primary rounded-full mb-6 shadow-hover">
            <BookOpen className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-3">
            WordAid
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            英語学習のための美しい単語帳アプリ。新しい単語を追加して、効率的に記憶しましょう。
          </p>
        </header>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8 animate-slide-up">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="単語を検索..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 border-border focus:ring-primary bg-card/50 backdrop-blur-sm"
            />
          </div>
          <div className="flex gap-2">
            <AddWordDialog onAddWord={addWord} />
            {words.length > 0 && (
              <Button
                variant="outline"
                onClick={clearAllWords}
                className="hover:bg-destructive/10 hover:text-destructive hover:border-destructive/20"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                すべて削除
              </Button>
            )}
          </div>
        </div>

        {/* Stats */}
        {words.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <div className="bg-gradient-secondary rounded-lg p-6 shadow-card animate-scale-in">
              <div className="text-2xl font-bold text-primary">{words.length}</div>
              <div className="text-sm text-muted-foreground">総単語数</div>
            </div>
            <div className="bg-gradient-secondary rounded-lg p-6 shadow-card animate-scale-in">
              <div className="text-2xl font-bold text-primary">{filteredWords.length}</div>
              <div className="text-sm text-muted-foreground">検索結果</div>
            </div>
            <div className="bg-gradient-secondary rounded-lg p-6 shadow-card animate-scale-in">
              <div className="text-2xl font-bold text-primary">
                {Math.round((words.filter(w => w.pronunciation).length / words.length) * 100)}%
              </div>
              <div className="text-sm text-muted-foreground">発音記号付き</div>
            </div>
          </div>
        )}

        {/* Word Grid */}
        {filteredWords.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredWords.map((word, index) => (
              <div
                key={word.id}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <WordCard
                  word={word}
                  onEdit={handleEditWord}
                  onDelete={deleteWord}
                />
              </div>
            ))}
          </div>
        ) : words.length > 0 ? (
          <div className="text-center py-16 animate-fade-in">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold mb-2">検索結果が見つかりません</h3>
            <p className="text-muted-foreground">
              別のキーワードで検索してみてください
            </p>
          </div>
        ) : (
          <div className="text-center py-16 animate-fade-in">
            <div className="text-6xl mb-4">📚</div>
            <h3 className="text-xl font-semibold mb-2">単語帳が空です</h3>
            <p className="text-muted-foreground mb-6">
              最初の単語を追加して学習を始めましょう！
            </p>
            <AddWordDialog onAddWord={addWord} />
          </div>
        )}

        {/* Edit Dialog */}
        <EditWordDialog
          word={editingWord}
          open={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
          onUpdateWord={updateWord}
        />
      </main>
    </div>
  );
};

export default Index;