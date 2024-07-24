export const offerYouCantRefuseDialogue = {
  intro: "You're stopped by a rich looking boy.",
  speaker: "Rich Kid",
  intro_dialogue: `Good day to you.
    $I can't help but notice that your\n{{strongestPokemon}} looks positively divine!
    $I've always wanted to have a pet like that!
    $I'd pay you handsomely, and\nI'll even give you this old bauble!`,
  title: "An Offer You Can't Refuse",
  description: "You're being offered a @[TOOLTIP_TITLE]{Shiny Charm} and {{price, money}} for your {{strongestPokemon}}!\n\nIt's is an extremely good deal, but can you really bear to part with such a strong team member?",
  query: "What will you do?",
  option: {
    1: {
      label: "Accept the Deal",
      tooltip: "(-) Lose {{strongestPokemon}}\n(+) Gain a @[TOOLTIP_TITLE]{Shiny Charm}\n(+) Gain {{price, money}}",
      selected: `Wonderful!@d{32} Come along, {{strongestPokemon}}!
        $It's time to show you off to everyone at the yacht club!
        $They'll be so jealous!`,
    },
    2: {
      label: "Extort the Kid",
      tooltip: "(+) Gain {{price, money}}",
      tooltip_disabled: "Your Pokémon need to have certain moves or abilities to choose this",
      selected: `My word, we're being robbed, Liepard!
       $How wonderful!
       $Now I'll have an amazing\nstory for the yacht club!`,
    },
    3: {
      label: "Leave",
      tooltip: "(-) No Rewards",
      selected: `What a rotten day...
        $Ah, well. Let's return to the yacht club then, Liepard.`,
    }
  },
};
