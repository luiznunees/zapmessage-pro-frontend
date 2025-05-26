
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Upload, X, Image } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface PhotoUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (photoUrl: string) => void;
  attachedPhoto: string | null;
  onRemovePhoto: () => void;
}

const PhotoUploadModal: React.FC<PhotoUploadModalProps> = ({ 
  isOpen, 
  onClose, 
  onUpload, 
  attachedPhoto, 
  onRemovePhoto 
}) => {
  const [uploadMethod, setUploadMethod] = useState<'file' | 'url'>('file');
  const [photoUrl, setPhotoUrl] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast({
        title: "Erro",
        description: "Por favor, selecione apenas arquivos de imagem.",
        variant: "destructive",
      });
      return;
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      toast({
        title: "Erro",
        description: "A imagem deve ter menos de 5MB.",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);

    try {
      // Para o MVP, vamos usar uma URL pública genérica
      // Em produção, isso seria um upload real para um serviço de storage
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        onUpload(result);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      toast({
        title: "Erro",
        description: "Falha ao fazer upload da imagem.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleUrlUpload = () => {
    if (!photoUrl.trim()) {
      toast({
        title: "Erro",
        description: "Por favor, insira uma URL válida.",
        variant: "destructive",
      });
      return;
    }

    try {
      new URL(photoUrl);
      onUpload(photoUrl);
      setPhotoUrl('');
    } catch {
      toast({
        title: "Erro",
        description: "Por favor, insira uma URL válida.",
        variant: "destructive",
      });
    }
  };

  const handleRemove = () => {
    onRemovePhoto();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-white border border-gray-200 rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold text-gray-800">
            Anexar Foto
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Current Photo Preview */}
          {attachedPhoto && (
            <div className="space-y-3">
              <Label className="text-sm font-medium text-gray-700">Foto atual:</Label>
              <div className="relative inline-block">
                <img 
                  src={attachedPhoto} 
                  alt="Foto anexada" 
                  className="w-32 h-32 object-cover rounded-lg border border-gray-200"
                />
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={handleRemove}
                  className="absolute -top-2 -right-2 w-6 h-6 rounded-full p-0"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}

          {/* Upload Method Selection */}
          <div className="space-y-4">
            <div className="flex gap-2">
              <Button
                variant={uploadMethod === 'file' ? 'default' : 'outline'}
                onClick={() => setUploadMethod('file')}
                className="flex-1"
              >
                <Upload className="w-4 h-4 mr-2" />
                Fazer Upload
              </Button>
              <Button
                variant={uploadMethod === 'url' ? 'default' : 'outline'}
                onClick={() => setUploadMethod('url')}
                className="flex-1"
              >
                <Image className="w-4 h-4 mr-2" />
                URL da Imagem
              </Button>
            </div>

            {/* File Upload */}
            {uploadMethod === 'file' && (
              <div className="space-y-3">
                <Label htmlFor="file-upload" className="text-sm font-medium text-gray-700">
                  Selecionar arquivo:
                </Label>
                <Input
                  id="file-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  disabled={isUploading}
                  className="rounded-xl border-gray-200"
                />
                {isUploading && (
                  <div className="flex items-center gap-2 text-sm text-whatsapp-primary">
                    <div className="w-4 h-4 border-2 border-whatsapp-primary border-t-transparent rounded-full animate-spin"></div>
                    Fazendo upload...
                  </div>
                )}
              </div>
            )}

            {/* URL Input */}
            {uploadMethod === 'url' && (
              <div className="space-y-3">
                <Label htmlFor="photo-url" className="text-sm font-medium text-gray-700">
                  URL da imagem:
                </Label>
                <div className="flex gap-2">
                  <Input
                    id="photo-url"
                    type="url"
                    value={photoUrl}
                    onChange={(e) => setPhotoUrl(e.target.value)}
                    placeholder="https://exemplo.com/imagem.jpg"
                    className="rounded-xl border-gray-200"
                  />
                  <Button 
                    onClick={handleUrlUpload}
                    className="bg-whatsapp-primary hover:bg-whatsapp-primary/90"
                  >
                    Adicionar
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t border-gray-100">
            <Button 
              variant="outline" 
              onClick={onClose}
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

export default PhotoUploadModal;
