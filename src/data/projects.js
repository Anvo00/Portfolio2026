/**
 * The 7 projects, in order. The hero's prev/next arrows cycle through this
 * list. Each project page is generated from this data (see
 * src/pages/progetti/[slug].astro).
 *
 * `research` / `process` / `output` are the number of media placeholders in
 * those sections — variable per project, set here (defaults for now).
 */
export const projects = [
  { slug: "icebreaker", name: "Icebreaker", research: 5, process: 5, output: 5 },
  { slug: "monogramma-e-pattern", name: "Monogramma e pattern", research: 5, process: 5, output: 5 },
  { slug: "materia-prima", name: "Materia prima", research: 5, process: 5, output: 5 },
  { slug: "maschera-di-steinberg", name: "Maschera di Steinberg", research: 5, process: 5, output: 5 },
  { slug: "recreos", name: "Recreos", research: 5, process: 5, output: 5 },
  { slug: "booklet-recreos", name: "Booklet recreos", research: 5, process: 5, output: 5 },
  { slug: "palazzo-strozzi", name: "Palazzo Strozzi", research: 5, process: 5, output: 5 },
];
