'use client';

import React, { useState, useEffect } from 'react';
import axios, { AxiosStatic } from 'axios';

import type { Guess, ApiSpeciesData, FormattedSpecies, Taxon } from '@/types';

import { FaGithub } from 'react-icons/fa';
import { getRandomSpecies } from '@/services/species';

const MAX_ATTEMPTS = 6;

export default function Biordle() {
  const [FormattedSpecies, setFormattedSpecies] = useState<FormattedSpecies | null>(null);
  const [guesses, setGuesses] = useState<Guess[]>([]);
  const [currentGuess, setCurrentGuess] = useState('');
  const [gameStatus, setGameStatus] = useState<'playing' | 'won' | 'lost'>('playing');
  const [showRules, setShowRules] = useState(false);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);

  // Mock daily species for demo (in real app, fetch from backend or localStorage with date)
  useEffect(() => {
    const randomSpecies: ApiSpeciesData = getRandomSpecies();

    const formattedSpecies: FormattedSpecies = {
      scientificName: randomSpecies.species,
      vernacularName: randomSpecies.vernacularName,
      taxon: {
        kingdom: randomSpecies.kingdom,
        phylum: randomSpecies.phylum,
        class: randomSpecies?.class,
        order: randomSpecies.order,
        family: randomSpecies.family,
        genus: randomSpecies.genus
      },
      iucnConservationStatusCode: randomSpecies.iucn_data?.code,
      image: randomSpecies.media_data?.results[0].identifier
    }

    setFormattedSpecies(formattedSpecies);
    setLoading(false);

    // Load saved game from localStorage
    const savedGuesses = localStorage.getItem('biordle-guesses');
    if (savedGuesses) {
      setGuesses(JSON.parse(savedGuesses));
    }
  }, []);

  // Save guesses to localStorage
  useEffect(() => {
    if (guesses.length > 0) {
      localStorage.setItem('biordle-guesses', JSON.stringify(guesses));
    }
  }, [guesses]);

  const checkGuess = async (guessName: string) => {
    if (!FormattedSpecies) return;

    setLoading(true);

    try {
      // In real app, call GBIF Species API to validate and get taxonomy
      // Mock for now
      const mockGuessTaxon: Taxon = {
        kingdom: guessName.toLowerCase().includes('leo') || guessName.toLowerCase().includes('leão') ? "Animalia" : "Plantae",
        phylum: "Chordata",
        class: "Mammalia",
        order: "Carnivora",
        family: "Felidae",
        genus: guessName.toLowerCase().includes('leo') ? "Panthera" : "Felis"
      };

      const newGuess: Guess = {
        name: guessName,
        scientificName: guessName.includes(' ') ? guessName : "Unknown sp.",
        taxon: mockGuessTaxon,
        image: "https://picsum.photos/id/1015/200/200"
      };

      const updatedGuesses = [...guesses, newGuess];
      setGuesses(updatedGuesses);

      // Check if won
      if (newGuess.scientificName.toLowerCase() === FormattedSpecies.scientificName.toLowerCase() ||
        newGuess.name.toLowerCase() === FormattedSpecies.vernacularName?.toLowerCase()) {
        setGameStatus('won');
        setMessage('Parabéns! Você descobriu a espécie!');
      } else if (updatedGuesses.length >= MAX_ATTEMPTS) {
        setGameStatus('lost');
        setMessage(`A espécie era ${FormattedSpecies.vernacularName} (${FormattedSpecies.scientificName})`);
      }

    } catch (error) {
      setMessage('Erro ao validar palpite. Tente novamente.');
    } finally {
      setLoading(false);
      setCurrentGuess('');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentGuess.trim() && guesses.length < MAX_ATTEMPTS && gameStatus === 'playing') {
      checkGuess(currentGuess.trim());
    }
  };

  const getTileClass = (level: keyof Taxon, guessTaxon: Taxon) => {
    if (!FormattedSpecies) return 'tile';

    const correct = FormattedSpecies.taxon[level];
    const guessed = guessTaxon[level];

    if (guessed === correct) return 'tile correct';
    // Partial match logic could be added (e.g. same higher level)
    return 'tile incorrect';
  };

  const resetGame = () => {
    setGuesses([]);
    setCurrentGuess('');
    setGameStatus('playing');
    setMessage('');
    localStorage.removeItem('biordle-guesses');
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Carregando Biordle...</div>;
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white flex flex-col">
      {/* Header */}
      <header className="border-b border-zinc-800 py-4 px-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="text-3xl font-bold text-emerald-500">🌿 BIORDLE</div>
        </div>

        <div className="flex gap-4">
          <button
            onClick={() => setShowRules(true)}
            className="px-4 py-2 text-sm border border-zinc-700 hover:bg-zinc-900 rounded"
          >
            Regras
          </button>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center py-8 px-4 max-w-2xl mx-auto w-full">
        {/* Daily Image Hint */}
        {FormattedSpecies && (
          <div className="mb-8 text-center">
            <div className="text-sm text-zinc-400 mb-2">Dica Visual</div>
            <img
              src={FormattedSpecies.image}
              alt="Espécie do dia"
              className="w-64 h-64 object-cover rounded-xl mx-auto border border-zinc-700"
            />
            {FormattedSpecies.iucnConservationStatusCode && (
              <div className="mt-3 text-amber-400 text-sm">
                Status na Lista Vermelha da IUCN: {FormattedSpecies.iucnConservationStatusCode}
              </div>
            )}
          </div>
        )}

        {/* Game Board */}
        <div className="w-full mb-8">
          <div className="text-center text-sm text-zinc-400 mb-4">
            {guesses.length} / {MAX_ATTEMPTS} tentativas
          </div>

          {guesses.map((guess, index) => (
            <div key={index} className="mb-6">
              <div className="text-sm font-medium mb-2 text-zinc-400 flex justify-between">
                <span>Palpite {index + 1}: {guess.name}</span>
                <span className="text-xs">{guess.scientificName}</span>
              </div>

              <div className="grid grid-cols-6 gap-2">
                {(['kingdom', 'phylum', 'class', 'order', 'family', 'genus'] as const).map((level, i) => (
                  <div
                    key={i}
                    className={getTileClass(level, guess.taxon)}
                  >
                    {guess.taxon[level] ? guess.taxon[level].substring(0, 8) : ''}
                  </div>
                ))}
              </div>
            </div>
          ))}

          {/* Current input row placeholder */}
          {guesses.length < MAX_ATTEMPTS && gameStatus === 'playing' && (
            <div className="grid grid-cols-6 gap-2 opacity-40">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="tile h-16 border-dashed"></div>
              ))}
            </div>
          )}
        </div>

        {/* Input Form */}
        {gameStatus === 'playing' && (
          <form onSubmit={handleSubmit} className="w-full max-w-md">
            <div className="flex gap-3">
              <input
                type="text"
                value={currentGuess}
                onChange={(e) => setCurrentGuess(e.target.value)}
                placeholder="nome científico ou popular..."
                className="flex-1 bg-zinc-900 border border-zinc-700 rounded-xl px-6 py-4 text-lg focus:outline-none focus:border-emerald-500"
                disabled={loading}
              />
              <button
                type="submit"
                disabled={!currentGuess.trim() || loading}
                className="bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 px-8 rounded-xl font-medium"
              >
                Enviar
              </button>
            </div>
            <div className="text-center text-xs text-zinc-500 mt-3">
              Você pode usar nome comum ou científico
            </div>
          </form>
        )}

        {/* Game Over Message */}
        {message && (
          <div className="mt-8 p-6 bg-zinc-900 border border-zinc-700 rounded-2xl text-center">
            <div className="text-xl font-semibold mb-4">{message}</div>

            {gameStatus !== 'playing' && FormattedSpecies && (
              <div className="space-y-4">
                <div>
                  <img
                    src={FormattedSpecies.image}
                    alt={FormattedSpecies.scientificName}
                    className="w-48 h-48 object-cover rounded-lg mx-auto"
                  />
                </div>

                <div className="text-emerald-400 text-lg">
                  {FormattedSpecies.vernacularName} — <span className="italic">{FormattedSpecies.scientificName}</span>
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="py-6 text-center text-xs text-zinc-500 border-t border-zinc-800 flex justify-center gap-5">
        <div>
          Dados de <a href="https://www.gbif.org" target="_blank" className="hover:text-white">GBIF</a> • Inspirado em <a href="https://stewardle.com/" target="_blank" className="hover:text-white">Stewardle</a>
        </div>
        <div className="justify-self-end flex">
          <a href="https://github.com/gustavoGGV" target="_blank" className="hover:text-white flex gap-1"><FaGithub size={16} />gustavoGGV</a>
        </div>
      </footer>

      {/* Rules Modal */}
      {showRules && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4">
          <div className="bg-zinc-900 max-w-md w-full rounded-3xl p-8">
            <h2 className="text-2xl font-bold mb-6">Como jogar Biordle</h2>

            <div className="space-y-6 text-sm">
              <div>
                Adivinhe a <strong>espécie</strong> em até 6 tentativas.
              </div>

              <div>
                Cada palpite mostra como sua espécie se compara hierarquicamente:
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-emerald-600 rounded"></div>
                  <div>Nível taxonômico correto</div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-zinc-700 rounded"></div>
                  <div>Nível incorreto</div>
                </div>
              </div>

              <div className="text-zinc-400 text-xs">
                Use nomes populares ou científicos. Quanto mais próximo taxonomicamente, melhor o feedback.
              </div>
            </div>

            <button
              onClick={() => setShowRules(false)}
              className="mt-8 w-full py-4 bg-white text-black font-medium rounded-2xl"
            >
              Entendi!
            </button>
          </div>
        </div>
      )}
    </div>
  );
}