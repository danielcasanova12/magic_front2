"use client"
import React, { useState } from 'react'
import DataTable from '../components/DataTable'

export default function Page() {
  const [tab, setTab] = useState<'checklist'|'latest'|'i10'>('checklist')

  return (
    <div className="container">
      <h1>Magic - Minimal</h1>

      <div className="tabs">
        <button className={`tab ${tab==='checklist'? 'active':''}`} onClick={()=>setTab('checklist')}>Checklist</button>
        <button className={`tab ${tab==='latest'? 'active':''}`} onClick={()=>setTab('latest')}>StatusInvest (latest)</button>
        <button className={`tab ${tab==='i10'? 'active':''}`} onClick={()=>setTab('i10')}>Ranking I10</button>
      </div>

      {tab === 'checklist' && (
        <DataTable
          apiPath="/api/checklist"
          columns={[
            { key: 'ticker', label: 'Ticker' },
            { key: 'earning_yield', label: 'Earning Yield', fmt: (v:any)=>formatPct(v) },
            { key: 'roic_pct', label: 'ROIC', fmt: (v:any)=>formatPct(v) },
            { key: 'i10_score', label: 'I10' },
            { key: 'mf_rank', label: 'MF Rank' },
            { key: 'final_rank', label: 'Final Rank' },
            { key: 'liquidity', label: 'Liquidity', fmt: (v:any)=>formatMoney(v) },
            { key: 'market_cap', label: 'Market Cap', fmt: (v:any)=>formatMoney(v) }
          ]}
        />
      )}

      {tab === 'latest' && (
        <DataTable
          apiPath="/api/statusinvest/latest"
          columns={[
            { key: 'ts_utc', label: 'TS' },
            { key: 'ticker', label: 'Ticker' },
            { key: 'data', label: 'Data', isJson: true }
          ]}
        />
      )}

      {tab === 'i10' && (
        <DataTable
          apiPath="/api/statusinvest/i10_ranking"
          columns={[
            { key: 'i10_rank', label: 'Rank' },
            { key: 'ticker', label: 'Ticker' },
            { key: 'i10_score', label: 'I10 Score' }
          ]}
        />
      )}
    </div>
  )
}

function formatPct(v:any){
  if (v==null) return ''
  const n = Number(v)
  return n.toFixed(2) + '%'
}

function formatMoney(v:any){
  if (v==null) return ''
  const n = Number(v)
  return n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}
