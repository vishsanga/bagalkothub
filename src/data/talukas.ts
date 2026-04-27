import bagalkotImg from "@/assets/taluka-bagalkot.jpg";
import badamiImg from "@/assets/taluka-badami.jpg";
import bilagiImg from "@/assets/taluka-bilagi.jpg";
import hungundImg from "@/assets/taluka-hungund.jpg";
import jamkhandiImg from "@/assets/taluka-jamkhandi.jpg";
import mudholImg from "@/assets/taluka-mudhol.jpg";
import rabkaviImg from "@/assets/taluka-rabkavi.jpg";
import guledaguddaImg from "@/assets/taluka-guledagudda.jpg";
import ilkalImg from "@/assets/taluka-ilkal.jpg";

export type Taluka = {
  slug: string;
  name: string;
  tagline: string;
  population: string;
  knownFor: string[];
  description: string;
  highlights: { title: string; body: string }[];
  image: string;
};

export const TALUKAS: Taluka[] = [
  {
    slug: "bagalkot",
    name: "Bagalkot",
    tagline: "The district headquarters and gateway to North Karnataka heritage.",
    population: "≈ 112,000",
    knownFor: ["District HQ", "Navanagar township", "Education hub"],
    description:
      "Bagalkot is the administrative seat of the district, planned around the modern Navanagar township after the rehabilitation from the Almatti backwaters. The town blends government offices, engineering and basaveshwara education institutes, and a fast-growing residential corridor along the Vidyagiri belt.",
    highlights: [
      { title: "Navanagar", body: "A planned township with sectors, parks and the city's cleanest roads." },
      { title: "Vidyagiri", body: "Education and student hub — colleges, hostels and cafés along the belt." },
      { title: "Markets", body: "Old Bagalkot retains the original bazaar feel for groceries, textiles and gold." },
    ],
    image: bagalkotImg,
  },
  {
    slug: "badami",
    name: "Badami",
    tagline: "Cradle of Chalukyan rock-cut architecture and a UNESCO favourite.",
    population: "≈ 30,000",
    knownFor: ["Cave Temples", "Agastya Lake", "Chalukyan history"],
    description:
      "Badami, the former capital of the Early Chalukyas, is famed for its red sandstone cave temples carved into cliffs above the emerald Agastya Tirtha. A short trip away lie Pattadakal and Aihole — together forming one of India's most important early temple landscapes.",
    highlights: [
      { title: "Cave Temples", body: "Four 6th-century rock-cut shrines dedicated to Shiva, Vishnu and Jain tirthankaras." },
      { title: "Agastya Lake", body: "A perennial tank reflecting the cliffs — magical at sunrise." },
      { title: "Bhutanatha Temples", body: "Riverside shrines on the lake's eastern bank, peaceful and photogenic." },
    ],
    image: badamiImg,
  },
  {
    slug: "bilagi",
    name: "Bilagi",
    tagline: "Sugarcane country along the Krishna river belt.",
    population: "≈ 23,000",
    knownFor: ["Sugar mills", "Agriculture", "Krishna riverbank"],
    description:
      "Bilagi sits in the heart of the Krishna canal command area. Sugarcane, jowar and pulses dominate the landscape, and the taluka hosts several cooperative sugar factories that anchor the local economy.",
    highlights: [
      { title: "Sugar belt", body: "Cooperative mills source from thousands of farmers across surrounding villages." },
      { title: "Galagali", body: "Pilgrimage town on the Krishna riverbank with the Naganatha temple." },
      { title: "Agro-trade", body: "Weekly santhe (markets) draw produce from across the taluka." },
    ],
    image: bilagiImg,
  },
  {
    slug: "hungund",
    name: "Hungund",
    tagline: "Temple ruins, river ghats and a slow-paced heartland.",
    population: "≈ 37,000",
    knownFor: ["Kudalasangama nearby", "Temples", "Cotton farming"],
    description:
      "Hungund is the bridge between the Bagalkot plains and the Krishna-Malaprabha confluence at Kudalasangama — the seat of Basavanna's spiritual movement. The taluka's villages dot a quiet landscape of ancient stone temples and cotton fields.",
    highlights: [
      { title: "Kudalasangama", body: "Sacred confluence and resting place of Basavanna, just outside the taluka border." },
      { title: "Old shrines", body: "Hemmadi temples and small Chalukyan stone structures across the villages." },
      { title: "Cotton & jowar", body: "Backbone crops feeding regional ginning mills." },
    ],
    image: hungundImg,
  },
  {
    slug: "jamkhandi",
    name: "Jamkhandi",
    tagline: "A historic princely town with thriving commerce and culture.",
    population: "≈ 67,000",
    knownFor: ["Princely heritage", "Trade hub", "Sugar industry"],
    description:
      "Jamkhandi was a Maratha princely state until Independence, and that legacy lives on in its palaces, temples and a bustling main bazaar. Today it is one of the largest commercial towns of the district, with sugar, dairy and education driving growth.",
    highlights: [
      { title: "Ramatirth", body: "A serene temple complex around a tank, the favourite weekend escape." },
      { title: "Historic palace", body: "The royal residence and surrounding old town reward a slow walk." },
      { title: "Markets", body: "Wholesale and retail trade serves a wide rural catchment." },
    ],
    image: jamkhandiImg,
  },
  {
    slug: "mudhol",
    name: "Mudhol",
    tagline: "Home of the legendary Mudhol Hound and rich green farmland.",
    population: "≈ 60,000",
    knownFor: ["Mudhol Hound", "Sugar mills", "Princely town"],
    description:
      "Mudhol is best known worldwide for the Mudhol Hound — an indigenous sighthound with royal ancestry. The town itself is a busy taluka centre with sugar factories, an old palace area and surrounding villages of fertile black-soil farmland.",
    highlights: [
      { title: "Mudhol Hound", body: "The Canine Research and Information Centre conserves and promotes the breed." },
      { title: "Old town", body: "The princely-era palace and temples sit at the heart of the bazaar." },
      { title: "Sugar belt", body: "Several cooperative and private mills drive the local economy." },
    ],
    image: mudholImg,
  },
  {
    slug: "rabkavi-banhatti",
    name: "Rabkavi-Banhatti",
    tagline: "The handloom and powerloom textile capital of the district.",
    population: "≈ 70,000",
    knownFor: ["Handlooms", "Powerlooms", "Sarees"],
    description:
      "The twin towns of Rabkavi and Banhatti form one of Karnataka's most important textile clusters. Thousands of looms — traditional and modern — weave cotton and silk sarees that are sold across South India.",
    highlights: [
      { title: "Saree weaving", body: "Generations of weaver families craft traditional and contemporary designs." },
      { title: "Powerloom hubs", body: "Modern units co-exist with small-scale handloom workshops." },
      { title: "Textile trade", body: "A dense bazaar of yarn, dye and finished cloth merchants." },
    ],
    image: rabkaviImg,
  },
  {
    slug: "guledagudda",
    name: "Guledagudda",
    tagline: "Birthplace of the iconic Khana — North Karnataka's traditional blouse fabric.",
    population: "≈ 35,000",
    knownFor: ["Khana fabric", "Weaving heritage", "Traditional bazaar"],
    description:
      "Guledagudda is synonymous with Khana — the colourful, finely-woven cotton-silk blouse fabric that pairs with Ilkal sarees. The town's narrow lanes echo with looms, and the fabric is recognised with a Geographical Indication tag.",
    highlights: [
      { title: "Khana weaving", body: "GI-tagged fabric woven on pit looms in family workshops." },
      { title: "Bazaar walk", body: "Small textile shops, dye yards and weaver homes line the centre." },
      { title: "Local cuisine", body: "Authentic North Karnataka thali joints and jowar rotti spots." },
    ],
    image: guledaguddaImg,
  },
  {
    slug: "ilkal",
    name: "Ilkal",
    tagline: "Home of the world-famous Ilkal saree and granite quarries.",
    population: "≈ 65,000",
    knownFor: ["Ilkal sarees", "Granite", "Weaving"],
    description:
      "Ilkal has woven its name into Indian heritage through the distinctive Ilkal saree — known for its tope teni pallu and contrast borders. Beyond textiles, the town is also a major centre for granite quarrying and processing.",
    highlights: [
      { title: "Ilkal sarees", body: "GI-tagged sarees blending cotton body with art-silk borders and pallu." },
      { title: "Granite hub", body: "Quarries and polishing units export across India and abroad." },
      { title: "Temples", body: "Old shrines around the town add depth to a quick weekend visit." },
    ],
    image: ilkalImg,
  },
];

export const getTaluka = (slug: string) => TALUKAS.find((t) => t.slug === slug);
