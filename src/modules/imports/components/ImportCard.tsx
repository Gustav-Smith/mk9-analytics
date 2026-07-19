'use client';

import { useState } from 'react';
import { PreviewTable } from './PreviewTable';
import type { ImportPreview } from '../types/ImportPreview';

interface Props {
  /** Optional callback when upload succeeds */
  onSuccess?: () => void;
}

export default function ImportCard({ onSuccess }: Props = {}) {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<ImportPreview | null>(null);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.currentTarget.classList.add('dragover');
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.currentTarget.classList.remove('dragover');
  };

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.currentTarget.classList.remove('dragover');

    if (!e.dataTransfer || !e.dataTransfer.files || e.dataTransfer.files.length === 0) {
      return;
    }

    const file = e.dataTransfer.files[0];
    await handleFile(file);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    await handleFile(file);
    // Reset input to allow same file re-selection
    e.target.value = '';
  };

  const handleFile = async (file: File) => {
    // Validate file type
    const extension = file.name.split('.').pop()?.toLowerCase();
    if (!extension || !['csv', 'xlsx', 'xls'].includes(extension)) {
      setError('Tipo de arquivo não suportado. Por favor, envie um arquivo .csv, .xls ou .xlsx.');
      return;
    }

    setFile(file);
    setLoading(true);
    setError(null);
    setPreview(null);

    try {
      const base64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          const base64String = reader.result as string;
          const base64 = base64String.split(',')[1];
          resolve(base64);
        };
        reader.onerror = () => reject(new Error('Falha ao ler o arquivo'));
        reader.readAsDataURL(file);
      });

      const response = await fetch('/api/imports/upload', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fileName: file.name,
          fileContent: base64,
          fileType: file.type,
        }),
      });

      const data = await response.json() as ImportPreview | { success: false; error?: string };

      if (!response.ok || !data.success) {
        throw new Error('error' in data && data.error ? data.error : 'Não foi possível processar o arquivo.');
      }

      setPreview(data);
      setLoading(false);
      if (onSuccess) onSuccess();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Ocorreu um erro durante o upload');
      setLoading(false);
    }
  };

  const handleRemoveFile = () => {
    setFile(null);
    setPreview(null);
    setError(null);
  };

  if (preview) {
    return (
      <div className="space-y-6">
        <div className="min-w-0 rounded-md border border-[#deded9] p-4">
          <div className="mb-4 flex min-w-0 flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <h3 className="shrink-0 text-sm font-medium text-[#292928]">Arquivo processado</h3>
            <p className="min-w-0 truncate text-xs text-[#73736f]" title={file?.name || ''}>
              {file?.name || 'Nenhum arquivo selecionado'} — {preview.totalRows} linhas, {preview.validRows} válidas, {preview.invalidRows} inválidas, {preview.duplicateRows} duplicadas
              {preview.sheets.length > 0 ? ' — Abas: ' + preview.sheets.join(', ') : ''}
              {preview.warnings.length > 0 ? ' — Avisos: ' + preview.warnings.join(' ') : ''}
              {preview.errors.length > 0 ? ' — Erros: ' + preview.errors.map((item) => 'linha ' + item.row + ': ' + item.message).join(' ') : ''}
            </p>
            <button
              onClick={handleRemoveFile}
              className="shrink-0 text-xs text-[#62625e] hover:text-[#20201f]"
            >
              Remover
            </button>
          </div>
          <PreviewTable columns={preview.columns} data={preview.sample} />
        </div>

        <div className="cursor-pointer rounded-md border border-dashed border-[#cfcfca] p-6 text-center hover:border-[#999994]"
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <input
            type="file"
            accept=".csv,.xlsx,.xls"
            className="hidden"
            onChange={handleFileChange}
          />
          <div onClick={() => {
            const input = document.querySelector('input[type="file"]') as HTMLInputElement | null;
            if (input) {
              input.click();
            }
          }}>
            {loading ? (
              <div className="flex flex-col items-center space-y-4">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#d9d9d4] border-b-[#356694]"></div>
                <p className="text-sm text-gray-600">Processando arquivo...</p>
              </div>
            ) : error ? (
              <div className="flex flex-col items-center space-y-4">
                <svg className="h-8 w-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                <p className="text-sm text-red-600">{error}</p>
              </div>
            ) : (
              <div className="flex flex-col items-center space-y-4">
                <svg className="h-10 w-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16l4-4m0 0l4-4m-4 4h18" />
                </svg>
                <p className="text-sm text-gray-600">
                  Arraste e solte um arquivo CSV ou XLSX aqui<br />
                  <span className="text-xs text-gray-500">ou clique para selecionar</span>
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="cursor-pointer rounded-md border border-dashed border-[#cfcfca] p-8 text-center hover:border-[#999994]"
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <input
        type="file"
        accept=".csv,.xlsx,.xls"
        className="hidden"
        onChange={handleFileChange}
      />
      <div onClick={() => {
        const input = document.querySelector('input[type="file"]') as HTMLInputElement | null;
        if (input) {
          input.click();
        }
      }}>
        {loading ? (
          <div className="flex flex-col items-center space-y-4">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#d9d9d4] border-b-[#356694]"></div>
            <p className="text-sm text-gray-600">Enviando arquivo...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center space-y-4">
            <svg className="h-8 w-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            <p className="text-sm text-red-600">{error}</p>
          </div>
        ) : (
          <div className="flex flex-col items-center space-y-4">
            <svg className="h-10 w-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16l4-4m0 0l4-4m-4 4h18" />
            </svg>
            <p className="text-sm text-gray-600">
              Arraste e solte um arquivo CSV ou XLSX aqui<br />
              <span className="text-xs text-gray-500">ou clique para selecionar</span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
