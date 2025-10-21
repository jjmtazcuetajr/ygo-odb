interface BanlistInfo {
  ban_ocg?: BanStatus
  ban_tcg?: BanStatus
  ban_goat?: BanStatus
}

interface CardImages {
  id: number
  image_url: string
  image_url_cropped: string
  image_url_small: string
}

interface CardPrices {
  amazon_price: string
  cardmarket_price: string
  coolstuffinc_price: string
  ebay_price: string
  tcgplayer_price: string
}

interface CardSets {
  set_code: string
  set_name: string
  set_price: string
  set_rarity: string
  set_rarity_code: string
}

interface MiscInfo {
  downvotes: number
  formats: string[]
  genesys_points: number
  has_effect: number
  konami_id: number
  md_rarity: string
  ocg_date: Date
  staple?: string
  tcg_date: Date
  treated_as: string
  upvotes: number
  views: number
  viewsweek: number
}

export interface YGOCardData {
  archetype?: string
  atk?: number
  attribute?: string
  banlist_info?: BanlistInfo
  card_images: CardImages[]
  card_prices?: CardPrices[]
  card_sets?: CardSets[]
  def?: number
  desc: string
  frameType: string
  humanReadableCardType: string
  id: number
  level?: number
  linkmarkers?: string[]
  linkval?: number
  misc_info: MiscInfo[]
  monster_desc?: string
  name: string
  pend_desc?: string
  race: string
  scale?: number
  type: string
  typeline?: string[]
  ygoprodeck_url: string
}

export interface YGOCards {
  data: YGOCardData[]
}

export interface FilterOptions {
  search: string
  category: CardCategory | undefined
  monsterCardType: string
  monsterAbility: string
  tunerType: string
  pendulumType: string
  monsterType: string
  attribute: string
  level: number | undefined
  rank: number | undefined
  scale: number | undefined
  linkRating: number | undefined
  linkArrows: string[]
  atk: number | undefined
  def: number | undefined
  spellType: string
  trapType: string
  banStatus: BanStatus | 'Unrestricted' | ''
  isGreaterThanZeroGenesysPoints: boolean
  isZeroGenesysPoints: boolean
  exactGenesysPoint: number | undefined
  genesysPointRange: [number, number]
  atkRange: [number, number]
}

export interface LoadingImage {
  pageIndex: number
  imageUrl: string
  status: 'pending' | 'loading' | 'loaded' | 'error'
}

export type CardCategory = 'monster' | 'spell' | 'trap'
export type SortDirection = 'asc' | 'desc'
export type SortByMonsterStat = 'atk' | 'def' | 'level' | 'rank' | 'scale' | 'link-rating'
export type BanStatus = 'Forbidden' | 'Limited' | 'Semi-Limited'
export type Format = 'ocg' | 'tcg' | 'none' | 'genesys'
export type Dropzone = 'main' | 'extra' | 'side'