import { NextResponse } from 'next/server'
import { pool } from '../../../../lib/db'

export async function GET(req: Request){
  const url = new URL(req.url)
  const page = Number(url.searchParams.get('page') || '1')
  const pageSize = Number(url.searchParams.get('pageSize') || '30')
  const q = url.searchParams.get('q') || ''

  const offset = (Math.max(1, page) - 1) * pageSize

  const whereClause = q ? 'WHERE ticker ILIKE $1' : ''
  const valuesForRows = q ? [`%${q}%`, pageSize, offset] : [pageSize, offset]

  const rowsSql = `SELECT i10_rank, ticker, i10_score FROM statusinvest_latest_i10_ranking ${whereClause} ORDER BY i10_rank LIMIT $${q?2:1} OFFSET $${q?3:2}`
  const countSql = `SELECT COUNT(*) FROM statusinvest_latest_i10_ranking ${whereClause}`

  const client = await pool.connect()
  try{
    const rowsRes = await client.query(rowsSql, valuesForRows)
    const countRes = await client.query(countSql, q ? [ `%${q}%` ] : [])
    const total = Number(countRes.rows[0].count || 0)
    return NextResponse.json({ rows: rowsRes.rows, total, page, pageSize })
  }catch(e){
    return NextResponse.json({ error: 'db error' }, { status: 500 })
  }finally{ client.release() }
}
