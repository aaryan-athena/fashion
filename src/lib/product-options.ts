// Concrete, shoppable product options for every accessory in the Vault.
// Three price tiers per piece, curated for the Indian market. Links are
// retailer search deep-links built from `query` (see shop-links.ts), so they
// never go stale and never depend on scraping.

export type ProductTier = "Budget" | "Mid" | "Premium";

export type ProductOption = {
  tier: ProductTier;
  brand: string;
  name: string;
  price: string; // approximate, INR
  query: string; // retailer search query
};

export const PRODUCT_OPTIONS: Record<string, ProductOption[]> = {
  "Cuban Chain": [
    { tier: "Budget", brand: "Fashion Frill", name: "Silver Cuban Link Chain", price: "₹399", query: "fashion frill cuban link chain men silver" },
    { tier: "Mid", brand: "Salty", name: "Anti-Tarnish Cuban Chain 8mm", price: "₹1,299", query: "salty cuban chain men stainless steel" },
    { tier: "Premium", brand: "ZAVYA", name: "925 Silver Cuban Chain", price: "₹6,500", query: "zavya 925 sterling silver cuban chain men" },
  ],
  "Sporty Watch": [
    { tier: "Budget", brand: "Fastrack", name: "Trendies Analog Sports", price: "₹1,495", query: "fastrack sports watch men analog" },
    { tier: "Mid", brand: "Casio", name: "G-Shock GA-2100 (CasiOak)", price: "₹8,995", query: "casio g-shock ga-2100 men" },
    { tier: "Premium", brand: "Casio", name: "G-Shock GA-B2100 Solar", price: "₹13,995", query: "casio g-shock ga-b2100 solar bluetooth" },
  ],
  "Bracelet": [
    { tier: "Budget", brand: "The Bro Code", name: "Stainless Curb Bracelet", price: "₹449", query: "the bro code bracelet men stainless steel" },
    { tier: "Mid", brand: "Salty", name: "Cuban Link Bracelet", price: "₹999", query: "salty cuban link bracelet men" },
    { tier: "Premium", brand: "Fossil", name: "Chevron Steel Bracelet", price: "₹4,995", query: "fossil bracelet men steel" },
  ],
  "Chunky Ring": [
    { tier: "Budget", brand: "OOMPH", name: "Bold Dome Ring Silver-Tone", price: "₹349", query: "oomph chunky ring men silver" },
    { tier: "Mid", brand: "Salty", name: "Brutalist Statement Ring", price: "₹899", query: "salty statement ring men stainless steel" },
    { tier: "Premium", brand: "GIVA", name: "925 Silver Bold Band", price: "₹3,299", query: "giva 925 silver bold ring men" },
  ],
  "Sleek Watch": [
    { tier: "Budget", brand: "Sonata", name: "Sleek Analog Black Dial", price: "₹1,099", query: "sonata sleek analog watch men slim" },
    { tier: "Mid", brand: "Skagen", name: "Signatur Slim Mesh 40mm", price: "₹9,995", query: "skagen signatur slim watch men" },
    { tier: "Premium", brand: "Daniel Wellington", name: "Classic Sheffield 40mm", price: "₹14,999", query: "daniel wellington classic sheffield men" },
  ],
  "Thin Chain": [
    { tier: "Budget", brand: "Fashion Frill", name: "Fine Snake Chain Silver", price: "₹299", query: "fashion frill thin silver chain men" },
    { tier: "Mid", brand: "Salty", name: "Anti-Tarnish Fine Chain 2mm", price: "₹799", query: "salty thin chain men 2mm" },
    { tier: "Premium", brand: "GIVA", name: "925 Silver Anchor Chain", price: "₹2,999", query: "giva 925 sterling silver chain men" },
  ],
  "Minimal Bracelet": [
    { tier: "Budget", brand: "OOMPH", name: "Slim Cuff Matte Black", price: "₹399", query: "oomph minimal cuff bracelet men black" },
    { tier: "Mid", brand: "Salty", name: "Minimal Snake Bracelet", price: "₹849", query: "salty minimal bracelet men steel" },
    { tier: "Premium", brand: "Daniel Wellington", name: "Elan Unity Bracelet", price: "₹6,499", query: "daniel wellington bracelet men silver" },
  ],
  "Dress Watch": [
    { tier: "Budget", brand: "Titan", name: "Karishma Slim Analog", price: "₹2,595", query: "titan karishma slim dress watch men" },
    { tier: "Mid", brand: "Seiko", name: "Classic Quartz SUR Series", price: "₹14,500", query: "seiko classic dress watch men leather" },
    { tier: "Premium", brand: "Tissot", name: "Everytime 40mm", price: "₹28,000", query: "tissot everytime men dress watch" },
  ],
  "Signet Ring": [
    { tier: "Budget", brand: "Yellow Chimes", name: "Classic Signet Gold-Tone", price: "₹399", query: "yellow chimes signet ring men gold" },
    { tier: "Mid", brand: "Salty", name: "Heritage Signet Ring", price: "₹949", query: "salty signet ring men gold" },
    { tier: "Premium", brand: "GIVA", name: "925 Silver Oval Signet", price: "₹3,499", query: "giva 925 silver signet ring men" },
  ],
  "Thin Bracelet": [
    { tier: "Budget", brand: "Fashion Frill", name: "Fine Link Bracelet Gold", price: "₹349", query: "fashion frill thin bracelet men gold" },
    { tier: "Mid", brand: "Salty", name: "Fine Rope Bracelet", price: "₹799", query: "salty thin gold bracelet men" },
    { tier: "Premium", brand: "GIVA", name: "925 Silver Slim Bracelet", price: "₹2,799", query: "giva 925 silver bracelet men slim" },
  ],
  "Minimal Watch": [
    { tier: "Budget", brand: "Sonata", name: "Essentials Minimal Dial", price: "₹999", query: "sonata minimal watch men white dial" },
    { tier: "Mid", brand: "Timex", name: "Fairfield 41mm", price: "₹7,495", query: "timex fairfield minimal watch men" },
    { tier: "Premium", brand: "Skagen", name: "Grenen Ultra Slim", price: "₹13,495", query: "skagen grenen ultra slim watch men" },
  ],
  "Subtle Ring": [
    { tier: "Budget", brand: "OOMPH", name: "Plain Band Silver-Tone", price: "₹299", query: "oomph plain band ring men silver" },
    { tier: "Mid", brand: "Salty", name: "Classic 4mm Band", price: "₹699", query: "salty band ring men steel 4mm" },
    { tier: "Premium", brand: "GIVA", name: "925 Silver Classic Band", price: "₹2,499", query: "giva 925 silver band ring men" },
  ],
  "Leather Bracelet": [
    { tier: "Budget", brand: "Roadster", name: "Braided Leather Wrap", price: "₹399", query: "roadster leather bracelet men braided" },
    { tier: "Mid", brand: "The Bro Code", name: "Multi-Strand Leather", price: "₹699", query: "the bro code leather bracelet men" },
    { tier: "Premium", brand: "Fossil", name: "Vintage Casual Leather", price: "₹3,495", query: "fossil leather bracelet men" },
  ],
  "Cufflinks": [
    { tier: "Budget", brand: "Tossido", name: "Classic Round Silver", price: "₹499", query: "tossido cufflinks men silver" },
    { tier: "Mid", brand: "Peora", name: "Rectangular Brushed Steel", price: "₹1,199", query: "peora cufflinks men steel rectangular" },
    { tier: "Premium", brand: "Titan", name: "Tanishq-Grade Formal Cufflinks", price: "₹4,999", query: "titan cufflinks men formal" },
  ],
  "Elegant Ring": [
    { tier: "Budget", brand: "Yellow Chimes", name: "Polished Comfort Band", price: "₹449", query: "yellow chimes elegant ring men" },
    { tier: "Mid", brand: "GIVA", name: "925 Silver Sleek Band", price: "₹2,299", query: "giva 925 silver ring men sleek" },
    { tier: "Premium", brand: "PALMONAS", name: "18k Gold-Plated Band", price: "₹4,999", query: "palmonas gold plated ring men" },
  ],
  "Luxury Watch": [
    { tier: "Budget", brand: "Fossil", name: "Grant Chronograph", price: "₹11,995", query: "fossil grant chronograph men" },
    { tier: "Mid", brand: "Emporio Armani", name: "Renato Two-Tone", price: "₹24,995", query: "emporio armani renato watch men" },
    { tier: "Premium", brand: "Tissot", name: "PRX Powermatic 80", price: "₹65,000", query: "tissot prx powermatic 80 men" },
  ],
  "Statement Ring": [
    { tier: "Budget", brand: "OOMPH", name: "Gothic Statement Ring", price: "₹399", query: "oomph statement ring men" },
    { tier: "Mid", brand: "Salty", name: "Serpent Statement Ring", price: "₹999", query: "salty statement ring men gold" },
    { tier: "Premium", brand: "GIVA", name: "925 Silver Statement Ring", price: "₹3,999", query: "giva 925 silver statement ring men" },
  ],
  "Thick Chain": [
    { tier: "Budget", brand: "Fashion Frill", name: "Heavy Curb Chain", price: "₹499", query: "fashion frill thick chain men heavy" },
    { tier: "Mid", brand: "Salty", name: "Chunky Cuban 12mm", price: "₹1,499", query: "salty chunky cuban chain men 12mm" },
    { tier: "Premium", brand: "ZAVYA", name: "925 Silver Heavy Chain", price: "₹9,999", query: "zavya 925 silver heavy chain men" },
  ],
  "Layered Ring": [
    { tier: "Budget", brand: "OOMPH", name: "Stackable Ring Set of 4", price: "₹499", query: "oomph ring set men stackable" },
    { tier: "Mid", brand: "Salty", name: "Stacked Silver Ring Trio", price: "₹1,199", query: "salty ring set men silver" },
    { tier: "Premium", brand: "GIVA", name: "925 Silver Stacking Rings", price: "₹4,499", query: "giva 925 silver rings men set" },
  ],
  "Black Bracelet": [
    { tier: "Budget", brand: "OOMPH", name: "Onyx Bead Bracelet", price: "₹349", query: "oomph black bead bracelet men onyx" },
    { tier: "Mid", brand: "The Bro Code", name: "Matte Black Link Bracelet", price: "₹649", query: "the bro code black bracelet men matte" },
    { tier: "Premium", brand: "Fossil", name: "Black Agate Beaded", price: "₹2,995", query: "fossil black beaded bracelet men" },
  ],
  "Simple Chain": [
    { tier: "Budget", brand: "Fashion Frill", name: "Everyday Box Chain", price: "₹299", query: "fashion frill box chain men silver" },
    { tier: "Mid", brand: "Salty", name: "Anti-Tarnish Box Chain 3mm", price: "₹899", query: "salty box chain men 3mm" },
    { tier: "Premium", brand: "GIVA", name: "925 Silver Box Chain", price: "₹3,299", query: "giva 925 silver box chain men" },
  ],
  "Casual Watch": [
    { tier: "Budget", brand: "Sonata", name: "Everyday Analog", price: "₹899", query: "sonata analog watch men casual" },
    { tier: "Mid", brand: "Timex", name: "Weekender 40mm", price: "₹5,495", query: "timex weekender watch men" },
    { tier: "Premium", brand: "Seiko", name: "Seiko 5 Sports Automatic", price: "₹19,500", query: "seiko 5 sports automatic men" },
  ],
  "Clean Chain": [
    { tier: "Budget", brand: "Fashion Frill", name: "Slim Cable Chain", price: "₹299", query: "fashion frill cable chain men silver" },
    { tier: "Mid", brand: "Salty", name: "Minimal Cable Chain 2mm", price: "₹799", query: "salty minimal chain men silver" },
    { tier: "Premium", brand: "GIVA", name: "925 Silver Cable Chain", price: "₹2,899", query: "giva 925 silver cable chain men" },
  ],
  "Minimal Ring": [
    { tier: "Budget", brand: "OOMPH", name: "Thin Band Matte", price: "₹299", query: "oomph thin band ring men" },
    { tier: "Mid", brand: "Salty", name: "Minimal 2mm Band", price: "₹599", query: "salty minimal ring men 2mm" },
    { tier: "Premium", brand: "GIVA", name: "925 Silver Slim Band", price: "₹1,999", query: "giva 925 silver minimal ring men" },
  ],
  "Smartwatch": [
    { tier: "Budget", brand: "Noise", name: "ColorFit Pro 5", price: "₹2,999", query: "noise colorfit pro 5 smartwatch" },
    { tier: "Mid", brand: "Samsung", name: "Galaxy Watch 7", price: "₹22,999", query: "samsung galaxy watch 7 men" },
    { tier: "Premium", brand: "Apple", name: "Watch Series 10 46mm", price: "₹46,900", query: "apple watch series 10 46mm" },
  ],
  "Sporty Bracelet": [
    { tier: "Budget", brand: "Boldfit", name: "Silicone Sport Band", price: "₹299", query: "boldfit silicone bracelet men sport" },
    { tier: "Mid", brand: "The Bro Code", name: "Paracord Sport Bracelet", price: "₹599", query: "the bro code paracord bracelet men" },
    { tier: "Premium", brand: "Whoop", name: "4.0 Knit Band", price: "₹7,500", query: "whoop 4.0 band" },
  ],
  "Field Watch": [
    { tier: "Budget", brand: "Timex", name: "Expedition Scout 40mm", price: "₹6,495", query: "timex expedition scout field watch men" },
    { tier: "Mid", brand: "Citizen", name: "Eco-Drive Field", price: "₹15,000", query: "citizen eco drive field watch men" },
    { tier: "Premium", brand: "Hamilton", name: "Khaki Field Mechanical 38mm", price: "₹48,000", query: "hamilton khaki field mechanical men" },
  ],
  "Textured Ring": [
    { tier: "Budget", brand: "OOMPH", name: "Hammered Band Ring", price: "₹349", query: "oomph hammered ring men textured" },
    { tier: "Mid", brand: "Salty", name: "Carved Texture Band", price: "₹899", query: "salty textured ring men" },
    { tier: "Premium", brand: "GIVA", name: "925 Silver Hammered Band", price: "₹3,199", query: "giva 925 silver textured ring men" },
  ],
  "Retro Watch": [
    { tier: "Budget", brand: "Casio", name: "Vintage A158 Digital", price: "₹2,295", query: "casio vintage a158 digital watch" },
    { tier: "Mid", brand: "Casio", name: "Vintage Gold A168WG", price: "₹4,495", query: "casio vintage gold a168 watch" },
    { tier: "Premium", brand: "Timex", name: "Marlin Hand-Wound 34mm", price: "₹18,995", query: "timex marlin hand wound men" },
  ],
  "Classic Ring": [
    { tier: "Budget", brand: "Yellow Chimes", name: "Classic Gold-Tone Band", price: "₹399", query: "yellow chimes classic ring men gold" },
    { tier: "Mid", brand: "GIVA", name: "925 Silver Classic Band", price: "₹2,299", query: "giva 925 silver classic ring men" },
    { tier: "Premium", brand: "PALMONAS", name: "18k Gold-Plated Classic Band", price: "₹4,499", query: "palmonas classic band ring men gold" },
  ],
  "Rope Chain": [
    { tier: "Budget", brand: "Fashion Frill", name: "Gold-Tone Rope Chain 4mm", price: "₹449", query: "fashion frill rope chain men gold" },
    { tier: "Mid", brand: "Salty", name: "Anti-Tarnish Rope Chain 5mm", price: "₹1,199", query: "salty rope chain men 5mm gold" },
    { tier: "Premium", brand: "ZAVYA", name: "925 Silver Rope Chain", price: "₹5,999", query: "zavya 925 silver rope chain men" },
  ],
  "Tactical Watch": [
    { tier: "Budget", brand: "Casio", name: "G-Shock DW-5600", price: "₹5,995", query: "casio g-shock dw-5600 men" },
    { tier: "Mid", brand: "Amazfit", name: "T-Rex 3 Rugged", price: "₹13,999", query: "amazfit t-rex 3 rugged smartwatch" },
    { tier: "Premium", brand: "Garmin", name: "Instinct 2 Solar Tactical", price: "₹38,990", query: "garmin instinct 2 solar tactical" },
  ],
  "Matte Chain": [
    { tier: "Budget", brand: "OOMPH", name: "Matte Black Curb Chain", price: "₹449", query: "oomph matte black chain men" },
    { tier: "Mid", brand: "Salty", name: "Gunmetal Box Chain", price: "₹999", query: "salty black chain men matte gunmetal" },
    { tier: "Premium", brand: "Police", name: "Blackened Steel Chain", price: "₹4,999", query: "police black steel chain men" },
  ],
  "Utility Ring": [
    { tier: "Budget", brand: "OOMPH", name: "Matte Black Minimal Band", price: "₹349", query: "oomph matte black ring men" },
    { tier: "Mid", brand: "Salty", name: "Blackened Utility Band", price: "₹799", query: "salty black ring men matte" },
    { tier: "Premium", brand: "Police", name: "Black Steel Band", price: "₹2,999", query: "police black ring men steel" },
  ],
  "Layered Chain": [
    { tier: "Budget", brand: "Fashion Frill", name: "Layered Chain Set of 2", price: "₹549", query: "fashion frill layered chain set men" },
    { tier: "Mid", brand: "Salty", name: "Double-Layer Chain Set", price: "₹1,399", query: "salty layered chain men set" },
    { tier: "Premium", brand: "ZAVYA", name: "925 Silver Layering Duo", price: "₹8,499", query: "zavya 925 silver chain set men" },
  ],
  "Distressed Bracelet": [
    { tier: "Budget", brand: "Roadster", name: "Worn Leather Wrap", price: "₹449", query: "roadster distressed leather bracelet men" },
    { tier: "Mid", brand: "The Bro Code", name: "Rugged Braided Cuff", price: "₹699", query: "the bro code rugged bracelet men leather" },
    { tier: "Premium", brand: "Fossil", name: "Rugged Leather Stack", price: "₹3,495", query: "fossil rugged leather bracelet men" },
  ],
  "Flashy Chain": [
    { tier: "Budget", brand: "Fashion Frill", name: "Iced-Out CZ Chain", price: "₹699", query: "fashion frill iced chain men cz" },
    { tier: "Mid", brand: "Salty", name: "Iced Tennis Chain 5mm", price: "₹1,599", query: "salty tennis chain men iced" },
    { tier: "Premium", brand: "GIVA", name: "925 Silver Zircon Chain", price: "₹7,999", query: "giva 925 silver zircon chain men" },
  ],
  "Statement Watch": [
    { tier: "Budget", brand: "Fossil", name: "Machine Chronograph Black", price: "₹12,995", query: "fossil machine chronograph men black" },
    { tier: "Mid", brand: "Armani Exchange", name: "Banks Steel Chronograph", price: "₹19,995", query: "armani exchange chronograph men steel" },
    { tier: "Premium", brand: "Tissot", name: "PRX Chronograph", price: "₹1,45,000", query: "tissot prx chronograph men" },
  ],
  "Cross Pendant": [
    { tier: "Budget", brand: "Fashion Frill", name: "Cross Pendant with Chain", price: "₹399", query: "fashion frill cross pendant men silver" },
    { tier: "Mid", brand: "Salty", name: "Gothic Cross Pendant", price: "₹899", query: "salty cross pendant men" },
    { tier: "Premium", brand: "GIVA", name: "925 Silver Cross Pendant", price: "₹2,999", query: "giva 925 silver cross pendant men" },
  ],
  "Dark Ring": [
    { tier: "Budget", brand: "OOMPH", name: "Black Rhodium-Tone Band", price: "₹349", query: "oomph black ring men rhodium" },
    { tier: "Mid", brand: "Salty", name: "Onyx Black Band", price: "₹849", query: "salty black band ring men" },
    { tier: "Premium", brand: "Police", name: "Blackened Signet Ring", price: "₹3,499", query: "police black signet ring men" },
  ],
  "Subtle Bracelet": [
    { tier: "Budget", brand: "OOMPH", name: "Slim Steel Cuff", price: "₹399", query: "oomph slim cuff bracelet men steel" },
    { tier: "Mid", brand: "Salty", name: "Fine Curb Bracelet", price: "₹749", query: "salty fine bracelet men silver" },
    { tier: "Premium", brand: "Fossil", name: "Slim Steel Chain Bracelet", price: "₹3,995", query: "fossil steel chain bracelet men slim" },
  ],
  "Clean Ring": [
    { tier: "Budget", brand: "Yellow Chimes", name: "Polished Steel Band", price: "₹349", query: "yellow chimes steel band ring men" },
    { tier: "Mid", brand: "Salty", name: "Polished 5mm Band", price: "₹699", query: "salty polished ring men 5mm" },
    { tier: "Premium", brand: "GIVA", name: "925 Silver Polished Band", price: "₹2,499", query: "giva 925 silver polished ring men" },
  ],
  "Bold Watch": [
    { tier: "Budget", brand: "Fastrack", name: "Big Dial Chronograph", price: "₹3,495", query: "fastrack big dial chronograph men" },
    { tier: "Mid", brand: "Fossil", name: "Bronson Chronograph 44mm", price: "₹13,995", query: "fossil bronson chronograph men" },
    { tier: "Premium", brand: "Emporio Armani", name: "Chronograph Gold-Tone", price: "₹31,995", query: "emporio armani chronograph men gold" },
  ],
  "Elegant Bracelet": [
    { tier: "Budget", brand: "Yellow Chimes", name: "Gold-Tone Link Bracelet", price: "₹449", query: "yellow chimes gold bracelet men elegant" },
    { tier: "Mid", brand: "GIVA", name: "925 Silver Curb Bracelet", price: "₹3,299", query: "giva 925 silver bracelet men curb" },
    { tier: "Premium", brand: "PALMONAS", name: "18k Gold-Plated Bracelet", price: "₹5,999", query: "palmonas gold plated bracelet men" },
  ],
  "Clean Bracelet": [
    { tier: "Budget", brand: "OOMPH", name: "Minimal Steel Bracelet", price: "₹399", query: "oomph minimal bracelet men steel" },
    { tier: "Mid", brand: "Salty", name: "Mini Cable Bracelet", price: "₹799", query: "salty cable bracelet men minimal" },
    { tier: "Premium", brand: "Daniel Wellington", name: "Classic Bracelet Silver", price: "₹6,999", query: "daniel wellington classic bracelet silver" },
  ],
  "Beaded Bracelet": [
    { tier: "Budget", brand: "Roadster", name: "Natural Stone Beads", price: "₹349", query: "roadster beaded bracelet men stone" },
    { tier: "Mid", brand: "The Bro Code", name: "Lava & Howlite Bead Set", price: "₹649", query: "the bro code beaded bracelet men set" },
    { tier: "Premium", brand: "Fossil", name: "Semi-Precious Beaded", price: "₹2,995", query: "fossil beaded bracelet men" },
  ],
  "Shell Necklace": [
    { tier: "Budget", brand: "Roadster", name: "Puka Shell Choker", price: "₹399", query: "puka shell necklace men beach" },
    { tier: "Mid", brand: "Salty", name: "Cowrie Shell Necklace", price: "₹799", query: "salty shell necklace men cowrie" },
    { tier: "Premium", brand: "Accessorize", name: "Shell & Bead Strand", price: "₹1,499", query: "shell bead necklace men premium" },
  ],
  "Casual Ring": [
    { tier: "Budget", brand: "OOMPH", name: "Everyday Band Ring", price: "₹299", query: "oomph casual ring men band" },
    { tier: "Mid", brand: "Salty", name: "Slim Everyday Band", price: "₹599", query: "salty slim ring men everyday" },
    { tier: "Premium", brand: "GIVA", name: "925 Silver Everyday Band", price: "₹1,999", query: "giva 925 silver casual ring men" },
  ],
  "Pearl Necklace": [
    { tier: "Budget", brand: "Fashion Frill", name: "Faux Pearl Strand", price: "₹499", query: "pearl necklace men fashion" },
    { tier: "Mid", brand: "Salty", name: "Baroque Pearl Chain", price: "₹1,299", query: "salty pearl necklace men baroque" },
    { tier: "Premium", brand: "GIVA", name: "925 Silver Freshwater Pearl", price: "₹4,999", query: "giva pearl necklace men silver" },
  ],
};

// Same fuzzy fallback behaviour as getAccessoryMeta — last-word match.
export const getProductOptions = (name: string): ProductOption[] => {
  if (PRODUCT_OPTIONS[name]) return PRODUCT_OPTIONS[name];
  const norm = (s: string) => s.toLowerCase().replace(/s$/, "");
  const exact = Object.keys(PRODUCT_OPTIONS).find((k) => norm(k) === norm(name));
  if (exact) return PRODUCT_OPTIONS[exact];
  const last = norm(name.split(" ").pop() ?? "");
  const key = Object.keys(PRODUCT_OPTIONS).find(
    (k) => norm(k.split(" ").pop() ?? "") === last,
  );
  return key ? PRODUCT_OPTIONS[key] : [];
};
