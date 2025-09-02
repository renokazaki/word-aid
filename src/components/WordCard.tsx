import { useState } from "react";
import { Edit, Trash2, Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Word } from "@/types/word";

interface WordCardProps {
  word: Word;
  onEdit: (word: Word) => void;
  onDelete: (id: string) => void;
}

export function WordCard({ word, onEdit, onDelete }: WordCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);

  const handlePlayPronunciation = () => {
    if (word.pronunciation) {
      const utterance = new SpeechSynthesisUtterance(word.english);
      utterance.lang = 'en-US';
      speechSynthesis.speak(utterance);
    }
  };

  return (
    <Card 
      className="relative group hover:shadow-hover transition-all duration-300 bg-gradient-secondary border-0 shadow-card animate-fade-in cursor-pointer overflow-hidden"
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <div className="absolute inset-0 bg-gradient-primary opacity-0 group-hover:opacity-5 transition-opacity duration-300" />
      
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {word.pronunciation && (
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  handlePlayPronunciation();
                }}
                className="h-8 w-8 p-0 hover:bg-primary/10"
              >
                <Volume2 className="h-4 w-4 text-primary" />
              </Button>
            )}
          </div>
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onEdit(word);
              }}
              className="h-8 w-8 p-0 hover:bg-primary/10"
            >
              <Edit className="h-4 w-4 text-primary" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(word.id);
              }}
              className="h-8 w-8 p-0 hover:bg-destructive/10"
            >
              <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        <div className="min-h-[100px] flex flex-col justify-center">
          {!isFlipped ? (
            <div className="text-center space-y-2">
              <h3 className="text-2xl font-semibold text-foreground">
                {word.english}
              </h3>
              {word.pronunciation && (
                <p className="text-sm text-muted-foreground font-mono">
                  [{word.pronunciation}]
                </p>
              )}
            </div>
          ) : (
            <div className="text-center space-y-3">
              <h3 className="text-2xl font-medium text-primary">
                {word.japanese}
              </h3>
              {word.example && (
                <p className="text-sm text-muted-foreground italic bg-accent/30 rounded-lg p-3 leading-relaxed">
                  "{word.example}"
                </p>
              )}
            </div>
          )}
        </div>
        
        <div className="text-center">
          <p className="text-xs text-muted-foreground">
            {isFlipped ? 'タップで英語を表示' : 'Tap to show Japanese'}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}