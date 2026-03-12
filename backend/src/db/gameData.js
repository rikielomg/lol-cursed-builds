// ============================================================
// CURRENT DATA — Patch 16.5.1 (u.gg verified)
// Image CDN: https://static.bigbrain.gg/assets/lol/riot_static/16.5.1/img/item/{id}.png
// ============================================================

const DDRAGON_VERSION = '16.5.1';
const IMG_BASE = `https://static.bigbrain.gg/assets/lol/riot_static/${DDRAGON_VERSION}/img/item`;

// ── BOOTS (Tier 2 only — actual purchasable boots) ──────────
const BOOTS = [
  { id: 3006,  name: "Berserker's Greaves" },
  { id: 3009,  name: "Boots of Swiftness" },
  { id: 3020,  name: "Sorcerer's Shoes" },
  { id: 3047,  name: "Plated Steelcaps" },
  { id: 3111,  name: "Mercury's Treads" },
  { id: 3117,  name: "Mobility Boots" },
  { id: 3158,  name: "Ionian Boots of Lucidity" },
  { id: 3005,  name: "Ghostcrawlers" },
  { id: 3170,  name: "Swiftmarch" },
  { id: 3175,  name: "Spellslinger's Shoes" },
];

// ── SUPPORT QUEST EVOLVE ITEMS ───────────────────────────────
// Supports get one of these automatically (evolves from World Atlas quest)
const SUPPORT_EVOLVE_ITEMS = [
  { id: 3877, name: "Bloodsong" },
  { id: 3869, name: "Celestial Opposition" },
  { id: 3870, name: "Dream Maker" },
  { id: 3871, name: "Solstice Sleigh" },
  { id: 3876, name: "Zaz'Zak's Realmspike" },
];

// ── LEGENDARY ITEMS ──────────────────────────────────────────
// rangedOnly: true = Runaan's Hurricane etc (ranged champions only)
// roles: if set, only generate for those roles ([] = all roles)
const LEGENDARY_ITEMS = [
  // Fighter / bruiser
  { id: 3071, name: "Black Cleaver" },
  { id: 6630, name: "Goredrinker" },
  { id: 6632, name: "Divine Sunderer" },
  { id: 3053, name: "Sterak's Gage" },
  { id: 3748, name: "Titanic Hydra" },
  { id: 3074, name: "Ravenous Hydra" },
  { id: 3161, name: "Spear of Shojin" },
  { id: 3078, name: "Trinity Force" },
  { id: 3039, name: "Atma's Reckoning" },
  { id: 6333, name: "Death's Dance" },
  { id: 3026, name: "Guardian Angel" },
  { id: 8001, name: "Anathema's Chains" },

  // Tank
  { id: 3068, name: "Sunfire Aegis" },
  { id: 3083, name: "Warmog's Armor" },
  { id: 3084, name: "Heartsteel" },
  { id: 3075, name: "Thornmail" },
  { id: 3110, name: "Frozen Heart" },
  { id: 3143, name: "Randuin's Omen" },
  { id: 3065, name: "Spirit Visage" },
  { id: 6664, name: "Turbo Chemtank" },
  { id: 8020, name: "Abyssal Mask" },
  { id: 6662, name: "Iceborn Gauntlet" },
  { id: 2520, name: "Bastionbreaker" },

  // Assassin
  { id: 3142, name: "Youmuu's Ghostblade" },
  { id: 6691, name: "Duskblade of Draktharr" },
  { id: 3814, name: "Edge of Night" },
  { id: 6696, name: "Axiom Arc" },
  { id: 6693, name: "Serpent's Fang" },
  { id: 3179, name: "Umbral Glaive" },
  { id: 6699, name: "Voltaic Cyclosword" },

  // Marksman
  { id: 3031, name: "Infinity Edge" },
  { id: 3153, name: "Blade of The Ruined King" },
  { id: 3094, name: "Rapid Firecannon" },
  { id: 3036, name: "Lord Dominik's Regards" },
  { id: 3033, name: "Mortal Reminder" },
  { id: 3072, name: "Bloodthirster" },
  { id: 6675, name: "Galeforce" },
  { id: 6676, name: "The Collector" },
  { id: 6672, name: "Kraken Slayer" },
  { id: 6673, name: "Immortal Shieldbow" },
  { id: 3508, name: "Essence Reaver" },
  { id: 3085, name: "Runaan's Hurricane", rangedOnly: true },
  { id: 3087, name: "Statikk Shiv" },
  { id: 3046, name: "Phantom Dancer" },
  { id: 2522, name: "Actualizer" },

  // Mage / AP
  { id: 3089, name: "Rabadon's Deathcap" },
  { id: 3135, name: "Void Staff" },
  { id: 3157, name: "Zhonya's Hourglass" },
  { id: 3165, name: "Morellonomicon" },
  { id: 3102, name: "Banshee's Veil" },
  { id: 3116, name: "Rylai's Crystal Scepter" },
  { id: 3285, name: "Luden's Tempest" },
  { id: 3100, name: "Lich Bane" },
  { id: 3115, name: "Nashor's Tooth" },
  { id: 4637, name: "Demonic Embrace" },
  { id: 2503, name: "Blackfire Torch" },
  { id: 8010, name: "Bloodletter's Curse" },

  // AP utility / battlemage
  { id: 3001, name: "Everfrost" },
  { id: 4005, name: "Imperial Mandate" },
  { id: 3152, name: "Hextech Rocketbelt" },
  { id: 6655, name: "Luden's Tempest" },

  // Support
  { id: 3504, name: "Ardent Censer" },
  { id: 3107, name: "Redemption" },
  { id: 3190, name: "Locket of the Iron Solari" },
  { id: 3222, name: "Mikael's Blessing" },
  { id: 2065, name: "Shurelya's Battlesong" },
  { id: 6617, name: "Moonstone Renewer" },
  { id: 6620, name: "Echoes of Helia" },
  { id: 3050, name: "Zeke's Convergence" },
  { id: 6621, name: "Dawncore" },
  { id: 2524, name: "Bandlepipes" },

  // Shared defensive
  { id: 3156, name: "Maw of Malmortius" },
  { id: 3139, name: "Mercurial Scimitar" },
  { id: 3003, name: "Archangel's Staff" },
  { id: 3004, name: "Manamune" },
  { id: 6035, name: "Silvermere Dawn" },
  { id: 6609, name: "Chempunk Chainsword" },
];

// ── CHAMPIONS with rangeType and classes ─────────────────────
// rangeType: 'melee' | 'ranged'
// classes: array from wiki (Fighter, Tank, Mage, Assassin, Marksman, Support)
const CHAMPIONS = [
  { name: "Aatrox",        rangeType: "melee",  classes: ["Fighter"] },
  { name: "Ahri",          rangeType: "ranged", classes: ["Mage", "Assassin"] },
  { name: "Akali",         rangeType: "melee",  classes: ["Assassin"] },
  { name: "Akshan",        rangeType: "ranged", classes: ["Marksman", "Assassin"] },
  { name: "Alistar",       rangeType: "melee",  classes: ["Tank", "Support"] },
  { name: "Amumu",         rangeType: "melee",  classes: ["Tank"] },
  { name: "Anivia",        rangeType: "ranged", classes: ["Mage"] },
  { name: "Annie",         rangeType: "ranged", classes: ["Mage"] },
  { name: "Aphelios",      rangeType: "ranged", classes: ["Marksman"] },
  { name: "Ashe",          rangeType: "ranged", classes: ["Marksman", "Support"] },
  { name: "Aurelion Sol",  rangeType: "ranged", classes: ["Mage"] },
  { name: "Azir",          rangeType: "ranged", classes: ["Mage", "Marksman"] },
  { name: "Bard",          rangeType: "ranged", classes: ["Support"] },
  { name: "Blitzcrank",    rangeType: "melee",  classes: ["Tank", "Support"] },
  { name: "Brand",         rangeType: "ranged", classes: ["Mage"] },
  { name: "Braum",         rangeType: "melee",  classes: ["Support", "Tank"] },
  { name: "Caitlyn",       rangeType: "ranged", classes: ["Marksman"] },
  { name: "Camille",       rangeType: "melee",  classes: ["Fighter", "Assassin"] },
  { name: "Cassiopeia",    rangeType: "ranged", classes: ["Mage"] },
  { name: "Cho'Gath",      rangeType: "melee",  classes: ["Tank", "Fighter"] },
  { name: "Corki",         rangeType: "ranged", classes: ["Marksman", "Mage"] },
  { name: "Darius",        rangeType: "melee",  classes: ["Fighter", "Tank"] },
  { name: "Diana",         rangeType: "melee",  classes: ["Fighter", "Assassin"] },
  { name: "Dr. Mundo",     rangeType: "melee",  classes: ["Fighter", "Tank"] },
  { name: "Draven",        rangeType: "ranged", classes: ["Marksman"] },
  { name: "Ekko",          rangeType: "melee",  classes: ["Assassin", "Fighter"] },
  { name: "Elise",         rangeType: "ranged", classes: ["Mage", "Fighter"] },
  { name: "Evelynn",       rangeType: "melee",  classes: ["Assassin", "Mage"] },
  { name: "Ezreal",        rangeType: "ranged", classes: ["Marksman", "Mage"] },
  { name: "Fiora",         rangeType: "melee",  classes: ["Fighter", "Assassin"] },
  { name: "Fizz",          rangeType: "melee",  classes: ["Assassin", "Fighter"] },
  { name: "Galio",         rangeType: "melee",  classes: ["Tank", "Mage"] },
  { name: "Gangplank",     rangeType: "melee",  classes: ["Fighter"] },
  { name: "Garen",         rangeType: "melee",  classes: ["Fighter", "Tank"] },
  { name: "Gragas",        rangeType: "melee",  classes: ["Fighter", "Mage", "Tank"] },
  { name: "Graves",        rangeType: "ranged", classes: ["Marksman", "Assassin"] },
  { name: "Hecarim",       rangeType: "melee",  classes: ["Fighter", "Tank"] },
  { name: "Heimerdinger",  rangeType: "ranged", classes: ["Mage"] },
  { name: "Irelia",        rangeType: "melee",  classes: ["Fighter", "Assassin"] },
  { name: "Janna",         rangeType: "ranged", classes: ["Support", "Mage"] },
  { name: "Jarvan IV",     rangeType: "melee",  classes: ["Fighter", "Tank"] },
  { name: "Jax",           rangeType: "melee",  classes: ["Fighter", "Assassin"] },
  { name: "Jayce",         rangeType: "ranged", classes: ["Fighter", "Marksman"] },
  { name: "Jinx",          rangeType: "ranged", classes: ["Marksman"] },
  { name: "Kai'Sa",        rangeType: "ranged", classes: ["Marksman", "Assassin"] },
  { name: "Karma",         rangeType: "ranged", classes: ["Mage", "Support"] },
  { name: "Karthus",       rangeType: "ranged", classes: ["Mage"] },
  { name: "Kassadin",      rangeType: "melee",  classes: ["Assassin", "Mage"] },
  { name: "Katarina",      rangeType: "melee",  classes: ["Assassin", "Mage"] },
  { name: "Kayle",         rangeType: "ranged", classes: ["Fighter", "Marksman"] },
  { name: "Kayn",          rangeType: "melee",  classes: ["Fighter", "Assassin"] },
  { name: "Kennen",        rangeType: "ranged", classes: ["Mage", "Marksman"] },
  { name: "Kha'Zix",       rangeType: "melee",  classes: ["Assassin"] },
  { name: "Kindred",       rangeType: "ranged", classes: ["Marksman"] },
  { name: "Kog'Maw",       rangeType: "ranged", classes: ["Marksman", "Mage"] },
  { name: "LeBlanc",       rangeType: "ranged", classes: ["Assassin", "Mage"] },
  { name: "Lee Sin",       rangeType: "melee",  classes: ["Fighter", "Assassin"] },
  { name: "Leona",         rangeType: "melee",  classes: ["Tank", "Support"] },
  { name: "Lissandra",     rangeType: "ranged", classes: ["Mage"] },
  { name: "Lucian",        rangeType: "ranged", classes: ["Marksman", "Assassin"] },
  { name: "Lulu",          rangeType: "ranged", classes: ["Support", "Mage"] },
  { name: "Lux",           rangeType: "ranged", classes: ["Mage", "Support"] },
  { name: "Malphite",      rangeType: "melee",  classes: ["Tank", "Fighter"] },
  { name: "Malzahar",      rangeType: "ranged", classes: ["Mage"] },
  { name: "Master Yi",     rangeType: "melee",  classes: ["Fighter", "Assassin"] },
  { name: "Miss Fortune",  rangeType: "ranged", classes: ["Marksman", "Assassin"] },
  { name: "Mordekaiser",   rangeType: "melee",  classes: ["Fighter", "Mage"] },
  { name: "Morgana",       rangeType: "ranged", classes: ["Mage", "Support"] },
  { name: "Nami",          rangeType: "ranged", classes: ["Support", "Mage"] },
  { name: "Nasus",         rangeType: "melee",  classes: ["Fighter", "Tank"] },
  { name: "Nidalee",       rangeType: "ranged", classes: ["Assassin", "Mage"] },
  { name: "Nocturne",      rangeType: "melee",  classes: ["Assassin", "Fighter"] },
  { name: "Nunu & Willump",rangeType: "melee",  classes: ["Tank", "Fighter"] },
  { name: "Olaf",          rangeType: "melee",  classes: ["Fighter", "Tank"] },
  { name: "Orianna",       rangeType: "ranged", classes: ["Mage", "Support"] },
  { name: "Pantheon",      rangeType: "melee",  classes: ["Fighter", "Assassin"] },
  { name: "Poppy",         rangeType: "melee",  classes: ["Tank", "Fighter"] },
  { name: "Pyke",          rangeType: "melee",  classes: ["Support", "Assassin"] },
  { name: "Qiyana",        rangeType: "melee",  classes: ["Assassin"] },
  { name: "Quinn",         rangeType: "ranged", classes: ["Marksman", "Assassin"] },
  { name: "Rakan",         rangeType: "melee",  classes: ["Support", "Fighter"] },
  { name: "Rammus",        rangeType: "melee",  classes: ["Tank"] },
  { name: "Rek'Sai",       rangeType: "melee",  classes: ["Fighter"] },
  { name: "Renekton",      rangeType: "melee",  classes: ["Fighter", "Tank"] },
  { name: "Riven",         rangeType: "melee",  classes: ["Fighter", "Assassin"] },
  { name: "Rumble",        rangeType: "melee",  classes: ["Fighter", "Mage"] },
  { name: "Ryze",          rangeType: "ranged", classes: ["Mage", "Fighter"] },
  { name: "Samira",        rangeType: "ranged", classes: ["Marksman", "Assassin"] },
  { name: "Sejuani",       rangeType: "melee",  classes: ["Tank", "Fighter"] },
  { name: "Senna",         rangeType: "ranged", classes: ["Marksman", "Support"] },
  { name: "Seraphine",     rangeType: "ranged", classes: ["Mage", "Support"] },
  { name: "Shaco",         rangeType: "melee",  classes: ["Assassin"] },
  { name: "Shen",          rangeType: "melee",  classes: ["Tank", "Fighter"] },
  { name: "Shyvana",       rangeType: "melee",  classes: ["Fighter", "Tank"] },
  { name: "Singed",        rangeType: "melee",  classes: ["Tank", "Fighter"] },
  { name: "Sion",          rangeType: "melee",  classes: ["Tank", "Fighter"] },
  { name: "Sivir",         rangeType: "ranged", classes: ["Marksman"] },
  { name: "Skarner",       rangeType: "melee",  classes: ["Fighter", "Tank"] },
  { name: "Soraka",        rangeType: "ranged", classes: ["Support", "Mage"] },
  { name: "Swain",         rangeType: "ranged", classes: ["Mage", "Fighter"] },
  { name: "Sylas",         rangeType: "melee",  classes: ["Mage", "Fighter"] },
  { name: "Syndra",        rangeType: "ranged", classes: ["Mage"] },
  { name: "Talon",         rangeType: "melee",  classes: ["Assassin", "Fighter"] },
  { name: "Taric",         rangeType: "melee",  classes: ["Support", "Tank"] },
  { name: "Teemo",         rangeType: "ranged", classes: ["Marksman", "Assassin"] },
  { name: "Thresh",        rangeType: "melee",  classes: ["Support", "Fighter"] },
  { name: "Tristana",      rangeType: "ranged", classes: ["Marksman", "Assassin"] },
  { name: "Trundle",       rangeType: "melee",  classes: ["Fighter", "Tank"] },
  { name: "Tryndamere",    rangeType: "melee",  classes: ["Fighter", "Assassin"] },
  { name: "Twisted Fate",  rangeType: "ranged", classes: ["Mage", "Marksman"] },
  { name: "Twitch",        rangeType: "ranged", classes: ["Marksman", "Assassin"] },
  { name: "Udyr",          rangeType: "melee",  classes: ["Fighter", "Tank"] },
  { name: "Urgot",         rangeType: "ranged", classes: ["Fighter", "Tank"] },
  { name: "Varus",         rangeType: "ranged", classes: ["Marksman", "Mage"] },
  { name: "Vayne",         rangeType: "ranged", classes: ["Marksman", "Assassin"] },
  { name: "Veigar",        rangeType: "ranged", classes: ["Mage"] },
  { name: "Vel'Koz",       rangeType: "ranged", classes: ["Mage"] },
  { name: "Vi",            rangeType: "melee",  classes: ["Fighter", "Assassin"] },
  { name: "Viktor",        rangeType: "ranged", classes: ["Mage"] },
  { name: "Vladimir",      rangeType: "ranged", classes: ["Mage", "Fighter"] },
  { name: "Volibear",      rangeType: "melee",  classes: ["Fighter", "Tank"] },
  { name: "Warwick",       rangeType: "melee",  classes: ["Fighter", "Tank"] },
  { name: "Wukong",        rangeType: "melee",  classes: ["Fighter", "Tank"] },
  { name: "Xayah",         rangeType: "ranged", classes: ["Marksman"] },
  { name: "Xerath",        rangeType: "ranged", classes: ["Mage"] },
  { name: "Xin Zhao",      rangeType: "melee",  classes: ["Fighter", "Assassin"] },
  { name: "Yasuo",         rangeType: "melee",  classes: ["Fighter", "Assassin"] },
  { name: "Yone",          rangeType: "melee",  classes: ["Fighter", "Assassin"] },
  { name: "Yorick",        rangeType: "melee",  classes: ["Fighter", "Tank"] },
  { name: "Yuumi",         rangeType: "ranged", classes: ["Support", "Mage"] },
  { name: "Zac",           rangeType: "melee",  classes: ["Tank", "Fighter"] },
  { name: "Zed",           rangeType: "melee",  classes: ["Assassin"] },
  { name: "Ziggs",         rangeType: "ranged", classes: ["Mage", "Marksman"] },
  { name: "Zilean",        rangeType: "ranged", classes: ["Support", "Mage"] },
  { name: "Zoe",           rangeType: "ranged", classes: ["Mage", "Assassin"] },
  { name: "Zyra",          rangeType: "ranged", classes: ["Mage", "Support"] },
];

const ROLES = ['top', 'jungle', 'mid', 'adc', 'support'];

function generateBuild(roleOverride) {
  // 1. Pick role
  const role = roleOverride || ROLES[Math.floor(Math.random() * ROLES.length)];
  const isSupport = role === 'support';

  // 2. Pick champion
  const champion = CHAMPIONS[Math.floor(Math.random() * CHAMPIONS.length)];
  const isRanged = champion.rangeType === 'ranged';

  // 3. Pick boots
  const boots = BOOTS[Math.floor(Math.random() * BOOTS.length)];

  // 4. Filter items valid for this champion + role
  const validItems = LEGENDARY_ITEMS.filter(item => {
    // Skip ranged-only items for melee champions
    if (item.rangedOnly && !isRanged) return false;
    // Skip role-locked items for wrong roles
    if (item.roles && item.roles.length > 0 && !item.roles.includes(role)) return false;
    return true;
  });

  // 5. Pick 4 unique legendary items (+ boots + optional support item = 5-6 slots)
  const shuffled = [...validItems].sort(() => Math.random() - 0.5);
  const picked = [];
  const usedIds = new Set([boots.id]);

  for (const item of shuffled) {
    if (picked.length >= (isSupport ? 4 : 5)) break;
    if (!usedIds.has(item.id)) {
      picked.push(item);
      usedIds.add(item.id);
    }
  }

  // 6. Support gets a random evolve item in slot 1
  let items;
  if (isSupport) {
    const evolveItem = SUPPORT_EVOLVE_ITEMS[Math.floor(Math.random() * SUPPORT_EVOLVE_ITEMS.length)];
    items = [boots, evolveItem, ...picked].sort(() => Math.random() - 0.5);
  } else {
    items = [boots, ...picked].sort(() => Math.random() - 0.5);
  }

  return { champion, items, role };
}

module.exports = { generateBuild, CHAMPIONS, BOOTS, LEGENDARY_ITEMS, SUPPORT_EVOLVE_ITEMS, IMG_BASE, DDRAGON_VERSION };
