import { Figure, Rarity } from '../types/game';
import { CRATE_TIERS } from './tiers';

// Archetypes and names per tier (20 figures per tier)
const TIER_THEMES = [
  {
    tier: 1,
    archetype: 'Scrap Scavenger',
    names: [
      'Cardboard Bob', 'Tin Can Timmy', 'Rusty Rat', 'Pigeon Scout', 'Dumpster Diver',
      'Bottlecap Billy', 'Newspaper Ninja', 'Soggy Sock', 'Cracked Mug', 'Spork Warrior',
      'Tape Roll Terry', 'Twist-Tie Pete', 'Stale Donut', 'Cobweb Crawler', 'Styrofoam Sam',
      'Alley Cat Boris', 'Crumpled Memo', 'Rusty Spring', 'Shed Snail', 'Pocket Lint Larry'
    ],
    descriptions: [
      'Assembled from discarded delivery boxes.', 'His head is an unwashed baked bean can.',
      'Fastest rodent in the municipal waste district.', 'Keeps watch from a broken telephone pole.',
      'Knows the exact schedule of every bakery dumpster.', 'Trades rare soda caps for shiny foil wrappers.',
      'Folds himself into disguise during rainy days.', 'Legendary defender of the storm drain.',
      'Missing a handle, but still holds vengeance.', 'Part spoon, part fork, totally lethal.',
      'Strongest adhesive bond in the borough.', 'Never comes untwisted under pressure.',
      'Hard as a brick, seasoned with city pavement.', 'Spins webs out of shredded supermarket flyers.',
      'Immune to moisture, highly squeaky when stepped on.', 'Scars earned in intense alley turf disputes.',
      'Contains classified secrets about garbage day.', 'Boings with unpredictable mechanical fury.',
      'Paces himself, carrying a crushed soda can shell.', 'The most persistent creature in human pockets.'
    ],
    silhouettes: ['biped', 'beast', 'robot', 'winged', 'biped', 'biped', 'ninja', 'blob', 'beast', 'biped', 'robot', 'beast', 'blob', 'beast', 'blob', 'beast', 'ninja', 'robot', 'beast', 'blob']
  },
  {
    tier: 2,
    archetype: 'Junkyard Scrapper',
    names: [
      'Wrench Wielder', 'Sparky Plug', 'Piston Pete', 'Gearhead Gary', 'Muffler Mike',
      'Lugnut Lou', 'Exhaust Emma', 'Radiator Ralph', 'Chassis Chip', 'Carburetor Carl',
      'Grease Monkey', 'Blowtorch Ben', 'Hydraulic Hank', 'Sledgehammer Sal', 'Gasket Gus',
      'Flywheel Fran', 'Alternator Art', 'Bearing Barry', 'Oildrum Ollie', 'Junkyard Rex'
    ],
    descriptions: [
      'Can torque a lug bolt to 500 foot-pounds barehanded.', 'Fires erratic electrical arcs when startled.',
      'Pumps with relentless diesel cadence.', 'Has 40 teeth, all made of transmission gears.',
      'Belches black smoke to create hasty smoke screens.', 'Heavier than he looks, rolls true.',
      'Hot fumes constantly vent from her copper pipes.', 'Coolant boiling with righteous rage.',
      'Reinforced welded iron skeleton.', 'Carefully balances air and gasoline fumes.',
      'Slick with 10W-40 motor oil, slips through any grab.', 'His flame burns blue and melts sheet metal.',
      'Can lift a semi-truck on one arm.', 'Every strike registers on local seismographs.',
      'High-pressure seal that has never blown.', 'Maintains rotational momentum indefinitely.',
      'Recharges batteries while sleeping.', 'Smooth sphere rolling on frictionless grease.',
      'Armored in 55 gallons of industrial steel.', 'The apex predator of the metal scrapyard.'
    ],
    silhouettes: ['biped', 'robot', 'robot', 'robot', 'biped', 'robot', 'biped', 'robot', 'beast', 'robot', 'beast', 'biped', 'robot', 'biped', 'blob', 'robot', 'robot', 'blob', 'robot', 'beast']
  },
  {
    tier: 3,
    archetype: 'Armored Vanguard',
    names: [
      'Aegis Sentinel', 'Titan Ward', 'Bulwark Beta', 'Ironclad Ivan', 'Riot Striker',
      'Phalanx Drone', 'Alloy Warden', 'Citadel Centurion', 'Kevlar Knight', 'Blast Barricade',
      'Shieldwall Sam', 'Garrison Ghost', 'Pike Sentinel', 'Reinforced Rex', 'Vault Keeper',
      'Heavy Heavyweight', 'Bunker Buster', 'Fortress Fiona', 'Lockdown Lynx', 'Tungsten Titan'
    ],
    descriptions: [
      'Equipped with a hydraulic blast shield.', 'Walks into artillery fire without flinching.',
      'Military test prototype with dual defensive plating.', 'Old war veteran clad in cold-rolled plate.',
      'Breaks through riot barriers with sonic shockwaves.', 'Hover drone emitting kinetic suppression fields.',
      'Guards the military arsenal day and night.', 'Trained in ancient Roman defensive formations.',
      'Triple-weave ballistic fiber weave suits.', 'Engineered to absorb directional landmine blasts.',
      'Holds the front line against all odds.', 'An echo of an old fortress patrol unit.',
      'Spear energized with armor-piercing charge.', 'Cybernetic canine wearing reactive armor.',
      'Carries the master magnetic keycard to the vault.', 'Weighs three metric tons in full gear.',
      'Breaches reinforced bunker doors like wet tissue.', 'Commands the outpost perimeter defense grid.',
      'Silent predatory scout wrapped in composite stealth plating.', 'Core forged of hyper-dense tungsten carbide.'
    ],
    silhouettes: ['biped', 'robot', 'hover', 'biped', 'biped', 'hover', 'biped', 'biped', 'ninja', 'robot', 'biped', 'ninja', 'biped', 'beast', 'robot', 'biped', 'robot', 'biped', 'beast', 'robot']
  },
  {
    tier: 4,
    archetype: 'Cyberpunk Outlaw',
    names: [
      'Neon Ronin', 'Glitch Hacker', 'Synth Geisha', 'Chrome Raider', 'Data Phantom',
      'Overclock Otto', 'Fiberoptic Fox', 'Sub-Zero Netrunner', 'Laser Viper', 'Holo Dancer',
      'Augment Ash', 'Cyber Shaman', 'Vector Valkyrie', 'Neural Nyx', 'Grid Stalker',
      'Pixel Punk', 'Byte Brawler', 'Bandwidth Bandit', 'Matrix Mercenary', 'Circuit Queen'
    ],
    descriptions: [
      'Wields a thermal-edged katana humming with neon energy.', 'Injects malicious payloads into target optic nerves.',
      'Deadly assassin cloaked beneath traditional courtesan guise.', 'Scavenges high-end neuro-chips from corporate labs.',
      'Leaves only corrupted log files in his wake.', 'Heart rate synchronized with a 10GHz liquid nitrogen cooler.',
      'Nine glowing fiber tails that siphon electricity.', 'Dives into ice-cold deep-net databases.',
      'Twin cyber-fangs that inject nanite neurotoxins.', 'Flickers in and out of optical perception.',
      'Over 90% artificial replacement body parts.', 'Channels corporate server spirits and digital ghosts.',
      'Soars across high-rise skylines on hard-light wings.', 'Can download combat protocols in milliseconds.',
      'Prowls dark alleys between fiber optic trunk lines.', 'Low-fi aesthetic, high-damage disruptor cannon.',
      'Fists charged with kinetic capacitor cells.', 'Steals terabytes of classified corporate stocks.',
      'Works for whoever has the highest cryptocurrency transfer.', 'Rules the underground augmented fighting circuit.'
    ],
    silhouettes: ['ninja', 'ninja', 'biped', 'biped', 'hover', 'robot', 'beast', 'ninja', 'beast', 'biped', 'biped', 'biped', 'winged', 'ninja', 'beast', 'biped', 'biped', 'ninja', 'biped', 'biped']
  },
  {
    tier: 5,
    archetype: 'Gilded Syndicate',
    names: [
      'Midas Prince', 'Platinum Baron', 'Diamond Duchess', 'Velvet Kingpin', 'Goldfinger Gus',
      'Silk Smuggler', 'Crown Enforcer', 'Vault Overseer', 'Emerald Viceroy', 'Champagne Charlie',
      'Bullion Behemoth', 'Treasure Drake', 'Casino Croupier', 'Ruby Royal', 'Opal Oracle',
      'Imperial Banker', 'Golden Griffin', 'Gilded Corsair', 'Prestige Paladin', 'Sovereign Sovereign'
    ],
    descriptions: [
      'Everything he touches turns to solid high-purity bullion.', 'Owns half the private orbital banking stations.',
      'Armor cut from flawless synthetic diamond crystals.', 'Coordinates high-society heists from behind velvet ropes.',
      'Has replaced his right hand with a gilded laser armature.', 'Imports exotic fabrics from off-world colonies.',
      'Carries a solid gold scepter with a built-in stun field.', 'Never sleeps, keeps tally on the global reserve.',
      'Robes dyed with emerald dust and woven silver.', 'Celebrates victory with vintage sparkling ambrosia.',
      'Gilded golem funded by old-world hedge funds.', 'Hoards priceless relics on a bed of gold doubloons.',
      'Deals cards faster than bullet camera shutters.', 'Draped in deep crimson silks and cut rubies.',
      'Predicts stock market crashes with mystical precision.', 'Can liquidate small nations with a single signature.',
      'Majestic beast with feathers dipped in liquid gold.', 'Sails solar yachts through private star systems.',
      'Holy knight sworn to protect the international treasury.', 'The undisputed ruler of the elite high-roller club.'
    ],
    silhouettes: ['biped', 'biped', 'biped', 'biped', 'biped', 'ninja', 'biped', 'robot', 'biped', 'biped', 'robot', 'winged', 'biped', 'biped', 'hover', 'biped', 'winged', 'biped', 'biped', 'biped']
  },
  {
    tier: 6,
    archetype: 'Cryo Mutagen',
    names: [
      'Frostbite Fiend', 'Cryo Stalker', 'Glacier Goliath', 'Zero-Kelvin Zealot', 'Blizzard Banshee',
      'Icebound Abomination', 'Permafrost Parasite', 'Cryogenic Core', 'Boreal Behemoth', 'Rime Reaper',
      'Arctic Chimera', 'Cryo Hivemind', 'Sub-Zero Siren', 'Avalanche Ape', 'Glacial Wyrm',
      'Liquid Nitrogen Lurker', 'Thermal Siphon', 'Deep Freeze Dread', 'Frostfire Demon', 'Absolute Zero King'
    ],
    descriptions: [
      'Body temperature is cold enough to shatter steel on contact.', 'Leaves frozen footprints that freeze surrounding air.',
      'A walking mountain of unmelting glacial ice.', 'Worships the thermal death of the universe.',
      'Her scream drops ambient temperatures by 50 degrees.', 'Escaped from a classified orbital laboratory freezer.',
      'Burrows into host nervous systems to induce hibernation.', 'A self-sustaining nuclear cryo-engine.',
      'Ancient creature awakened from beneath Antarctic shelf.', 'Harvests heat energy with a scythe of pure frost.',
      'Splice of arctic wolf, snow owl, and alien apex predator.', 'Controls millions of micro-ice nanites in unison.',
      'Lures explorers into blizzards with haunting songs.', 'Can trigger an avalanche with a two-handed smash.',
      'Slithers through frozen tundra ice sheets with ease.', 'Drips liquid nitrogen from its mutated fangs.',
      'Absorbs all thermal kinetic energy in a 50-meter radius.', 'Encases its victims in flawless cryogenic glass.',
      'Burns with an impossible freezing blue flame.', 'Monarch of the eternal cryogenic winter.'
    ],
    silhouettes: ['beast', 'ninja', 'robot', 'biped', 'winged', 'beast', 'blob', 'hover', 'beast', 'ninja', 'winged', 'blob', 'biped', 'beast', 'beast', 'beast', 'hover', 'robot', 'elemental', 'biped']
  },
  {
    tier: 7,
    archetype: 'Obsidian Nether',
    names: [
      'Brimstone Berserker', 'Void Drake', 'Nether Inquisitor', 'Obsidian Colossus', 'Abyssal Lich',
      'Hellfire Hellhound', 'Cinder Queen', 'Magma Leviathan', 'Shadow Flame Sorcerer', 'Ember Assassin',
      'Soul Harvester', 'Pyroclastic Fiend', 'Obsidian Warlock', 'Brimstone Basilisk', 'Netherwing Gargoyle',
      'Volcanic Juggernaut', 'Duskblade Demon', 'Nether Spire Golem', 'Ashfall Sovereign', 'Underworld Monarch'
    ],
    descriptions: [
      'Swings two-handed axes dripping with bubbling sulfur.', 'Breaths purplish-black voidfire that burns concepts.',
      'Searches souls for traces of celestial light to purge.', 'Chiseled from glossy subterranean volcanic rock.',
      'Channels necrotic dark matter through a bone staff.', 'Twin-headed hound stalking the borders of the abyss.',
      'Crown woven from crystallized volcanic obsidian.', 'Swims through molten magma lakes under the crust.',
      'Bends dark flames into shadowy protective barriers.', 'Darts from dark smoke clouds to strike critical veins.',
      'Collects glowing embers of extinguished warriors.', 'Formed during the explosive eruption of supervolcanoes.',
      'Recites incantations that tear holes into the void.', 'Its stony gaze petrifies victims into brittle volcanic glass.',
      'Perched on blackened spires watching over the abyss.', 'Unstoppable battering ram wrapped in hardened crust.',
      'Blades forged under the crushing pressure of planetary cores.', 'Constructed to guard the dark subterranean gates.',
      'Rains burning ash across entire battlefields.', 'The ancient supreme lord of the infernal deep.'
    ],
    silhouettes: ['biped', 'winged', 'biped', 'robot', 'ninja', 'beast', 'biped', 'beast', 'biped', 'ninja', 'hover', 'elemental', 'biped', 'beast', 'winged', 'robot', 'ninja', 'robot', 'biped', 'biped']
  },
  {
    tier: 8,
    archetype: 'Plasma Celestial Engine',
    names: [
      'Solar Archon', 'Fusion Golem', 'Corona Knight', 'Neutron Striker', 'Plasma Drake',
      'Stellar Sentinel', 'Helios Valkyrie', 'Proton Pulsar', 'Orbital Vanguard', 'Thermonuclear Titan',
      'Solaris Sage', 'Magnetic Coil Fiend', 'Supernova Beast', 'Gamma Ray Ghost', 'Ion Storm Chaser',
      'Starforge Automaton', 'Corona Empress', 'Solar Flare Wyrm', 'Quantum Reactor Rex', 'Hyperion Overlord'
    ],
    descriptions: [
      'Radiates the brilliance of a newly ignited yellow star.', 'Fueled by an internal deuterium fusion chamber.',
      'Clad in magnetic shields that deflect orbital lasers.', 'Strikes with the localized density of a neutron star.',
      'Wings made of arching electromagnetic plasma flares.', 'Maintains solar orbital arrays in high orbit.',
      'Leads the sun-fleet into interstellar battle.', 'Emits rhythmic pulses of coherent electromagnetic energy.',
      'Drops from orbital stations with atmospheric re-entry heat.', 'Could vaporize a mountain range with a full core vent.',
      'Understands the celestial geometry of nuclear fire.', 'Traps enemies in devastating magnetic containment loops.',
      'Born in the heart of a dying giant star.', 'Invisible until it releases a blinding burst of radiation.',
      'Rides stellar winds across planetary magnetic poles.', 'Forges starship armor out of heavy solar elements.',
      'Directs coronal mass ejections with royal authority.', 'Coils around star-bases to absorb solar energy.',
      'Quadruple-core fusion reactor in mechanical canine chassis.', 'The undisputed commander of celestial thermonuclear energy.'
    ],
    silhouettes: ['biped', 'robot', 'biped', 'ninja', 'winged', 'robot', 'winged', 'hover', 'biped', 'robot', 'biped', 'robot', 'beast', 'hover', 'hover', 'robot', 'biped', 'beast', 'beast', 'biped']
  },
  {
    tier: 9,
    archetype: 'Astral Ascendant',
    names: [
      'Seraphim Prime', 'Astral Oracle', 'Starlight Sovereign', 'Nebula Weaver', 'Elysian Cherub',
      'Eclipse Archangel', 'Cosmic Harmonizer', 'Zodiac Drake', 'Constellation Knight', 'Aura Valkyrie',
      'Miracle Vanguard', 'Prismatic Paragon', 'Stardust Siren', 'Moonlight Empyrean', 'Chrono Seraph',
      'Nova Phoenix', 'Divine Sentinel', 'Astral Sphinx', 'Luminous Sovereign', 'Celestial Pantocrator'
    ],
    descriptions: [
      'Six wings of shimmering iridescent starlight.', 'Peers through timelines to ensure cosmic destiny.',
      'Ruler of the celestial courts above deep nebulae.', 'Weaves galaxies on a cosmic loom of quantum strings.',
      'Small but radiates purest divine radiance.', 'Embodies the eternal dance of sun and moon.',
      'Attunes planetary resonant frequencies to universal peace.', 'Twelve distinct forms matching celestial horoscopes.',
      'Shield etched with shimmering constellation maps.', 'Flies faster than light, blessing allies below.',
      'A warrior whose strikes bring instantaneous redemption.', 'Refracts pure light into all spectrums of power.',
      'Her song calms supernova explosions.', 'Bathed in silvery lunar reflections and soothing light.',
      'Controls the celestial flow of historical time.', 'Reborn from astral stardust every million years.',
      'Eternal guardian of the starry gates to paradise.', 'Guards ancient cosmic riddles with unmatched intellect.',
      'Source of illumination for entire galaxy clusters.', 'Ruler of all celestial beings and starry realms.'
    ],
    silhouettes: ['winged', 'biped', 'biped', 'hover', 'winged', 'winged', 'biped', 'winged', 'biped', 'winged', 'biped', 'biped', 'biped', 'biped', 'winged', 'winged', 'robot', 'beast', 'biped', 'biped']
  },
  {
    tier: 10,
    archetype: 'Cosmic Singularity',
    names: [
      'Event Horizon Lord', 'Black Hole Deity', 'Quantum Singularity', 'Spacetime Sovereign', 'Entropy Master',
      'Dark Matter Monolith', 'Graviton Emperor', 'Dimension Breaker', 'Void God Khaos', 'Omniverse Prime',
      'Absolute Zero Paradox', 'Cosmic Genesis', 'Chrono Apex', 'Singularity Drake', 'Infinity Golem',
      'Big Bang Remnant', 'Reality Shaper', 'Tesseract Sovereign', 'Multiverse Overlord', 'The Eternal Alpha-Omega'
    ],
    descriptions: [
      'Nothing, not even light, escapes his gravitational pull.', 'Carries a supermassive black hole at his core.',
      'Exists in all quantum superpositions at once.', 'Can twist spacetime into impossible Möbius geometries.',
      'Accelerates cosmic decay and universal destiny.', 'A towering obelisk carved from primordial dark matter.',
      'Bends planetary gravity fields with a subtle gesture.', 'Shatters the fourth wall and dimensional barriers.',
      'The primordial consciousness before the existence of time.', 'Contains the seed of a trillion parallel universes.',
      'Where thermodynamic laws completely break down.', 'Spark that detonates new cosmic universes.',
      'Exists simultaneously at the beginning and end of time.', 'Its wings span across multiple lightyears of dark space.',
      'Carved from the bedrock of the first cosmic creation.', 'The echoes of cosmic radiation from the dawn of time.',
      'Rearranges atomic matter and physical constants at will.', 'A 4D hyperdimensional entity casting 3D shadows.',
      'Oversees the convergence of infinite timelines.', 'The definitive origin and terminus of all existence.'
    ],
    silhouettes: ['biped', 'elemental', 'hover', 'biped', 'ninja', 'elemental', 'biped', 'robot', 'winged', 'biped', 'hover', 'elemental', 'winged', 'winged', 'robot', 'elemental', 'biped', 'hover', 'biped', 'elemental']
  }
];

// Helper to create the 5 rarity variants for a figure
function createVariants(baseName: string): Record<Rarity, Figure['variants']['common']> {
  return {
    common: {
      rarity: 'common',
      title: `${baseName}`,
      primaryColor: '#9E9E9E',
      accentColor: '#CFD8DC',
      glowColor: 'rgba(158, 158, 158, 0.4)',
      effect: 'none',
    },
    uncommon: {
      rarity: 'uncommon',
      title: `Charged ${baseName}`,
      primaryColor: '#00B0FF',
      accentColor: '#80D8FF',
      glowColor: 'rgba(0, 176, 255, 0.6)',
      effect: 'sparkle',
    },
    rare: {
      rarity: 'rare',
      title: `Overclocked ${baseName}`,
      primaryColor: '#FF9100',
      accentColor: '#FFE082',
      glowColor: 'rgba(255, 145, 0, 0.75)',
      effect: 'flames',
    },
    mythic: {
      rarity: 'mythic',
      title: `Bloodforged ${baseName}`,
      primaryColor: '#FF1744',
      accentColor: '#FF8A80',
      glowColor: 'rgba(255, 23, 68, 0.85)',
      effect: 'lightning',
    },
    legendary: {
      rarity: 'legendary',
      title: `Ascendant Divine ${baseName}`,
      primaryColor: '#FFD700',
      accentColor: '#FFF59D',
      glowColor: 'rgba(255, 215, 0, 0.95)',
      effect: 'cosmic-halo',
    },
  };
}

// Generate the full catalog of 200 Figures
export const ALL_FIGURES: Figure[] = [];
export const FIGURES_BY_TIER: Record<number, Figure[]> = {};

TIER_THEMES.forEach((theme) => {
  FIGURES_BY_TIER[theme.tier] = [];
  theme.names.forEach((name, index) => {
    const id = `t${theme.tier}_fig_${String(index + 1).padStart(2, '0')}`;
    const figure: Figure = {
      id,
      name,
      tier: theme.tier,
      archetype: theme.archetype,
      silhouette: theme.silhouettes[index] || 'biped',
      description: theme.descriptions[index] || `A formidable figure from Tier ${theme.tier}.`,
      variants: createVariants(name),
    };
    ALL_FIGURES.push(figure);
    FIGURES_BY_TIER[theme.tier].push(figure);
  });
});

// Link figure IDs back into CRATE_TIERS
CRATE_TIERS.forEach((tierConfig) => {
  tierConfig.figureIds = (FIGURES_BY_TIER[tierConfig.tier] || []).map((f) => f.id);
});

export const FIGURE_MAP: Record<string, Figure> = {};
ALL_FIGURES.forEach((fig) => {
  FIGURE_MAP[fig.id] = fig;
});
