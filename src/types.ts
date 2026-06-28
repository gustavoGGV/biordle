/**
 * Represents the biological taxonomy of a species.
 */
export type Taxon = {
  /** Biological kingdom (e.g. Animalia, Plantae). */
  kingdom: string;

  /** Biological phylum (e.g. Chordata). */
  phylum: string;

  /** Biological class (e.g. Mammalia). May be unavailable. */
  class: string | undefined;

  /** Biological order (e.g. Carnivora). */
  order: string;

  /** Biological family (e.g. Felidae). */
  family: string;

  /** Biological genus (e.g. Panthera). */
  genus: string;
}

/**
 * Represents a player's guess in the game.
 */
export type Guess = {
  /** Species common name entered or displayed to the player. */
  name: string;

  /** Scientific (binomial) name of the guessed species. */
  scientificName: string;

  /** Taxonomic classification of the species. */
  taxon: Taxon;

  /** Optional URL of an image representing the species. */
  image?: string;
}

/**
 * Simplified species information used internally by the application.
 */
export type FormattedSpecies = {
  /** Scientific (binomial) name of the species. */
  scientificName: string;

  /** Common (vernacular) name, if available. */
  vernacularName?: string;

  /** Taxonomic classification of the species. */
  taxon: Taxon;

  /** Optional URL of an image representing the species. */
  image?: string;

  /** IUCN Red List conservation status code (e.g. LC, EN, CR). */
  iucnConservationStatusCode?: string;
}

/**
 * Complete species record returned by the GBIF Species API,
 * enriched with IUCN conservation and media information.
 */
export type ApiSpeciesData = {
  /** Unique GBIF taxon identifier. */
  key: number;

  /** GBIF Nub taxonomy identifier. */
  nubKey: number;

  /** Identifier of the scientific name. */
  nameKey: number;

  /** Taxon identifier in GBIF format (e.g. "gbif:2490718"). */
  taxonID: string;

  /** Original source taxonomy identifier, if available. */
  sourceTaxonKey?: number;

  /** Biological kingdom. */
  kingdom: string;

  /** Biological phylum. */
  phylum: string;

  /** Biological class. */
  class?: string;

  /** Biological order. */
  order: string;

  /** Biological family. */
  family: string;

  /** Biological genus. */
  genus: string;

  /** Species epithet. */
  species: string;

  kingdomKey: number;
  phylumKey: number;
  classKey?: number;
  orderKey: number;
  familyKey: number;
  genusKey: number;
  speciesKey: number;

  /** Dataset containing the taxon. */
  datasetKey: string;

  /** Constituent dataset identifier. */
  constituentKey: string;

  /** Parent taxon identifier. */
  parentKey: number;

  /** Parent taxon scientific name. */
  parent: string;

  /** Basionym identifier, if available. */
  basionymKey?: number;

  /** Original scientific name (basionym), if available. */
  basionym?: string;

  /** Complete scientific name including authorship. */
  scientificName: string;

  /** Canonical scientific name without authorship. */
  canonicalName: string;

  /** Common (vernacular) name, if available. */
  vernacularName?: string;

  /** Scientific name authorship. */
  authorship: string;

  /** Type of scientific name. */
  nameType: string;

  /** Taxonomic rank (e.g. SPECIES, GENUS). */
  rank: string;

  /** Origin of the taxon record. */
  origin: string;

  /** Taxonomic status (e.g. ACCEPTED, SYNONYM). */
  taxonomicStatus: string;

  /** Nomenclatural status values. */
  nomenclaturalStatus: string[];

  /** Additional remarks provided by GBIF. */
  remarks: string;

  /** Original publication where the name was described. */
  publishedIn?: string;

  /** Number of descendant taxa. */
  numDescendants: number;

  /** Timestamp of the last GBIF crawl. */
  lastCrawled: string;

  /** Timestamp of the last interpretation performed by GBIF. */
  lastInterpreted: string;

  /** Issues detected by GBIF during interpretation. */
  issues: string[];

  /** IUCN conservation information, if available. */
  iucn_data: ApiSpeciesIucnData | null;

  /** Associated media information, if available. */
  media_data: ApiSpeciesMediaData | null;
}

/**
 * IUCN Red List information associated with a species.
 */
type ApiSpeciesIucnData = {
  /** IUCN conservation category (e.g. Least Concern). */
  category: string;

  /** Internal GBIF usage key, if available. */
  usageKey?: number;

  /** Scientific name evaluated by the IUCN. */
  scientificName: string;

  /** Taxonomic status in the IUCN dataset. */
  taxonomicStatus: string;

  /** Official IUCN taxon identifier. */
  iucnTaxonID?: string;

  /** IUCN category code (e.g. LC, NT, VU, EN, CR). */
  code: string;
}

/**
 * Media records associated with a species.
 */
type ApiSpeciesMediaData = {
  /** GBIF taxon identifier. */
  taxonKey: string;

  /** Type of media (e.g. StillImage). */
  mediaType: string;

  /** Pagination offset. */
  offset: number;

  /** Pagination limit. */
  limit: number;

  /** Total number of media records. */
  count: number;

  /** Whether additional pages are available. */
  endOfRecords: boolean;

  /** List of media records. */
  results: {
    /** Direct URL to the media file. */
    identifier: string;

    /** GBIF occurrence identifier. */
    occurrenceKey: string;

    /** Rights holder, if provided. */
    rightsHolder?: string;

    /** License associated with the media, if provided. */
    license?: string;
  }[];
}