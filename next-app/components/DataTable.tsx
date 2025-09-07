"use client"
import { useEffect, useState } from 'react'

type Column = { key: string; label: string; fmt?: (v:any)=>string; isJson?: boolean }

export default function DataTable({ apiPath, columns }: { apiPath: string; columns: Column[] }){
  const [q, setQ] = useState('')
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [sort, setSort] = useState<string|undefined>(undefined)
  const [rows, setRows] = useState<any[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string|undefined>(undefined)

  useEffect(()=>{ fetchData() }, [q,page,pageSize,sort])

  async function fetchData(){
    setLoading(true); setError(undefined)
    try{
      const params = new URLSearchParams()
      params.set('page', String(page))
      params.set('pageSize', String(pageSize))
      if (q) params.set('q', q)
      if (sort) params.set('sort', sort)

      const res = await fetch(`${apiPath}?${params.toString()}`)
      if (!res.ok) throw new Error('bad')
      const data = await res.json()
      setRows(data.rows || [])
      setTotal(data.total || 0)
    }catch(e:any){
      setError('Falha ao carregar dados')
    }finally{ setLoading(false) }
  }

  function toggleSort(colKey:string){
    if (sort===colKey) setSort(colKey+' desc')
    else if (sort===colKey+' desc') setSort(undefined)
    else setSort(colKey)
  }

  return (
    <div>
      <div className="controls">
  <input placeholder="Buscar ticker" value={q} onChange={(e: React.ChangeEvent<HTMLInputElement>)=>{ setQ(e.target.value); setPage(1) }} />
  <select value={pageSize} onChange={(e: React.ChangeEvent<HTMLSelectElement>)=>{ setPageSize(Number(e.target.value)); setPage(1) }}>
          <option value={10}>10</option>
          <option value={30}>30</option>
          <option value={50}>50</option>
        </select>
        <div className="pagination">
          <button onClick={()=>setPage(p=>Math.max(1,p-1))} disabled={page<=1}>Prev</button>
          <span>Page {page}</span>
          <button onClick={()=>setPage(p=>p+1)} disabled={page*pageSize>=total}>Next</button>
        </div>
      </div>

      {loading ? (
        <div className="skeleton" style={{height:200}} />
      ) : error ? (
        <div>
          <div>{error}</div>
          <button onClick={fetchData}>Tentar novamente</button>
        </div>
      ) : rows.length===0 ? (
        <div className="empty">Nada encontrado</div>
      ) : (
        <table className="table">
          <thead>
            <tr>
              {columns.map(c=> (
                <th key={c.key} onClick={()=>toggleSort(c.key)}>{c.label}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r,i)=> (
              <tr key={i}>
                {columns.map(c=> (
                  <td key={c.key}>
                    {c.isJson ? <JsonCell value={r[c.key]} /> : (c.fmt? c.fmt(r[c.key]) : String(r[c.key] ?? ''))}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}

function JsonCell({ value }:{value:any}){
  const [open, setOpen] = useState(false)
  const text = typeof value==='string' ? value : JSON.stringify(value, null, 2)
  return (
    <div>
      <button onClick={()=>setOpen(v=>!v)}>{open? 'ver menos':'ver mais'}</button>
      {open ? <pre className="json-pre">{text}</pre> : <div style={{maxHeight:40,overflow:'hidden'}}>{text}</div>}
    </div>
  )
}
