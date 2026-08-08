// Brand + model + image for every accessory in the Vault.
// Image paths are generated into src/assets/accessories/ as <slug>.jpg
//
// The six earring photos are licence-free stock, downloaded into assets so they
// build and cache like the rest of the set rather than hotlinking a third party:
//   stud    — pexels.com/photo/25403216      hoop   — pexels.com/photo/15799244
//   huggie  — pexels.com/photo/15799478      cross  — pexels.com/photo/8377137
//   drop    — unsplash.com/photos/1705326454933-9685fc6888e1
//   pearl   — unsplash.com/photos/1682822749969-61a63203c501

import cubanChain from "@/assets/accessories/cuban-chain.jpg";
import sportyWatch from "@/assets/accessories/sporty-watch.jpg";
import bracelet from "@/assets/accessories/bracelet.jpg";
import chunkyRing from "@/assets/accessories/chunky-ring.jpg";
import sleekWatch from "@/assets/accessories/sleek-watch.jpg";
import thinChain from "@/assets/accessories/thin-chain.jpg";
import minimalBracelet from "@/assets/accessories/minimal-bracelet.jpg";
import dressWatch from "@/assets/accessories/dress-watch.jpg";
import signetRing from "@/assets/accessories/signet-ring.jpg";
import thinBracelet from "@/assets/accessories/thin-bracelet.jpg";
import minimalWatch from "@/assets/accessories/minimal-watch.jpg";
import subtleRing from "@/assets/accessories/subtle-ring.jpg";
import leatherBracelet from "@/assets/accessories/leather-bracelet.jpg";
import cufflinks from "@/assets/accessories/cufflinks.jpg";
import elegantRing from "@/assets/accessories/elegant-ring.jpg";
import luxuryWatch from "@/assets/accessories/luxury-watch.jpg";
import statementRing from "@/assets/accessories/statement-ring.jpg";
import thickChain from "@/assets/accessories/thick-chain.jpg";
import layeredRing from "@/assets/accessories/layered-ring.jpg";
import blackBracelet from "@/assets/accessories/black-bracelet.jpg";
import simpleChain from "@/assets/accessories/simple-chain.jpg";
import casualWatch from "@/assets/accessories/casual-watch.jpg";
import cleanChain from "@/assets/accessories/clean-chain.jpg";
import minimalRing from "@/assets/accessories/minimal-ring.jpg";
import smartwatch from "@/assets/accessories/smartwatch.jpg";
import sportyBracelet from "@/assets/accessories/sporty-bracelet.jpg";
import fieldWatch from "@/assets/accessories/field-watch.jpg";
import texturedRing from "@/assets/accessories/textured-ring.jpg";
import retroWatch from "@/assets/accessories/retro-watch.jpg";
import classicRing from "@/assets/accessories/classic-ring.jpg";
import ropeChain from "@/assets/accessories/rope-chain.jpg";
import tacticalWatch from "@/assets/accessories/tactical-watch.jpg";
import matteChain from "@/assets/accessories/matte-chain.jpg";
import utilityRing from "@/assets/accessories/utility-ring.jpg";
import layeredChain from "@/assets/accessories/layered-chain.jpg";
import distressedBracelet from "@/assets/accessories/distressed-bracelet.jpg";
import flashyChain from "@/assets/accessories/flashy-chain.jpg";
import statementWatch from "@/assets/accessories/statement-watch.jpg";
import crossPendant from "@/assets/accessories/cross-pendant.jpg";
import darkRing from "@/assets/accessories/dark-ring.jpg";
import subtleBracelet from "@/assets/accessories/subtle-bracelet.jpg";
import cleanRing from "@/assets/accessories/clean-ring.jpg";
import boldWatch from "@/assets/accessories/bold-watch.jpg";
import elegantBracelet from "@/assets/accessories/elegant-bracelet.jpg";
import cleanBracelet from "@/assets/accessories/clean-bracelet.jpg";
import beadedBracelet from "@/assets/accessories/beaded-bracelet.jpg";
import shellNecklace from "@/assets/accessories/shell-necklace.jpg";
import casualRing from "@/assets/accessories/casual-ring.jpg";
import pearlNecklace from "@/assets/accessories/pearl-necklace.jpg";
import studEarring from "@/assets/accessories/stud-earring.jpg";
import hoopEarring from "@/assets/accessories/hoop-earring.jpg";
import huggieEarring from "@/assets/accessories/huggie-earring.jpg";
import dropEarring from "@/assets/accessories/drop-earring.jpg";
import crossEarring from "@/assets/accessories/cross-earring.jpg";
import pearlEarring from "@/assets/accessories/pearl-earring.jpg";

export type AccessoryMeta = {
  brand: string;
  model: string;
  image: string;
};

export const ACCESSORY_META: Record<string, AccessoryMeta> = {
  "Cuban Chain": { brand: "Cernucci", model: "Iced Cuban 12mm", image: cubanChain },
  "Sporty Watch": { brand: "Casio", model: "G-Shock GA-2100", image: sportyWatch },
  "Bracelet": { brand: "Miansai", model: "Modern Anchor Cuff", image: bracelet },
  "Chunky Ring": { brand: "Tom Wood", model: "Cushion Open Ring", image: chunkyRing },
  "Sleek Watch": { brand: "Skagen", model: "Signatur Slim 40mm", image: sleekWatch },
  "Thin Chain": { brand: "Mejuri", model: "Boyfriend Chain 1.8mm", image: thinChain },
  "Minimal Bracelet": { brand: "Le Gramme", model: "Cable 5g Polished", image: minimalBracelet },
  "Dress Watch": { brand: "Frederique Constant", model: "Classics Slimline", image: dressWatch },
  "Signet Ring": { brand: "Tom Wood", model: "Mini Signet Oval", image: signetRing },
  "Thin Bracelet": { brand: "Miansai", model: "Annex Cuff Gold", image: thinBracelet },
  "Minimal Watch": { brand: "Nomos Glashütte", model: "Tangente 35", image: minimalWatch },
  "Subtle Ring": { brand: "David Yurman", model: "Streamline Band 6mm", image: subtleRing },
  "Leather Bracelet": { brand: "Miansai", model: "Trice Noir Leather", image: leatherBracelet },
  "Cufflinks": { brand: "Montblanc", model: "Iconic Rectangular", image: cufflinks },
  "Elegant Ring": { brand: "Cartier", model: "Love Wedding Band", image: elegantRing },
  "Luxury Watch": { brand: "Rolex", model: "Datejust 41 Two-Tone", image: luxuryWatch },
  "Statement Ring": { brand: "Gucci", model: "Interlocking G", image: statementRing },
  "Thick Chain": { brand: "Cernucci", model: "Iced Cuban 20mm", image: thickChain },
  "Layered Ring": { brand: "Serge DeNimes", model: "Stacked Silver Set", image: layeredRing },
  "Black Bracelet": { brand: "Miansai", model: "Onyx Bead Bracelet", image: blackBracelet },
  "Simple Chain": { brand: "Mejuri", model: "Bold Box Chain 2mm", image: simpleChain },
  "Casual Watch": { brand: "Timex", model: "Weekender 40mm", image: casualWatch },
  "Clean Chain": { brand: "Miansai", model: "Cable Chain 1.8mm", image: cleanChain },
  "Minimal Ring": { brand: "Le Gramme", model: "Ribbon 5g Polished", image: minimalRing },
  "Smartwatch": { brand: "Apple", model: "Watch Series 10 — 46mm Titanium", image: smartwatch },
  "Sporty Bracelet": { brand: "Whoop", model: "4.0 Onyx Knit Band", image: sportyBracelet },
  "Field Watch": { brand: "Hamilton", model: "Khaki Field Mechanical 38mm", image: fieldWatch },
  "Textured Ring": { brand: "David Yurman", model: "Forged Carbon Band", image: texturedRing },
  "Retro Watch": { brand: "Timex", model: "Marlin Hand-Wound 34mm", image: retroWatch },
  "Classic Ring": { brand: "Tom Wood", model: "Classic Band Polished", image: classicRing },
  "Rope Chain": { brand: "Cernucci", model: "Rope Chain 5mm Gold", image: ropeChain },
  "Tactical Watch": { brand: "Garmin", model: "Instinct 2 Solar Tactical", image: tacticalWatch },
  "Matte Chain": { brand: "Vitaly", model: "Kusari Matte Black", image: matteChain },
  "Utility Ring": { brand: "Vitaly", model: "Heron Matte Black", image: utilityRing },
  "Layered Chain": { brand: "Cernucci", model: "Layered Trio Silver", image: layeredChain },
  "Distressed Bracelet": { brand: "Miansai", model: "Rugged Noir Leather", image: distressedBracelet },
  "Flashy Chain": { brand: "Cernucci", model: "Iced Tennis 5mm", image: flashyChain },
  "Statement Watch": { brand: "Audemars Piguet", model: "Royal Oak 41mm", image: statementWatch },
  "Cross Pendant": { brand: "Serge DeNimes", model: "Cross Pendant Silver", image: crossPendant },
  "Dark Ring": { brand: "Vitaly", model: "Sage Black Rhodium", image: darkRing },
  "Subtle Bracelet": { brand: "Miansai", model: "Volt Cuff Silver", image: subtleBracelet },
  "Clean Ring": { brand: "Le Gramme", model: "Ribbon 7g Polished", image: cleanRing },
  "Bold Watch": { brand: "Hublot", model: "Big Bang Unico 42mm", image: boldWatch },
  "Elegant Bracelet": { brand: "David Yurman", model: "Streamline Cable Bracelet", image: elegantBracelet },
  "Clean Bracelet": { brand: "Miansai", model: "Mini Cable Bracelet", image: cleanBracelet },
  "Beaded Bracelet": { brand: "Miansai", model: "Bead Pearl Stretch", image: beadedBracelet },
  "Shell Necklace": { brand: "Pura Vida", model: "Puka Shell 18\"", image: shellNecklace },
  "Casual Ring": { brand: "Tom Wood", model: "Slim Band Polished", image: casualRing },
  "Pearl Necklace": { brand: "Hatton Labs", model: "Baroque Pearl Strand", image: pearlNecklace },
  "Stud Earring": { brand: "Tom Wood", model: "Solitaire Stud Silver", image: studEarring },
  "Hoop Earring": { brand: "Serge DeNimes", model: "Serpent Hoop Silver", image: hoopEarring },
  "Huggie Earring": { brand: "Vitaly", model: "Kolla Huggie Gunmetal", image: huggieEarring },
  "Drop Earring": { brand: "Hatton Labs", model: "Teardrop Lever Gold", image: dropEarring },
  "Cross Earring": { brand: "Serge DeNimes", model: "Cross Drop Silver", image: crossEarring },
  "Pearl Earring": { brand: "Hatton Labs", model: "Pearl Stud Gold", image: pearlEarring },
};

export const getAccessoryMeta = (name: string): AccessoryMeta | undefined => {
  if (ACCESSORY_META[name]) return ACCESSORY_META[name];
  // fallback fuzzy: last-word match
  const last = name.toLowerCase().split(" ").pop();
  const key = Object.keys(ACCESSORY_META).find(
    (k) => k.toLowerCase().split(" ").pop() === last,
  );
  return key ? ACCESSORY_META[key] : undefined;
};
