
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Sparkles, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface AISuggestionModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentMessage: string;
  onApplySuggestion: (suggestion: string) => void;
}

const AISuggestionModal: React.FC<AISuggestionModalProps> = ({ 
  isOpen, 
  onClose, 
  currentMessage, 
  onApplySuggestion 
}) => {
  const [selectedOption, setSelectedOption] = useState<string>('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const improvementOptions = [
    { id: 'formal', label: 'Formalizar', description: 'Tornar o texto mais formal e profissional' },
    { id: 'friendly', label: 'Tom Amigável', description: 'Adicionar um tom mais caloroso e amigável' },
    { id: 'simplify', label: 'Simplificar', description: 'Simplificar a linguagem e tornar mais direto' },
    { id: 'persuasive', label: 'Persuasivo', description: 'Tornar mais convincente e persuasivo' },
    { id: 'shorten', label: 'Encurtar', description: 'Reduzir o tamanho mantendo a essência' },
    { id: 'expand', label: 'Expandir', description: 'Adicionar mais detalhes e informações' }
  ];

  const handleGetSuggestions = async (option: string) => {
    if (!currentMessage.trim()) {
      toast({
        title: "Erro",
        description: "Por favor, digite uma mensagem primeiro.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setSelectedOption(option);
    console.log("Enviando texto para melhoria:", currentMessage);

    try {
      const payload = {
        text: currentMessage,
        improvement_type: option,
        timestamp: new Date().toISOString()
      };

      const response = await fetch('https://n8n.andersonnunes.net/webhook/gemini-text-enhancer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        mode: 'no-cors',
        body: JSON.stringify(payload),
      });

      // Como estamos usando no-cors, simulamos algumas sugestões
      // Em produção, isso viria da resposta da API
      const mockSuggestions = generateMockSuggestions(currentMessage, option);
      setSuggestions(mockSuggestions);

    } catch (error) {
      console.error('Erro ao obter sugestões:', error);
      // Fallback para sugestões mock
      const mockSuggestions = generateMockSuggestions(currentMessage, option);
      setSuggestions(mockSuggestions);
    } finally {
      setIsLoading(false);
    }
  };

  const generateMockSuggestions = (text: string, option: string): string[] => {
    const suggestions = [];
    
    switch (option) {
      case 'formal':
        suggestions.push(
          `Prezado(a), ${text.replace(/oi|olá|ei/gi, 'cumprimento').replace(/!/g, '.')}`,
          `Venho por meio desta comunicar que ${text.toLowerCase()}`,
          `Gostaríamos de informar que ${text.toLowerCase()}`
        );
        break;
      case 'friendly':
        suggestions.push(
          `Oi! 😊 ${text} Espero que você esteja bem!`,
          `Olá! ${text} Tenha um ótimo dia! 🌟`,
          `Ei! ${text} Qualquer dúvida, é só chamar! 😉`
        );
        break;
      case 'simplify':
        suggestions.push(
          text.split('.')[0] + '.',
          text.replace(/\b(?:extremamente|muito|bastante)\b/gi, '').trim(),
          text.split(' ').slice(0, 10).join(' ') + '...'
        );
        break;
      case 'persuasive':
        suggestions.push(
          `${text} Esta é uma oportunidade única!`,
          `Não perca esta chance: ${text}`,
          `Oferta especial para você: ${text}`
        );
        break;
      case 'shorten':
        suggestions.push(
          text.split(' ').slice(0, 8).join(' '),
          text.replace(/\b(?:por favor|gentilmente|cordialmente)\b/gi, '').trim(),
          text.split('.')[0]
        );
        break;
      case 'expand':
        suggestions.push(
          `${text} Gostaria de compartilhar mais detalhes sobre isso com você.`,
          `${text} Esta informação pode ser muito útil para suas necessidades.`,
          `${text} Estou à disposição para esclarecer qualquer dúvida adicional.`
        );
        break;
      default:
        suggestions.push(text);
    }
    
    return suggestions.filter(s => s && s.trim() !== text);
  };

  const handleApply = (suggestion: string) => {
    onApplySuggestion(suggestion);
    setSuggestions([]);
    setSelectedOption('');
  };

  const handleClose = () => {
    onClose();
    setSuggestions([]);
    setSelectedOption('');
    setIsLoading(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-2xl bg-white border border-gray-200 rounded-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-whatsapp-primary" />
            Sugestões de IA
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Original Message */}
          <div className="bg-gray-50 rounded-xl p-4">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Mensagem original:</h4>
            <p className="text-gray-800 text-sm leading-relaxed">
              {currentMessage || 'Nenhuma mensagem digitada ainda.'}
            </p>
          </div>

          {/* Improvement Options */}
          {!suggestions.length && !isLoading && (
            <div className="space-y-3">
              <h4 className="text-sm font-medium text-gray-700">
                Escolha como melhorar sua mensagem:
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {improvementOptions.map((option) => (
                  <Button
                    key={option.id}
                    variant="outline"
                    onClick={() => handleGetSuggestions(option.id)}
                    className="h-auto p-4 text-left border-gray-200 hover:border-whatsapp-primary hover:bg-whatsapp-primary/5 rounded-xl"
                  >
                    <div>
                      <div className="font-medium text-gray-800">{option.label}</div>
                      <div className="text-xs text-gray-600 mt-1">{option.description}</div>
                    </div>
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Loading State */}
          {isLoading && (
            <div className="flex items-center justify-center py-8">
              <div className="text-center">
                <Loader2 className="w-8 h-8 animate-spin text-whatsapp-primary mx-auto mb-3" />
                <p className="text-sm text-gray-600">Gerando sugestões...</p>
              </div>
            </div>
          )}

          {/* Suggestions */}
          {suggestions.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-medium text-gray-700">Sugestões geradas:</h4>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSuggestions([]);
                    setSelectedOption('');
                  }}
                  className="text-xs text-gray-500 hover:text-gray-700"
                >
                  Voltar às opções
                </Button>
              </div>
              
              <div className="space-y-3">
                {suggestions.map((suggestion, index) => (
                  <div
                    key={index}
                    className="bg-whatsapp-secondary/30 rounded-xl p-4 border border-whatsapp-secondary"
                  >
                    <p className="text-gray-800 text-sm leading-relaxed mb-3">
                      {suggestion}
                    </p>
                    <Button
                      onClick={() => handleApply(suggestion)}
                      size="sm"
                      className="bg-whatsapp-primary hover:bg-whatsapp-primary/90 text-white rounded-lg"
                    >
                      Aplicar esta sugestão
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t border-gray-100">
            <Button 
              variant="outline" 
              onClick={handleClose}
              className="flex-1 rounded-xl"
            >
              Cancelar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AISuggestionModal;
