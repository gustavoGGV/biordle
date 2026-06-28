import speciesData from '@/assets/gbif_species_data.json' with { type: 'json' };
import { ApiSpeciesData } from '@/types';

/**
 * This function is needed to get a random species object from the speciesData array.
 * @returns ApiSpeciesData object
 */
export function getRandomSpecies() {
  const randomSpecies: ApiSpeciesData = speciesData[Math.floor(Math.random() * speciesData.length)];

  return randomSpecies;
}
