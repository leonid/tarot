import type { SchoolTable } from '../../domain/types';

/**
 * A. E. Waite's divinatory meanings (The Pictorial Key to the Tarot, 1911,
 * Part III; public domain), restated in original wording. They are older and
 * more predictive than the modern meanings beside them, and Waite himself
 * records where his sources disagree. Source text and policy:
 * docs/research/sources.md. Keys are card ids.
 */
export const waiteMeanings: SchoolTable = {
  'major-00-fool': {
    upright:
      'Folly and excess: enthusiasm that tips into mania, or into giving the game away.',
    reversed:
      'Neglect and absence: carelessness, apathy, things coming to nothing.',
  },
  'major-01-magician': {
    upright:
      'Skill, tact and self-confident will; yet also pain, loss and traps laid by rivals.',
    reversed:
      'A healer or adept; otherwise a troubled mind, disgrace and unrest.',
  },
  'major-02-high-priestess': {
    upright:
      'Secrets and a future not yet shown; silence, persistence, wisdom and learning.',
    reversed:
      'Passion and ardour, conceit, knowledge that stays on the surface.',
  },
  'major-03-empress': {
    upright:
      'Fruitfulness, action and long life; also what is hidden or unknown, with doubt and difficulty.',
    reversed:
      'Light and truth: tangled matters come undone and are celebrated openly; or else wavering.',
  },
  'major-04-emperor': {
    upright:
      'Stability, power and protection; a great person, reason and firm authority.',
    reversed:
      'Kindness, compassion and credit; also rivals thrown into confusion, obstruction, immaturity.',
  },
  'major-05-hierophant': {
    upright:
      'Marriage and alliance, but also bondage and servitude; elsewhere mercy, goodness and inspiration.',
    reversed:
      'Society, good understanding and agreement; kindness carried to the point of weakness.',
  },
  'major-06-lovers': {
    upright: 'Attraction, love and beauty; trials that are overcome.',
    reversed:
      'Failure and unwise plans; a marriage thwarted, things going contrary.',
  },
  'major-07-chariot': {
    upright:
      'Help and providence; also war, triumph, presumption, revenge and trouble.',
    reversed: 'Riot, quarrel and lawsuits; defeat.',
  },
  'major-08-strength': {
    upright:
      'Power, energy, courage and generosity of spirit; complete success and honours.',
    reversed:
      'Tyranny and abuse of power; weakness, discord, at times disgrace.',
  },
  'major-09-hermit': {
    upright:
      'Prudence and caution; but also, markedly, betrayal, concealment and corruption.',
    reversed: 'Concealment and disguise; fear, caution beyond reason.',
  },
  'major-10-wheel-of-fortune': {
    upright: 'Destiny, fortune and success; a rise, luck and happiness.',
    reversed: 'Increase and abundance, to the point of excess.',
  },
  'major-11-justice': {
    upright: 'Fairness and integrity; the deserving side wins at law.',
    reversed:
      'The law in all its machinery: legal tangles, bias, bigotry, undue severity.',
  },
  'major-12-hanged-man': {
    upright:
      'Wisdom and discernment won through trial and sacrifice; intuition and foresight.',
    reversed: 'Selfishness; the crowd and the body politic.',
  },
  'major-13-death': {
    upright:
      'An end: mortality, destruction and decay; the loss of a supporter, or the failure of a hoped-for match.',
    reversed:
      'Inertia, sleep and lethargy; a stone-like stillness, hope destroyed.',
  },
  'major-14-temperance': {
    upright:
      'Economy, moderation and thrift; good management and accommodation.',
    reversed:
      'Matters of church and clergy; also disunion, ill-matched combinations, competing interests.',
  },
  'major-15-devil': {
    upright:
      'Violence, vehemence and extraordinary effort; a fated force that is not, for that reason, evil.',
    reversed: 'An ill fate; weakness, pettiness and blindness.',
  },
  'major-16-tower': {
    upright:
      'Misery, adversity and ruin; disgrace, deception and, above all, sudden catastrophe.',
    reversed:
      'The same in a lesser degree; also oppression, imprisonment, tyranny.',
  },
  'major-17-star': {
    upright:
      'Loss, theft and abandonment; though another reading gives hope and bright prospects.',
    reversed: 'Arrogance and haughtiness; powerlessness.',
  },
  'major-18-moon': {
    upright:
      'Hidden enemies, danger and slander; darkness, fear, deception and error.',
    reversed:
      'Instability and inconstancy; silence; deception and error in smaller measure.',
  },
  'major-19-sun': {
    upright: 'Material happiness, a fortunate marriage, contentment.',
    reversed: 'The same, in a lesser sense.',
  },
  'major-20-judgement': {
    upright:
      'A change of position, renewal, an outcome; by another account, total loss in a lawsuit.',
    reversed:
      'Weakness and faint-heartedness; also deliberation, a decision, a sentence passed.',
  },
  'major-21-world': {
    upright:
      'Assured success and reward; a voyage, emigration, a change of place.',
    reversed: 'Inertia and fixity; stagnation, things staying as they are.',
  },
  'wands-01-ace': {
    upright:
      'Creation, invention, enterprise; a beginning, a source, birth and family; by another account money or inheritance.',
    reversed: 'Fall, decline, ruin; also a joy that is somewhat clouded.',
  },
  'wands-02-two': {
    upright:
      'Two readings that cannot be reconciled: riches, fortune and magnificence, or suffering, sadness and mortification amid the grandeur.',
    reversed: 'Surprise, wonder, enchantment; emotion, trouble, fear.',
  },
  'wands-03-three': {
    upright:
      'Established strength, enterprise, trade and discovery; ships at sea; able help in business.',
    reversed:
      'The end of troubles; adversity, toil and disappointment are suspended or cease.',
  },
  'wands-04-four': {
    upright:
      'Country life and a place of refuge; a harvest home, with rest, concord, prosperity and peace.',
    reversed:
      'Unchanged: prosperity, increase, happiness, beauty, embellishment.',
  },
  'wands-05-five': {
    upright:
      'Mock combat, and the real contest for wealth and fortune, the battle of life; some read gain and opulence.',
    reversed: 'Lawsuits, disputes, trickery, contradiction.',
  },
  'wands-06-six': {
    upright:
      'A victor in triumph; great news carried in state; hope crowned with what it wished for.',
    reversed:
      'Apprehension, as of an enemy at the gate; treachery, disloyalty; indefinite delay.',
  },
  'wands-07-seven': {
    upright:
      'Valour: one holds the high ground against six. Debate, negotiation, trade rivalry; success, since the fighter is on top.',
    reversed:
      'Perplexity, embarrassment, anxiety; a warning against indecision.',
  },
  'wands-08-eight': {
    upright:
      'Activity and swiftness, like an express messenger; haste and hope toward a happy end; the arrows of love.',
    reversed:
      'Arrows of jealousy; inner dispute, pangs of conscience, quarrels at home.',
  },
  'wands-09-nine': {
    upright:
      'Strength in opposition: an attack met boldly; with it delay, suspension, adjournment.',
    reversed: 'Obstacles, adversity, calamity.',
  },
  'wands-10-ten': {
    upright:
      'Oppression above all; also fortune and success, and then the burden of those very things; false appearances and disguise.',
    reversed: 'Contrary turns, difficulties, intrigues.',
  },
  'wands-11-page': {
    upright:
      'A dark young man, faithful: a lover, an envoy, a bearer of family news.',
    reversed:
      'Stories and announcements, bad news; indecision and the instability it brings.',
  },
  'wands-12-knight': {
    upright:
      'Departure, absence, flight; a move of home. A dark, friendly young man.',
    reversed: 'Rupture, division, interruption, discord.',
  },
  'wands-13-queen': {
    upright:
      'A dark countrywoman, friendly, chaste and honourable; also love of money, or some success in business.',
    reversed:
      'Good, thrifty and obliging; in certain company, opposition, jealousy, even deceit and unfaithfulness.',
  },
  'wands-14-king': {
    upright:
      'A dark, friendly countryman, usually married, honest and conscientious; possibly news of an unexpected inheritance.',
    reversed: 'Good but severe; austere, yet tolerant.',
  },
  'cups-01-ace': {
    upright:
      'The home of the true heart: joy, contentment, nourishment, abundance, fertility.',
    reversed: 'The home of the false heart: change, instability, upheaval.',
  },
  'cups-02-two': {
    upright:
      'Love, passion, friendship, affinity; union, concord and sympathy between two.',
    reversed: 'Waite gives no separate reversed reading for this card.',
  },
  'cups-03-three': {
    upright:
      'A matter concluded in plenty and merriment; a happy outcome, victory, fulfilment, comfort and healing.',
    reversed:
      'Speed, dispatch, achievement, an end; also excess in physical enjoyment and the pleasures of the senses.',
  },
  'cups-04-four': {
    upright:
      'Weariness, disgust and aversion, imagined grievances; a fresh offer is held out and brings no comfort. A pleasure that is mixed.',
    reversed: 'Novelty, an omen, new instruction, new relations.',
  },
  'cups-05-five': {
    upright:
      'Loss, though something remains: three spilled, two standing. An inheritance or a marriage that falls short of hopes, not without bitterness.',
    reversed: 'News, alliances, kinship and ancestry; a return; false plans.',
  },
  'cups-06-six': {
    upright:
      'The past and its memories, childhood; happiness that comes from what has gone. Or the reverse: new relations, new knowledge, new surroundings.',
    reversed: 'The future; renewal; what will shortly come to pass.',
  },
  'cups-07-seven': {
    upright:
      'Fairy favours: images of reflection, sentiment and imagination; something attained there, but nothing lasting or solid.',
    reversed: 'Desire, will, determination, a project.',
  },
  'cups-08-eight': {
    upright:
      'The decline of a matter, or something thought important proving slight; other readings give joy, mildness, modesty.',
    reversed: 'Great joy, happiness, feasting.',
  },
  'cups-09-nine': {
    upright:
      'Concord, contentment and bodily well-being; victory, success, satisfaction.',
    reversed:
      'Truth, loyalty, liberty; but readings vary and include mistakes and imperfections.',
  },
  'cups-10-ten': {
    upright:
      "Contentment, the whole heart at rest; human love and friendship perfected; also the querent's home town or country.",
    reversed: 'The false heart at rest; indignation, violence.',
  },
  'cups-11-page': {
    upright:
      'A fair, studious young man, eager to serve; news, a message; application, reflection, meditation.',
    reversed: 'Taste, inclination, attachment; seduction, deception, artifice.',
  },
  'cups-12-knight': {
    upright:
      'Arrival, approach, perhaps of a messenger; advances, a proposal, an invitation.',
    reversed: 'Trickery, artifice, subtlety; swindling and fraud.',
  },
  'cups-13-queen': {
    upright:
      'A good, fair, devoted woman who will help; loving intelligence and so the gift of vision; happiness, wisdom, a perfect wife and mother.',
    reversed:
      'Accounts differ: a good woman, or a distinguished one who cannot be trusted; vice and dishonour.',
  },
  'cups-14-king': {
    upright:
      'A fair man of business, law or the church, responsible and ready to help; fairness, art and science, creative intelligence.',
    reversed:
      'A dishonest, double-dealing man; roguery, injustice, scandal, considerable loss.',
  },
  'swords-01-ace': {
    upright:
      'Triumph and conquest, the extreme degree of everything; great force, in love as in hatred.',
    reversed:
      'The same, with disastrous results; another account says conception, childbirth, increase.',
  },
  'swords-02-two': {
    upright:
      'Balance and conformity; courage, friendship, concord under arms; another reading gives tenderness and intimacy. Favourable senses hold only with reserve.',
    reversed: 'Imposture, falsehood, duplicity, disloyalty.',
  },
  'swords-03-three': {
    upright:
      'Removal, absence, delay; division, rupture, dispersal, and all that the picture plainly shows.',
    reversed:
      'A mind estranged; error, loss, distraction, disorder, confusion.',
  },
  'swords-04-four': {
    upright:
      "Vigilance, retreat, solitude, a hermit's rest; exile, the tomb and coffin.",
    reversed:
      'Wise administration, circumspection, economy; also avarice, precaution, a will.',
  },
  'swords-05-five': {
    upright: 'Degradation, destruction, reversal, infamy, dishonour, loss.',
    reversed: 'The same; burial and funeral rites.',
  },
  'swords-06-six': {
    upright:
      'A journey by water; a route, a way; an envoy, an agent, an expedient.',
    reversed:
      'A declaration, a confession, publicity; one account says a proposal of love.',
  },
  'swords-07-seven': {
    upright:
      'A design, an attempt, a wish, hope and confidence; also quarrelling, a plan that may fail, annoyance. The readings disagree widely.',
    reversed: 'Good advice, counsel, instruction; also slander and babbling.',
  },
  'swords-08-eight': {
    upright:
      'Bad news, sharp distress, crisis, censure; power held in bonds; conflict, slander, also sickness.',
    reversed:
      'Unrest, difficulty, opposition, accident, treachery; the unforeseen; fatality.',
  },
  'swords-09-nine': {
    upright:
      'Death, failure, miscarriage, delay; deception, disappointment, despair.',
    reversed: 'Imprisonment, suspicion, doubt, well-founded fear, shame.',
  },
  'swords-10-ten': {
    upright:
      'What the picture shows; pain, affliction, tears, sadness and desolation. Not especially a card of violent death.',
    reversed:
      'Advantage, profit, success and favour, none of it lasting; also power and authority.',
  },
  'swords-11-page': {
    upright:
      'Authority and overseeing; vigilance, secret service, spying, examination.',
    reversed:
      'The worse side of those qualities; the unforeseen, being unprepared; sickness is hinted.',
  },
  'swords-12-knight': {
    upright:
      'Skill, bravery and capacity; also enmity, wrath, war and ruin. Beside other fatal cards it can speak of death.',
    reversed: 'Imprudence, incapacity, extravagance.',
  },
  'swords-13-queen': {
    upright:
      "Widowhood and a woman's sorrow; absence, sterility, mourning, privation, separation.",
    reversed: 'Malice, bigotry, artifice, prudery, deceit.',
  },
  'swords-14-king': {
    upright:
      'All that follows from the idea of judgment: power, command, authority, militant intelligence, law and the offices of the crown.',
    reversed: 'Cruelty, perversity, barbarity, bad faith, evil intent.',
  },
  'pentacles-01-ace': {
    upright:
      'Perfect contentment, happiness, ecstasy; quick intelligence; gold.',
    reversed:
      "The evil side of wealth, poor judgment; also great riches. Prosperity either way; whether it does its owner good depends on the card's direction.",
  },
  'pentacles-02-two': {
    upright:
      'Gaiety and recreation, as the picture shows; also news and messages in writing; obstacles, agitation, trouble.',
    reversed:
      'Forced gaiety, pretended enjoyment; the literal sense, handwriting, composition, bills of exchange.',
  },
  'pentacles-03-three': {
    upright:
      'A trade, skilled labour; more usually read as nobility, aristocracy, renown and glory.',
    reversed:
      'Mediocrity in work and otherwise; childishness, pettiness, weakness.',
  },
  'pentacles-04-four': {
    upright:
      'Possessions made sure; holding fast to what one has; a gift, legacy or inheritance.',
    reversed: 'Suspense, delay, opposition.',
  },
  'pentacles-05-five': {
    upright:
      'Material trouble above all, destitution or otherwise; for some readers a card of love and lovers, of affinity. The two cannot be reconciled.',
    reversed: 'Disorder, chaos, ruin, discord, profligacy.',
  },
  'pentacles-06-six': {
    upright:
      'Presents, gifts, gratification; or attention and vigilance; now is the favourable time, present prosperity.',
    reversed: 'Desire, greed, envy, jealousy, illusion.',
  },
  'pentacles-07-seven': {
    upright:
      'Contradictory: chiefly money, business and barter; but one reading gives quarrel, another innocence and ingenuity.',
    reversed: 'Anxiety over money that one may be asked to lend.',
  },
  'pentacles-08-eight': {
    upright:
      'Work, employment, a commission; craftsmanship and skill in craft and business, perhaps still in preparation.',
    reversed:
      'Ambition come to nothing; vanity, greed, usury; or skill turned to cunning and intrigue.',
  },
  'pentacles-09-nine': {
    upright:
      'Prudence, safety, success, accomplishment; certainty and discernment.',
    reversed: 'Roguery, deception, a plan come to nothing, bad faith.',
  },
  'pentacles-10-ten': {
    upright:
      'Gain and riches; family matters, records and lineage, the family home.',
    reversed:
      'Chance, fatality, loss, robbery, gambling; sometimes a gift, dowry or pension.',
  },
  'pentacles-11-page': {
    upright:
      'Application, study, scholarship, reflection; or news and its bringer; also rule and management.',
    reversed:
      'Prodigality, dissipation, liberality, luxury; unfavourable news.',
  },
  'pentacles-12-knight': {
    upright:
      'Usefulness, serviceableness, interest, responsibility and uprightness, all on the ordinary outward plane.',
    reversed:
      'Inertia, idleness, stagnation; also placidity, discouragement, carelessness.',
  },
  'pentacles-13-queen': {
    upright: 'Opulence, generosity, magnificence; security and liberty.',
    reversed: 'Evil, suspicion, suspense, fear, mistrust.',
  },
  'pentacles-14-king': {
    upright:
      'Valour, practical intelligence, business and mathematical gifts, and success in these.',
    reversed: 'Vice, weakness, perversity, peril.',
  },
};
