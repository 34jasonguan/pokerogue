import { Type } from "#app/data/type";
import { ModifierRewardPhase } from "#app/phases";
import { isNullOrUndefined, randSeedInt } from "#app/utils";
import { MysteryEncounterType } from "#enums/mystery-encounter-type";
import { Species } from "#enums/species";
import BattleScene from "../../../battle-scene";
import { modifierTypes } from "#app/modifier/modifier-type";
import { getPokemonSpecies } from "../../pokemon-species";
import IMysteryEncounter, { MysteryEncounterBuilder, MysteryEncounterTier, } from "../mystery-encounter";
import { EncounterOptionMode, MysteryEncounterOptionBuilder } from "../mystery-encounter-option";
import { EnemyPartyConfig, EnemyPokemonConfig, initBattleWithEnemyConfig, leaveEncounterWithoutBattle, } from "../utils/encounter-phase-utils";
import { getRandomPlayerPokemon, getRandomSpeciesByStarterTier } from "#app/data/mystery-encounters/utils/encounter-pokemon-utils";

/** i18n namespace for encounter */
const namespace = "mysteryEncounter:darkDeal";

/** Exclude Ultra Beasts (inludes Cosmog/Solgaleo/Lunala/Necrozma), Paradox (includes Miraidon/Koraidon), Eternatus, and egg-locked mythicals */
const excludedBosses = [
  Species.NECROZMA,
  Species.COSMOG,
  Species.COSMOEM,
  Species.SOLGALEO,
  Species.LUNALA,
  Species.ETERNATUS,
  Species.NIHILEGO,
  Species.BUZZWOLE,
  Species.PHEROMOSA,
  Species.XURKITREE,
  Species.CELESTEELA,
  Species.KARTANA,
  Species.GUZZLORD,
  Species.POIPOLE,
  Species.NAGANADEL,
  Species.STAKATAKA,
  Species.BLACEPHALON,
  Species.GREAT_TUSK,
  Species.SCREAM_TAIL,
  Species.BRUTE_BONNET,
  Species.FLUTTER_MANE,
  Species.SLITHER_WING,
  Species.SANDY_SHOCKS,
  Species.ROARING_MOON,
  Species.KORAIDON,
  Species.WALKING_WAKE,
  Species.GOUGING_FIRE,
  Species.RAGING_BOLT,
  Species.IRON_TREADS,
  Species.IRON_BUNDLE,
  Species.IRON_HANDS,
  Species.IRON_JUGULIS,
  Species.IRON_MOTH,
  Species.IRON_THORNS,
  Species.IRON_VALIANT,
  Species.MIRAIDON,
  Species.IRON_LEAVES,
  Species.IRON_BOULDER,
  Species.IRON_CROWN,
  Species.MEW,
  Species.CELEBI,
  Species.DEOXYS,
  Species.JIRACHI,
  Species.PHIONE,
  Species.MANAPHY,
  Species.ARCEUS,
  Species.VICTINI,
  Species.MELTAN,
  Species.PECHARUNT,
];

/**
 * Dark Deal encounter.
 * @see {@link https://github.com/AsdarDevelops/PokeRogue-Events/issues/61 | GitHub Issue #61}
 * @see For biome requirements check {@linkcode mysteryEncountersByBiome}
 */
export const DarkDealEncounter: IMysteryEncounter =
  MysteryEncounterBuilder.withEncounterType(MysteryEncounterType.DARK_DEAL)
    .withEncounterTier(MysteryEncounterTier.ROGUE)
    .withIntroSpriteConfigs([
      {
        spriteKey: "mad_scientist_m",
        fileRoot: "mystery-encounters",
        hasShadow: true,
      },
      {
        spriteKey: "dark_deal_porygon",
        fileRoot: "mystery-encounters",
        hasShadow: true,
        repeat: true,
      },
    ])
    .withIntroDialogue([
      {
        text: `${namespace}:intro`,
      },
      {
        speaker: `${namespace}:speaker`,
        text: `${namespace}:intro_dialogue`,
      },
    ])
    .withSceneWaveRangeRequirement(30, 180) // waves 30 to 180
    .withScenePartySizeRequirement(2, 6) // Must have at least 2 pokemon in party
    .withCatchAllowed(true)
    .withTitle(`${namespace}:title`)
    .withDescription(`${namespace}:description`)
    .withQuery(`${namespace}:query`)
    .withOption(
      new MysteryEncounterOptionBuilder()
        .withOptionMode(EncounterOptionMode.DEFAULT)
        .withDialogue({
          buttonLabel: `${namespace}:option:1:label`,
          buttonTooltip: `${namespace}:option:1:tooltip`,
          selected: [
            {
              speaker: `${namespace}:speaker`,
              text: `${namespace}:option:1:selected_dialogue`,
            },
            {
              text: `${namespace}:option:1:selected_message`,
            },
          ],
        })
        .withPreOptionPhase(async (scene: BattleScene) => {
          // Removes random pokemon (including fainted) from party and adds name to dialogue data tokens
          // Will never return last battle able mon and instead pick fainted/unable to battle
          const removedPokemon = getRandomPlayerPokemon(scene, false, true);
          scene.removePokemonFromPlayerParty(removedPokemon);

          scene.currentBattle.mysteryEncounter.setDialogueToken("pokeName", removedPokemon.name);

          // Store removed pokemon types
          scene.currentBattle.mysteryEncounter.misc = [
            removedPokemon.species.type1,
          ];
          if (removedPokemon.species.type2) {
            scene.currentBattle.mysteryEncounter.misc.push(removedPokemon.species.type2);
          }
        })
        .withOptionPhase(async (scene: BattleScene) => {
          // Give the player 5 Rogue Balls
          scene.unshiftPhase(new ModifierRewardPhase(scene, modifierTypes.ROGUE_BALL));

          // Start encounter with random legendary (7-10 starter strength) that has level additive
          const bossTypes = scene.currentBattle.mysteryEncounter.misc as Type[];
          // Starter egg tier, 35/50/10/5 %odds for tiers 6/7/8/9+
          const roll = randSeedInt(100);
          const starterTier: number | [number, number] =
            roll > 65 ? 6 : roll > 15 ? 7 : roll > 5 ? 8 : [9, 10];
          const bossSpecies = getPokemonSpecies(getRandomSpeciesByStarterTier(starterTier, excludedBosses, bossTypes));
          const pokemonConfig: EnemyPokemonConfig = {
            species: bossSpecies,
            isBoss: true,
          };
          if (!isNullOrUndefined(bossSpecies.forms) && bossSpecies.forms.length > 0) {
            pokemonConfig.formIndex = 0;
          }
          const config: EnemyPartyConfig = {
            pokemonConfigs: [pokemonConfig],
          };
          return initBattleWithEnemyConfig(scene, config);
        })
        .build()
    )
    .withSimpleOption(
      {
        buttonLabel: `${namespace}:option:2:label`,
        buttonTooltip: `${namespace}:option:2:tooltip`,
        selected: [
          {
            speaker: `${namespace}:speaker`,
            text: `${namespace}:option:2:selected`,
          },
        ],
      },
      async (scene: BattleScene) => {
        // Leave encounter with no rewards or exp
        leaveEncounterWithoutBattle(scene, true);
        return true;
      }
    )
    .withOutroDialogue([
      {
        text: `${namespace}:outro`
      }
    ])
    .build();
