interface BanlistInfo {
  ban_ocg?: string,
  ban_tcg?: string,
  ban_goat?: string
}

interface CardImages {
  id: number,
  image_url: string,
  image_url_cropped: string,
  image_url_small: string
}

interface CardPrices {
  amazon_price: string,
  cardmarket_price: string,
  coolstuffinc_price: string,
  ebay_price: string,
  tcgplayer_price: string
}

interface CardSets {
  set_code: string,
  set_name: string,
  set_price: string,
  set_rarity: string,
  set_rarity_code: string,
}

interface MiscInfo {
  downvotes: number,
  formats: string[],
  has_effect: number,
  konami_id: number,
  md_rarity: string,
  ocg_date: Date,
  staple?: string,
  tcg_date: Date,
  treated_as: string,
  upvotes: number,
  views: number,
  viewsweek: number
}

export interface YGOCardData {
  archetype?: string,
  atk?: number,
  attribute?: string,
  banlist_info?: BanlistInfo,
  card_images: CardImages[],
  card_prices?: CardPrices[],
  card_sets?: CardSets[],
  def?: number,
  desc: string,
  frameType: string,
  humanReadableCardType: string,
  id: number,
  level?: number,
  linkmarkers?: string[],
  linkval?: number,
  misc_info: MiscInfo[],
  monster_desc?: string,
  name: string,
  pend_desc?: string
  race: string,
  scale?: number
  type: string,
  typeline?: string[],
  ygoprodeck_url: string
}

export interface YGOCards {
  data: YGOCardData[]
}

export interface FilterOptions {
  search: string,
  category: string | undefined,
  monsterCardType: string,
  monsterAbility: string,
  tunerType: string,
  pendulumType: string,
  monsterType: string,
  attribute: string | undefined,
  lvRank: number,
  scale: number,
  linkRating: number,
  linkArrows: string[],
  atk: number,
  def: number,
  spellType: string,
  trapType: string
}