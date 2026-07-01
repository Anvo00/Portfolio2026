/**
 * The 7 projects, in order. The hero's prev/next arrows cycle through this list.
 * Each project page is generated from this data (see src/pages/progetti/[slug].astro).
 *
 * Fields per project:
 *   slug          — URL segment: /progetti/<slug>
 *   name          — displayed project name
 *   year          — "2025" | "2026"
 *   folderImage   — path to the clickable folder PNG on the homepage
 *   url           — href for that folder (usually "/progetti/<slug>")
 *   heroImage     — full-frame cover image on the project page (optional)
 *   brief         — array of paragraph strings for the Brief section
 *   researchCaption — caption under the research cards
 *   research      — number of research cards
 *   concept       — array of two column strings for the Concept section
 *   processCaption  — caption under the process gallery
 *   process       — number of process gallery items
 *   outputCaption   — caption above the output bento grid
 *   output        — number of output bento modules
 *   conclusion    — array of two column strings for the Conclusion section
 */
export const projects = [
  {
    slug: "icebreaker",
    name: "Icebreaker",
    year: "2025",
    folderImage: "/images/projects/icebreaker/folder.png",
    url: "/progetti/icebreaker",
    heroImage: "/images/projects/icebreaker/cover.jpg",
    brief: [
      "Descrizione del progetto, obiettivi e vincoli ricevuti dal brief accademico. Spiega il contesto, il cliente immaginario e il problema da risolvere.",
      "Secondo paragrafo del brief: approfondisci il target di riferimento, i materiali consegnati e i requisiti formali del progetto.",
    ],
    researchCaption:
      "Le immagini di ricerca raccolte durante la fase di analisi visiva: mood, riferimenti storici e benchmark di settore.",
    research: 5,
    concept: [
      "Prima colonna del concept: racconta l'idea generativa, la metafora o il sistema visivo scelto e come si collega al brief.",
      "Seconda colonna del concept: descrivi le scelte tipografiche, cromatiche e formali che derivano dall'idea centrale.",
    ],
    processCaption:
      "Scatti di lavorazione, prove di stampa e iterazioni intermediate che documentano il percorso creativo.",
    process: 5,
    outputCaption:
      "Gli artefatti finali del progetto: tavole, mockup e declinazioni del sistema visivo.",
    output: 5,
    conclusion: [
      "Prima colonna delle conclusioni: cosa ha funzionato, quali scelte si sono rivelate efficaci e perché.",
      "Seconda colonna delle conclusioni: cosa miglioreresti in una prossima iterazione e cosa hai imparato da questo progetto.",
    ],
  },

  // ── Copy the block above and fill in the fields for each new project ──

  {
    slug: "monogramma-e-pattern",
    name: "Monogramma e pattern",
    year: "2025",
    folderImage: "/images/projects/monogramma-e-pattern/folder.png",
    url: "/progetti/monogramma-e-pattern",
    heroImage: "",
    brief: [],
    researchCaption: "",
    research: 5,
    concept: [],
    processCaption: "",
    process: 5,
    outputCaption: "",
    output: 5,
    conclusion: [],
  },
  {
    slug: "materia-prima",
    name: "Materia prima",
    year: "2025",
    folderImage: "/images/projects/materia-prima/folder.png",
    url: "/progetti/materia-prima",
    heroImage: "",
    brief: [],
    researchCaption: "",
    research: 5,
    concept: [],
    processCaption: "",
    process: 5,
    outputCaption: "",
    output: 5,
    conclusion: [],
  },
  {
    slug: "maschera-di-steinberg",
    name: "Maschera di Steinberg",
    year: "2025",
    folderImage: "/images/projects/maschera-di-steinberg/folder.png",
    url: "/progetti/maschera-di-steinberg",
    heroImage: "",
    brief: [],
    researchCaption: "",
    research: 5,
    concept: [],
    processCaption: "",
    process: 5,
    outputCaption: "",
    output: 5,
    conclusion: [],
  },
  {
    slug: "recreos",
    name: "Recreos",
    year: "2026",
    folderImage: "/images/projects/recreos/folder.png",
    url: "/progetti/recreos",
    heroImage: "",
    brief: [],
    researchCaption: "",
    research: 5,
    concept: [],
    processCaption: "",
    process: 5,
    outputCaption: "",
    output: 5,
    conclusion: [],
  },
  {
    slug: "booklet-recreos",
    name: "Booklet recreos",
    year: "2026",
    folderImage: "/images/projects/booklet-recreos/folder.png",
    url: "/progetti/booklet-recreos",
    heroImage: "",
    brief: [],
    researchCaption: "",
    research: 5,
    concept: [],
    processCaption: "",
    process: 5,
    outputCaption: "",
    output: 5,
    conclusion: [],
  },
  {
    slug: "palazzo-strozzi",
    name: "Palazzo Strozzi",
    year: "2026",
    folderImage: "/images/projects/palazzo-strozzi/folder.png",
    url: "/progetti/palazzo-strozzi",
    heroImage: "",
    brief: [],
    researchCaption: "",
    research: 5,
    concept: [],
    processCaption: "",
    process: 5,
    outputCaption: "",
    output: 5,
    conclusion: [],
  },
];
