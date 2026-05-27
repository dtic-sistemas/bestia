'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';

export default function UploadPage() {
  // Upload mascota form component
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [species, setSpecies] = useState<'gato' | 'perro' | 'otro'>('gato');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Por favor selecciona una imagen');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('La imagen debe ser menor a 5MB');
      return;
    }

    setError(null);
    const reader = new FileReader();
    reader.onload = (event) => {
      setPreview(event.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (!preview || !name.trim() || !species) {
      setError('Por favor completa todos los campos');
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('species', species);

      const file = fileInputRef.current?.files?.[0];
      if (file) {
        formData.append('photo', file);
      }

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Error al subir mascota');
      }

      setSuccess(true);
      setPreview(null);
      setName('');
      setSpecies('gato');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-8">
        <h1 className="text-3xl font-bold text-center text-gray-900 mb-8">
          Sube tu Mascota
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Photo Preview */}
          {preview && (
            <div className="relative w-full h-64 bg-gray-100 rounded-lg overflow-hidden">
              <Image
                src={preview}
                alt="Preview"
                fill
                className="object-cover"
              />
            </div>
          )}

          {/* Photo Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Foto de tu mascota
            </label>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-md file:border-0
                file:text-sm file:font-semibold
                file:bg-indigo-50 file:text-indigo-700
                hover:file:bg-indigo-100"
            />
          </div>

          {/* Name Input */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              Nombre
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ej: Michi"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>

          {/* Species Select */}
          <div>
            <label htmlFor="species" className="block text-sm font-medium text-gray-700 mb-2">
              Especie
            </label>
            <select
              id="species"
              value={species}
              onChange={(e) => setSpecies(e.target.value as 'gato' | 'perro' | 'otro')}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option value="gato">Gato 🐱</option>
              <option value="perro">Perro 🐕</option>
              <option value="otro">Otro 🦎</option>
            </select>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-green-700 text-sm">¡Mascota subida exitosamente! 🎉</p>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading || !preview}
            className="w-full py-2 px-4 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? 'Subiendo...' : 'Subir Mascota'}
          </button>
        </form>
      </div>
    </div>
  );
}
