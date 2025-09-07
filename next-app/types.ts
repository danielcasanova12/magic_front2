export type ChecklistRow = {
  ticker: string
  earning_yield: number | null
  roic_pct: number | null
  i10_score: number | null
  mf_rank: number | null
  final_rank: number | null
  liquidity: number | null
  market_cap: number | null
}

export type LatestRow = {
  ts_utc: string
  ticker: string
  data: any
}

export type I10Row = {
  i10_rank: number
  ticker: string
  i10_score: number
}
