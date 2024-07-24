export const shadyVitaminDealerDialogue = {
  intro: "A man in a dark coat approaches you.",
  speaker: "Shady Salesman",
  intro_dialogue: `.@d{16}.@d{16}.@d{16}
    $I've got the goods if you've got the money.
    $Make sure your Pokémon can handle it though.`,
  title: "The Vitamin Dealer",
  description: "The man opens his jacket to reveal some Pokémon vitamins. The numbers he quotes seem like a really good deal. Almost too good...\nHe offers two package deals to choose from.",
  query: "Which deal will choose?",
  invalid_selection: "Pokémon must be healthy enough.",
  option: {
    1: {
      label: "The Cheap Deal",
      tooltip: "(-) Pay {{option1Money, money}}\n(-) Side Effects?\n(+) Chosen Pokémon Gains 2 Random Vitamins",
      selected: `{{option1PrimaryName}} swims ahead, guiding you back on track.
        \${{option1PrimaryName}} seems to also have gotten stronger in this time of need!`,
    },
    2: {
      label: "The Pricey Deal",
      tooltip: "(-) Pay {{option2Money, money}}\n(-) Side Effects?\n(+) Chosen Pokémon Gains 2 Random Vitamins",
      selected: `{{option2PrimaryName}} flies ahead of your boat, guiding you back on track.
        \${{option2PrimaryName}} seems to also have gotten stronger in this time of need!`,
    },
    3: {
      label: "Leave",
      tooltip: "(-) No Rewards",
      selected: "Heh, wouldn't have figured you for a coward.",
    },
    selected: `The man hands you two bottles and quickly disappears.
    \${{selectedPokemon}} gained {{boost1}} and {{boost2}} boosts!`
  },
  damage_only: `But the medicine had some side effects!
    $Your {{selectedPokemon}} takes some damage...`,
  bad_poison: `But the medicine had some side effects!
    $Your {{selectedPokemon}} takes some damage\nand becomes badly poisoned...`,
  poison: `But the medicine had some side effects!
    $Your {{selectedPokemon}} becomes poisoned...`,
  no_bad_effects: "Looks like there were no side-effects this time.",
};
