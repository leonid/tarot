import { majorArcana, minorArcana } from '../decks/rws';

/**
 * What each card's picture shows, for the `alt` text of an image. English is
 * the fallback for every locale. Original wording, written from the public
 * domain scans; it describes the scene, not the card's meaning (meanings live
 * in `src/content/meanings/`). The card's name is added in front when the
 * text is shown, so these do not repeat it.
 *
 * Entries follow the order of the deck: the 22 majors, then wands, cups,
 * swords and pentacles, ace to king. `alt.test.ts` checks the counts.
 */
export const MAJOR_ALT: readonly string[] = [
  'A young traveller in bright clothes steps toward a cliff edge with a white rose in one hand, a bundle on a stick over his shoulder and a small white dog at his heels.',
  'A figure in a white robe raises a wand to the sky and points to the ground, in front of a table with a cup, a sword, a wand and a pentacle, under an infinity sign.',
  'A veiled woman in blue sits between a black and a white pillar with a scroll in her lap and a crescent moon at her feet, pomegranates hanging on the curtain behind.',
  'A crowned woman reclines on cushions in a field of wheat, with a heart-shaped shield beside her and a forest and stream behind.',
  'A bearded king in red robes sits on a stone throne carved with rams’ heads, holding an ankh and an orb, in front of bare mountains.',
  'A robed religious figure sits between two pillars with a hand raised in blessing, two kneeling monks in front of him and two crossed keys at his feet.',
  'A naked man and woman stand under a winged angel in the sun, a tree behind each of them and a mountain between.',
  'An armoured figure under a starry canopy stands in a chariot drawn by two sphinxes, one black and one white, with a walled city behind.',
  'A woman in white, an infinity sign over her head, gently closes the jaws of a lion.',
  'A grey-robed old man on a snowy peak holds up a lantern with a star inside and leans on a staff.',
  'A great wheel marked with letters and symbols turns in the clouds, a snake on one side, a jackal-headed figure on the other and a sphinx on top, with four winged creatures reading books in the corners.',
  'A crowned figure in red sits between two pillars holding a raised sword in one hand and a pair of scales in the other.',
  'A man hangs upside down from a T-shaped tree by one foot, the other leg crossed behind, a halo around his calm face.',
  'A skeleton in black armour rides a white horse and carries a black flag with a white rose, while a bishop prays and people fall before it, a sun rising between two towers behind.',
  'A winged angel with one foot in a pool and one on land pours water between two cups, a path leading to a glowing crown on distant mountains.',
  'A horned, bat-winged figure crouches on a block, with a naked man and woman, both horned and tailed, loosely chained to it by their necks.',
  'Lightning strikes the crown from a tall tower on a crag, flames burst from its windows and two figures fall headfirst.',
  'A naked woman kneels by a pool and pours water from two jugs, one onto the land and one into the pool, under a large star ringed by seven smaller ones.',
  'A full moon with a face shines between two towers over a path where a dog and a wolf howl, a crayfish crawling out of a pool below.',
  'A naked child on a white horse waves a red banner beneath a large sun, in front of a wall of sunflowers.',
  'An angel blows a trumpet from the clouds while naked figures rise from coffins with arms outstretched, over a sea and mountains.',
  'A dancing figure wrapped in a scarf holds two wands inside a large laurel wreath, with a winged human, an eagle, a bull and a lion in the corners.',
];

const WANDS_ALT: readonly string[] = [
  'A hand from a cloud holds a sprouting wooden staff above a green landscape with a distant castle.',
  'A man in a red hat stands on a castle wall holding a globe in one hand and a wand in the other, a second wand fixed beside him, looking out over the sea.',
  'A man seen from behind stands on a cliff holding a wand, two more planted beside him, watching ships on the sea.',
  'Four tall wands are hung with a garland, and in the distance people celebrate in front of a castle.',
  'Five young men wave wands at one another in what looks like a mock fight.',
  'A rider in a laurel wreath on a white horse carries a wreathed wand, with men carrying staves walking beside him.',
  'A man on a hilltop holds a wand and fends off six wands raised from below.',
  'Eight wands fly diagonally through the air above a green landscape and a river.',
  'A bandaged man leans on a wand, watchful, in front of a fence of eight upright wands.',
  'A man struggles along carrying a bundle of ten wands toward a village.',
  'A young man in a patterned tunic stands in a desert holding a wand and studying it, pyramids in the distance.',
  'A knight in armour on a rearing horse holds a wand, with desert and pyramids behind.',
  'A crowned queen sits on a lion-carved throne holding a sunflower and a wand, a black cat at her feet.',
  'A crowned king sits on a throne decorated with lions and salamanders, holding a flowering wand, a salamander near his foot.',
];

const CUPS_ALT: readonly string[] = [
  'A hand from a cloud holds a golden cup overflowing with five streams of water, a dove with a wafer above it and water lilies on a pond below.',
  'A man and a woman face each other and raise their cups, a winged lion’s head above them and a house on a hill behind.',
  'Three women in flowing dresses raise their cups in a toast, among fruit and flowers.',
  'A young man sits under a tree with his arms crossed and three cups in front of him, while a hand from a cloud offers a fourth.',
  'A cloaked figure with head bowed stands before three spilled cups, two upright cups behind him, and a bridge and a castle across the river.',
  'A child hands another child a cup of flowers in a courtyard, with more cups of flowers around them.',
  'A dark figure faces seven cups floating on clouds, each holding a different vision, such as jewels, a snake, a castle and a dragon.',
  'A cloaked figure walks away from eight stacked cups toward mountains under a moon.',
  'A smiling man sits with his arms crossed in front of a curved shelf of nine cups.',
  'A couple embrace under a rainbow of ten cups, two children dancing beside them, a house and a river behind.',
  'A young man in a flowered tunic stands by the sea holding a cup from which a fish looks out.',
  'A knight in armour on a white horse calmly carries a cup, with a river and mountains ahead.',
  'A crowned queen on an ornate throne by the sea gazes at an elaborate closed cup.',
  'A crowned king sits on a throne floating on the sea holding a cup and a sceptre, a ship and a leaping fish nearby.',
];

const SWORDS_ALT: readonly string[] = [
  'A hand from a cloud holds an upright sword crowned with a wreath, above mountains.',
  'A blindfolded woman in white sits holding two crossed swords across her chest, by a calm sea under a crescent moon.',
  'A red heart pierced by three swords hangs against rain clouds.',
  'A knight lies on a tomb with his hands in prayer, three swords hung on the wall above and one beneath, a stained-glass window nearby.',
  'A smirking man gathers swords while two figures walk away dejected by the shore, under a stormy sky.',
  'A ferryman poles a boat carrying a cloaked woman and a child, six swords standing upright in the bow, toward a far shore.',
  'A man tiptoes away from a camp carrying five swords, two more left standing in the ground.',
  'A bound, blindfolded woman stands among eight swords planted around her, water at her feet and a castle on a cliff behind.',
  'A person sits up in bed with their face in their hands, nine swords hung on the dark wall behind.',
  'A man lies face down with ten swords in his back, under a black sky with a bright dawn on the horizon.',
  'A young man stands on a windy hill holding a sword raised in both hands, with clouds and birds behind.',
  'A knight in armour charges on a galloping white horse with his sword raised, through a windswept landscape.',
  'A crowned queen sits on a throne holding a raised sword and extending a hand, with clouds around her.',
  'A crowned king sits facing forward on a throne carved with butterflies, holding an upright sword.',
];

const PENTACLES_ALT: readonly string[] = [
  'A hand from a cloud holds a golden coin marked with a pentacle, above a garden with a flowering archway and mountains beyond.',
  'A young man in a tall hat dances while juggling two pentacle coins joined by an infinity loop, with ships on large waves behind him.',
  'A mason at work on a church arch stands on a bench while a monk and an architect hold up plans.',
  'A crowned man sits holding a pentacle to his chest, with one under each foot and one on his head, a city behind him.',
  'Two ragged people trudge through snow past a lit stained-glass church window showing five pentacles.',
  'A well-dressed merchant holds scales and gives coins to two kneeling beggars.',
  'A young man leans on a hoe and looks at a bush bearing seven pentacles.',
  'A craftsman sits at a bench hammering a pentacle, with finished ones displayed beside him.',
  'A woman in a rich gown stands in a vineyard with a hooded falcon on her glove, pentacles among the vines.',
  'An old man sits with dogs beneath an archway while a couple and a child stand beside him, ten pentacles forming a pattern and a castle behind.',
  'A young man in a field holds up a pentacle and studies it, a ploughed field and trees behind him.',
  'A knight in dark armour sits still on a black horse holding a pentacle, a ploughed field before him.',
  'A crowned queen on a throne in a flowering garden holds a pentacle in her lap, a rabbit nearby.',
  'A crowned king in a robe covered with grapes sits on a throne carved with bulls, holding a sceptre and a pentacle, a castle behind him.',
];

/** Card id to English description; the fallback for every locale. */
export const altEnglish: Readonly<Record<string, string>> = byDeckOrder([
  ...MAJOR_ALT,
  ...WANDS_ALT,
  ...CUPS_ALT,
  ...SWORDS_ALT,
  ...PENTACLES_ALT,
]);

/** Pairs a list in deck order with the card ids. Shared with other locales. */
export function byDeckOrder(
  texts: readonly string[],
): Readonly<Record<string, string>> {
  const cards = [...majorArcana, ...minorArcana];
  return Object.fromEntries(
    cards.flatMap((c, i) => (texts[i] === undefined ? [] : [[c.id, texts[i]]])),
  );
}
