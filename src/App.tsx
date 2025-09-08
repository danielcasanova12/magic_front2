import React from 'react'
import './App.css'

export default function App() {
  return (
    <div className="App" style={{padding:20,fontFamily:'Arial, sans-serif'}}>
      <h1>Magic Formula — Front (dev)</h1>
      <p>Este repositório contém um app Vite (este) e um app Next.js em <code>next-app</code>. Para a UI completa rode o Next app:</p>
      <ol>
        <li>cd next-app</li>
        <li>npm install</li>
        <li>npm run dev (vai abrir em http://localhost:3000)</li>
      </ol>

      <p>APIs (quando o Next estiver rodando):</p>
      <ul>
        <li><a href="http://localhost:3000/api/checklist" target="_blank" rel="noreferrer">/api/checklist</a></li>
        <li><a href="http://localhost:3000/api/statusinvest/latest" target="_blank" rel="noreferrer">/api/statusinvest/latest</a></li>
        <li><a href="http://localhost:3000/api/statusinvest/i10_ranking" target="_blank" rel="noreferrer">/api/statusinvest/i10_ranking</a></li>
      </ul>

      <p>Se preferir, eu posso migrar a UI do Next para este projeto Vite ou integrar chamadas diretas ao banco aqui — diga qual opção prefere.</p>
    </div>
  )
}
