
import React, { useState } from 'react';
import { Upload, FileText, AlertCircle, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

const UploadListing = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState<any>(null);
  const [listName, setListName] = useState('');

  const { toast } = useToast();

  const handleFileUpload = (uploadedFile: File) => {
    setFile(uploadedFile);
    setUploadResult(null);
  };

  const handleUpload = async () => {
    if (!file) return;

    setIsUploading(true);
    
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('listName', listName || file.name);

      const response = await fetch('https://n8n.andersonnunes.net/webhook/uploadListagem', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();
      
      if (response.ok) {
        setUploadResult(result);
        toast({
          title: "✅ Upload concluído!",
          description: `${result.totalContacts} contatos processados com sucesso.`,
        });
      } else {
        throw new Error(result.message || 'Erro no upload');
      }
    } catch (error) {
      toast({
        title: "Erro no upload",
        description: "Falha ao processar o arquivo. Verifique o formato.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleSaveList = async () => {
    if (!uploadResult) return;

    try {
      const response = await fetch('https://n8n.andersonnunes.net/webhook/salvarListagem', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          listName: listName || file?.name,
          contacts: uploadResult.contacts,
          totalContacts: uploadResult.totalContacts
        }),
      });

      if (response.ok) {
        toast({
          title: "✅ Lista salva!",
          description: "A listagem foi salva e está disponível para uso.",
        });
        
        // Reset form
        setFile(null);
        setUploadResult(null);
        setListName('');
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Falha ao salvar a listagem.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Upload de Listagem</h1>
        <p className="text-gray-600">
          Faça upload de arquivos PDF ou planilhas com contatos
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upload de arquivo */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="w-5 h-5" />
              Enviar Arquivo
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="list-name">Nome da Lista (opcional)</Label>
              <Input
                id="list-name"
                value={listName}
                onChange={(e) => setListName(e.target.value)}
                placeholder="Ex: Condominios Centro"
              />
            </div>

            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              {file ? (
                <div className="space-y-3">
                  <FileText className="w-12 h-12 text-blue-600 mx-auto" />
                  <div>
                    <p className="font-medium text-gray-900">{file.name}</p>
                    <p className="text-sm text-gray-500">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => setFile(null)}
                    className="text-red-600 border-red-600 hover:bg-red-50"
                  >
                    Remover arquivo
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  <Upload className="w-12 h-12 text-gray-400 mx-auto" />
                  <div>
                    <p className="text-gray-600 mb-2">
                      Arraste um arquivo aqui ou clique para selecionar
                    </p>
                    <p className="text-sm text-gray-500">
                      Suporta PDF, CSV, XLSX
                    </p>
                  </div>
                  <input
                    type="file"
                    accept=".pdf,.csv,.xlsx,.xls"
                    onChange={(e) => {
                      const selectedFile = e.target.files?.[0];
                      if (selectedFile) handleFileUpload(selectedFile);
                    }}
                    className="hidden"
                    id="file-input"
                  />
                  <Button variant="outline" asChild>
                    <label htmlFor="file-input" className="cursor-pointer">
                      Escolher arquivo
                    </label>
                  </Button>
                </div>
              )}
            </div>

            {file && !uploadResult && (
              <Button
                onClick={handleUpload}
                disabled={isUploading}
                className="w-full bg-[#2e86de] hover:bg-[#2e86de]/90"
              >
                {isUploading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Processando...
                  </div>
                ) : (
                  'Processar Arquivo'
                )}
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Preview dos resultados */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Preview dos Contatos
            </CardTitle>
          </CardHeader>
          <CardContent>
            {uploadResult ? (
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-green-600">
                  <CheckCircle className="w-5 h-5" />
                  <span className="font-medium">Processamento concluído!</span>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2">Resumo:</h4>
                  <ul className="space-y-1 text-sm text-gray-600">
                    <li>• Nome: {listName || file?.name}</li>
                    <li>• Total de contatos: {uploadResult.totalContacts}</li>
                    <li>• Contatos válidos: {uploadResult.validContacts}</li>
                    <li>• Contatos inválidos: {uploadResult.invalidContacts}</li>
                  </ul>
                </div>

                {uploadResult.preview && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Primeiros contatos:</h4>
                    <div className="bg-white border rounded-lg overflow-hidden">
                      {uploadResult.preview.slice(0, 5).map((contact: any, index: number) => (
                        <div key={index} className="p-3 border-b last:border-b-0">
                          <p className="font-medium">{contact.name}</p>
                          <p className="text-sm text-gray-600">{contact.phone}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <Button
                  onClick={handleSaveList}
                  className="w-full bg-green-600 hover:bg-green-700"
                >
                  Salvar Listagem
                </Button>
              </div>
            ) : (
              <div className="text-center py-8">
                <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600">
                  Faça upload de um arquivo para ver o preview
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UploadListing;
