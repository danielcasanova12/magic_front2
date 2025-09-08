import { NextResponse } from 'next/server'
import { pool } from '../../../lib/db'

const VALID_SORT_COLUMNS = new Set(['ticker','earning_yield','roic_pct','i10_score','mf_rank','final_rank','liquidity','market_cap'])

export async function GET(req: Request) {
  const url = new URL(req.url)
  const page = Number(url.searchParams.get('page') || '1')
  const pageSize = Number(url.searchParams.get('pageSize') || '30')
  const q = url.searchParams.get('q') || ''
  const sort = url.searchParams.get('sort') || ''

  const offset = (Math.max(1, page) - 1) * pageSize

  // base query
  let orderClause = 'ORDER BY earning_yield DESC NULLS LAST, final_rank ASC'
  if (sort) {
    // support 'col' or 'col desc'
    const parts = sort.split(/\s+/)
    const col = parts[0]
    const dir = (parts[1] || 'asc').toUpperCase() === 'DESC' ? 'DESC' : 'ASC'
    if (VALID_SORT_COLUMNS.has(col)) {
      orderClause = `ORDER BY ${col} ${dir}`
    }
  }

  const whereClause = q ? 'WHERE ticker ILIKE $1' : ''
  const valuesForRows = q ? [`%${q}%`, pageSize, offset] : [pageSize, offset]

  const rowsSql = `SELECT ticker, earning_yield, roic_pct, i10_score, MF_rank as mf_rank, final_rank, liquidity, market_cap FROM ranking_magic_checklist ${whereClause} ${orderClause} LIMIT $${q?2:1} OFFSET $${q?3:2}`

  const countSql = `SELECT COUNT(*) FROM ranking_magic_checklist ${whereClause}`

  const client = await pool.connect()
  try{
    const rowsRes = await client.query(rowsSql, valuesForRows)
    const countRes = await client.query(countSql, q ? [ `%${q}%` ] : [])
    const total = Number(countRes.rows[0].count || 0)
    return NextResponse.json({ rows: rowsRes.rows, total, page, pageSize })
  }catch(e){
    // fallback sample data when DB is unreachable
    const sample = [
      { ticker: 'VALE3', earning_yield: 5.12, roic_pct: 12.3, i10_score: 7, mf_rank: 1, final_rank: 1, liquidity: 1234567.89, market_cap: 5000000000 },
      { ticker: 'ITSA4', earning_yield: 4.5, roic_pct: 10.1, i10_score: 6, mf_rank: 2, final_rank: 2, liquidity: 234567.0, market_cap: 2000000000 },
      { ticker: 'PETR4', earning_yield: 3.2, roic_pct: 8.0, i10_score: 5, mf_rank: 3, final_rank: 3, liquidity: 987654.0, market_cap: 3000000000 }
    ]
    return NextResponse.json({ rows: sample.slice(0, pageSize), total: sample.length, page, pageSize })
  }finally{ client.release() }
}
