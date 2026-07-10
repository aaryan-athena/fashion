// The clothing layer — key garments that build each vibe, each shoppable
// via retailer search deep-links (see shop-links.ts).

export type ClothingItem = {
  item: string;
  query: string;
};

export const VIBE_CLOTHING: Record<string, ClothingItem[]> = {
  Streetwear: [
    { item: "Oversized graphic tee", query: "oversized graphic tshirt men streetwear" },
    { item: "Cargo pants", query: "cargo pants men baggy" },
    { item: "Zip-up hoodie", query: "oversized zip hoodie men" },
    { item: "Chunky sneakers", query: "chunky sneakers men white" },
    { item: "Baseball cap", query: "baseball cap men streetwear" },
  ],
  Minimal: [
    { item: "Plain heavyweight tee", query: "plain heavyweight tshirt men neutral" },
    { item: "Straight-fit trousers", query: "straight fit trousers men beige" },
    { item: "Minimal white sneakers", query: "minimal white sneakers men" },
    { item: "Unstructured overshirt", query: "overshirt men solid minimal" },
  ],
  "Old Money": [
    { item: "Linen shirt", query: "linen shirt men white full sleeve" },
    { item: "Pleated trousers", query: "pleated trousers men cream" },
    { item: "Suede loafers", query: "suede loafers men tan" },
    { item: "Knit polo", query: "knitted polo tshirt men" },
    { item: "Cable-knit sweater", query: "cable knit sweater men" },
  ],
  "Smart Casual": [
    { item: "Pique polo", query: "polo tshirt men solid premium" },
    { item: "Chino trousers", query: "chinos men slim fit" },
    { item: "Clean leather sneakers", query: "leather sneakers men white minimal" },
    { item: "Blazer (unstructured)", query: "casual blazer men unstructured" },
  ],
  Formal: [
    { item: "Slim-fit suit", query: "slim fit suit men 2 piece" },
    { item: "Dress shirt", query: "formal shirt men white cotton" },
    { item: "Oxford shoes", query: "oxford formal shoes men black leather" },
    { item: "Silk tie", query: "silk tie men formal" },
  ],
  Luxury: [
    { item: "Designer-cut shirt", query: "premium satin shirt men designer" },
    { item: "Tailored trousers", query: "tailored trousers men premium wool" },
    { item: "Leather loafers", query: "leather loafers men premium horsebit" },
    { item: "Overcoat", query: "wool overcoat men long premium" },
  ],
  Edgy: [
    { item: "Black slim jeans", query: "black slim jeans men ripped" },
    { item: "Leather biker jacket", query: "leather biker jacket men black" },
    { item: "Combat boots", query: "combat boots men black" },
    { item: "Black graphic tee", query: "black graphic tshirt men rock" },
  ],
  Casual: [
    { item: "Crew-neck tee", query: "crew neck tshirt men cotton solid" },
    { item: "Blue jeans", query: "jeans men regular fit blue" },
    { item: "Everyday sneakers", query: "casual sneakers men everyday" },
    { item: "Light overshirt", query: "casual overshirt men cotton" },
  ],
  Monochrome: [
    { item: "Tonal tee", query: "plain tshirt men black white grey" },
    { item: "Matching-tone trousers", query: "relaxed trousers men grey monochrome" },
    { item: "Tonal sneakers", query: "all black sneakers men" },
    { item: "Same-family outer layer", query: "monochrome jacket men grey" },
  ],
  Sporty: [
    { item: "Performance tee", query: "sports tshirt men dri fit" },
    { item: "Joggers", query: "joggers men slim training" },
    { item: "Running shoes", query: "running shoes men cushioned" },
    { item: "Track jacket", query: "track jacket men sports" },
  ],
  Rugged: [
    { item: "Flannel shirt", query: "flannel check shirt men" },
    { item: "Selvedge / raw denim", query: "raw denim jeans men dark" },
    { item: "Leather boots", query: "leather boots men brown rugged" },
    { item: "Field jacket", query: "field jacket men olive" },
  ],
  Vintage: [
    { item: "Retro graphic tee", query: "retro graphic tshirt men vintage wash" },
    { item: "Straight-leg washed jeans", query: "straight fit washed jeans men vintage" },
    { item: "Corduroy shirt", query: "corduroy shirt men" },
    { item: "Retro sneakers", query: "retro sneakers men suede" },
  ],
  Techwear: [
    { item: "Tactical cargo pants", query: "tactical cargo pants men black techwear" },
    { item: "Softshell jacket", query: "softshell jacket men black hooded" },
    { item: "Tech runner shoes", query: "techwear shoes men black" },
    { item: "Crossbody utility bag", query: "tactical crossbody bag men" },
  ],
  Grunge: [
    { item: "Oversized flannel", query: "oversized flannel shirt men grunge" },
    { item: "Ripped jeans", query: "ripped jeans men distressed" },
    { item: "Washed band tee", query: "band tshirt men washed oversized" },
    { item: "Worn-in boots", query: "suede boots men distressed" },
  ],
  Preppy: [
    { item: "Cotton polo", query: "polo tshirt men striped preppy" },
    { item: "Chinos", query: "chinos men khaki slim" },
    { item: "Penny loafers", query: "penny loafers men brown" },
    { item: "V-neck sweater", query: "v neck sweater men cotton" },
  ],
  Y2K: [
    { item: "Baggy jeans", query: "baggy jeans men y2k" },
    { item: "Graphic baby tee / mesh top", query: "y2k graphic tshirt men" },
    { item: "Puffer jacket", query: "puffer jacket men glossy" },
    { item: "Retro basketball sneakers", query: "retro basketball shoes men" },
  ],
  Goth: [
    { item: "All-black layered top", query: "black oversized tshirt men longline" },
    { item: "Black skinny/wide jeans", query: "black jeans men goth" },
    { item: "Platform boots", query: "black platform boots men" },
    { item: "Long black coat", query: "long black coat men" },
  ],
  "Business Casual": [
    { item: "Oxford shirt", query: "oxford shirt men light blue" },
    { item: "Dress trousers", query: "formal trousers men slim grey" },
    { item: "Derby shoes", query: "derby shoes men brown leather" },
    { item: "Merino sweater", query: "merino wool sweater men" },
  ],
  Partywear: [
    { item: "Satin / printed shirt", query: "satin party shirt men printed" },
    { item: "Black fitted trousers", query: "black slim trousers men party" },
    { item: "Chelsea boots", query: "chelsea boots men black suede" },
    { item: "Statement jacket", query: "party blazer men statement" },
  ],
  "Summer Linen": [
    { item: "Linen shirt", query: "linen shirt men half sleeve beige" },
    { item: "Linen trousers", query: "linen trousers men relaxed" },
    { item: "Espadrilles / loafers", query: "espadrilles men summer" },
    { item: "Straw / bucket hat", query: "straw hat men summer" },
  ],
  "Clean Fit": [
    { item: "Fitted plain tee", query: "fitted plain tshirt men premium cotton" },
    { item: "Tapered trousers", query: "tapered trousers men slim" },
    { item: "Spotless white sneakers", query: "white leather sneakers men clean" },
    { item: "Structured overshirt", query: "structured overshirt men solid" },
  ],
  Beachwear: [
    { item: "Open cuban-collar shirt", query: "cuban collar shirt men printed beach" },
    { item: "Linen / cotton shorts", query: "linen shorts men beach" },
    { item: "Slides / sandals", query: "slides men premium" },
    { item: "Lightweight open shirt", query: "open beach shirt men lightweight" },
  ],
};

export const getVibeClothing = (vibe: string): ClothingItem[] =>
  VIBE_CLOTHING[vibe] ?? [];
