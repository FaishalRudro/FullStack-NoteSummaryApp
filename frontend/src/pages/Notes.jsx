import { useState, useEffect } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const CATEGORIES = ['General', 'Work', 'Personal', 'Study', 'Ideas']

export default function Notes() {
  const [notes, setNotes] = useState([])
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [category, setCategory] = useState('General')
  const [search, setSearch] = useState('')
  const [filterCategory, setFilterCategory] = useState('All')
  const [darkMode, setDarkMode] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [editTitle, setEditTitle] = useState('')
  const [editContent, setEditContent] = useState('')
  const [editCategory, setEditCategory] = useState('General')
  const [summarizingId, setSummarizingId] = useState(null)
  const [copied, setCopied] = useState(null)
  const navigate = useNavigate()

  const token = localStorage.getItem('token')
  const headers = { Authorization: `Bearer ${token}` }

  const theme = {
    bg: darkMode ? '#0f0f1a' : '#f0f4f8',
    card: darkMode ? '#1a1a2e' : 'white',
    text: darkMode ? '#e0e0e0' : '#1a1a2e',
    subtext: darkMode ? '#aaa' : '#666',
    input: darkMode ? '#2a2a3e' : 'white',
    inputBorder: darkMode ? '#444' : '#ddd',
    inputText: darkMode ? '#e0e0e0' : '#1a1a2e',
    summaryBg: darkMode ? '#2a2a3e' : '#f0f4f8',
    tagBg: darkMode ? '#3a3a5e' : '#e8eaf6',
  }

  const fetchNotes = async () => {
    try {
      const res = await axios.get('http://localhost:8000/notes', { headers })
      setNotes(res.data)
    } catch {
      navigate('/login')
    }
  }

  useEffect(() => { fetchNotes() }, [])

  const createNote = async () => {
    if (!title.trim() || !content.trim()) return
    await axios.post('http://localhost:8000/notes', { title, content, category }, { headers })
    setTitle('')
    setContent('')
    setCategory('General')
    fetchNotes()
  }

  const deleteNote = async (id) => {
    if (!window.confirm('Delete this note?')) return
    await axios.delete(`http://localhost:8000/notes/${id}`, { headers })
    fetchNotes()
  }

  const startEdit = (note) => {
    setEditingId(note.id)
    setEditTitle(note.title)
    setEditContent(note.content)
    setEditCategory(note.category)
  }

  const saveEdit = async (id) => {
    await axios.put(`http://localhost:8000/notes/${id}`, {
      title: editTitle, content: editContent, category: editCategory
    }, { headers })
    setEditingId(null)
    fetchNotes()
  }

  const togglePin = async (note) => {
    await axios.put(`http://localhost:8000/notes/${note.id}`, { pinned: !note.pinned }, { headers })
    fetchNotes()
  }

  const summarize = async (id) => {
    setSummarizingId(id)
    await axios.post(`http://localhost:8000/notes/${id}/summarize`, {}, { headers })
    await fetchNotes()
    setSummarizingId(null)
  }

  const copyNote = (note) => {
    navigator.clipboard.writeText(`${note.title}\n\n${note.content}`)
    setCopied(note.id)
    setTimeout(() => setCopied(null), 2000)
  }

  const logout = () => {
    localStorage.removeItem('token')
    navigate('/login')
  }

  const filteredNotes = notes.filter(note => {
    const matchSearch = note.title.toLowerCase().includes(search.toLowerCase()) ||
      note.content.toLowerCase().includes(search.toLowerCase())
    const matchCategory = filterCategory === 'All' || note.category === filterCategory
    return matchSearch && matchCategory
  })

  const categoryColors = {
    General: '#6c757d', Work: '#0d6efd', Personal: '#d63384',
    Study: '#198754', Ideas: '#fd7e14'
  }

  const formatDate = (dateStr) => {
    const d = new Date(dateStr)
    return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
  }

  return (
    <div style={{ minHeight: '100vh', background: theme.bg, transition: 'all 0.3s', fontFamily: 'sans-serif' }}>

      {/* Header */}
      <div style={{ background: darkMode ? '#16213e' : '#1a1a2e', color: 'white', padding: '14px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 2px 10px rgba(0,0,0,0.3)' }}>
        <h2 style={{ margin: 0, fontSize: '22px' }}>📝 My Notes</h2>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <span style={{ color: '#aaa', fontSize: '14px' }}>{notes.length} notes</span>
          <button onClick={() => setDarkMode(!darkMode)}
            style={{ padding: '6px 14px', background: 'transparent', color: 'white', border: '1px solid #555', borderRadius: '20px', cursor: 'pointer', fontSize: '14px' }}>
            {darkMode ? '☀️ Light' : '🌙 Dark'}
          </button>
          <button onClick={logout}
            style={{ padding: '6px 14px', background: '#e74c3c', color: 'white', border: 'none', borderRadius: '20px', cursor: 'pointer', fontSize: '14px' }}>
            Logout
          </button>
        </div>
      </div>

      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '24px 16px' }}>

        {/* Search + Filter */}
        <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap' }}>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="🔍 Search notes..."
            style={{ flex: 1, minWidth: '200px', padding: '10px 16px', borderRadius: '8px', border: `1px solid ${theme.inputBorder}`, background: theme.input, color: theme.inputText, fontSize: '15px' }}
          />
          <select value={filterCategory} onChange={e => setFilterCategory(e.target.value)}
            style={{ padding: '10px 16px', borderRadius: '8px', border: `1px solid ${theme.inputBorder}`, background: theme.input, color: theme.inputText, fontSize: '15px', cursor: 'pointer' }}>
            <option value="All">All Categories</option>
            {CATEGORIES.map(c => <option key={c}>{c}</option>)}
          </select>
        </div>

        {/* Create Note */}
        <div style={{ background: theme.card, padding: '20px', borderRadius: '12px', boxShadow: '0 2px 12px rgba(0,0,0,0.08)', marginBottom: '24px' }}>
          <input value={title} onChange={e => setTitle(e.target.value)}
            placeholder="Note title..."
            style={{ width: '100%', padding: '10px', marginBottom: '10px', borderRadius: '8px', border: `1px solid ${theme.inputBorder}`, background: theme.input, color: theme.inputText, fontSize: '15px', boxSizing: 'border-box' }}
          />
          <textarea value={content} onChange={e => setContent(e.target.value)}
            placeholder="Write your note..."
            rows={4}
            style={{ width: '100%', padding: '10px', borderRadius: '8px', border: `1px solid ${theme.inputBorder}`, background: theme.input, color: theme.inputText, fontSize: '15px', boxSizing: 'border-box', resize: 'vertical' }}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px', flexWrap: 'wrap', gap: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ color: theme.subtext, fontSize: '14px' }}>Category:</span>
              <select value={category} onChange={e => setCategory(e.target.value)}
                style={{ padding: '6px 12px', borderRadius: '8px', border: `1px solid ${theme.inputBorder}`, background: theme.input, color: theme.inputText, cursor: 'pointer' }}>
                {CATEGORIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ color: theme.subtext, fontSize: '13px' }}>{content.length} chars</span>
              <button onClick={createNote}
                style={{ padding: '10px 24px', background: '#1a1a2e', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '15px' }}>
                + Add Note
              </button>
            </div>
          </div>
        </div>

        {/* Notes List */}
        {filteredNotes.length === 0 && (
          <p style={{ color: theme.subtext, textAlign: 'center', marginTop: '40px' }}>
            {search ? 'No notes found.' : 'No notes yet. Create one above!'}
          </p>
        )}

        {filteredNotes.map(note => (
          <div key={note.id} style={{
            background: theme.card, padding: '20px', borderRadius: '12px',
            boxShadow: note.pinned ? `0 4px 20px rgba(253,126,20,0.25)` : '0 2px 10px rgba(0,0,0,0.08)',
            marginBottom: '16px', border: note.pinned ? '2px solid #fd7e14' : '2px solid transparent',
            transition: 'all 0.2s'
          }}>

            {editingId === note.id ? (
              /* Edit Mode */
              <div>
                <input value={editTitle} onChange={e => setEditTitle(e.target.value)}
                  style={{ width: '100%', padding: '8px', marginBottom: '8px', borderRadius: '8px', border: `1px solid ${theme.inputBorder}`, background: theme.input, color: theme.inputText, fontSize: '15px', boxSizing: 'border-box' }}
                />
                <textarea value={editContent} onChange={e => setEditContent(e.target.value)}
                  rows={5}
                  style={{ width: '100%', padding: '8px', borderRadius: '8px', border: `1px solid ${theme.inputBorder}`, background: theme.input, color: theme.inputText, fontSize: '15px', boxSizing: 'border-box', resize: 'vertical' }}
                />
                <div style={{ display: 'flex', gap: '8px', marginTop: '10px', alignItems: 'center' }}>
                  <select value={editCategory} onChange={e => setEditCategory(e.target.value)}
                    style={{ padding: '6px 12px', borderRadius: '8px', border: `1px solid ${theme.inputBorder}`, background: theme.input, color: theme.inputText }}>
                    {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                  </select>
                  <button onClick={() => saveEdit(note.id)}
                    style={{ padding: '8px 20px', background: '#2ecc71', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
                    💾 Save
                  </button>
                  <button onClick={() => setEditingId(null)}
                    style={{ padding: '8px 16px', background: '#e74c3c', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              /* View Mode */
              <>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                    {note.pinned && <span style={{ fontSize: '14px' }}>📌</span>}
                    <h3 style={{ margin: 0, color: theme.text, fontSize: '18px' }}>{note.title}</h3>
                    <span style={{
                      padding: '2px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold',
                      background: categoryColors[note.category] + '22',
                      color: categoryColors[note.category]
                    }}>{note.category}</span>
                  </div>
                  <div style={{ display: 'flex', gap: '6px', flexShrink: 0 }}>
                    <button onClick={() => togglePin(note)} title={note.pinned ? 'Unpin' : 'Pin'}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '16px', opacity: note.pinned ? 1 : 0.4 }}>📌</button>
                    <button onClick={() => startEdit(note)} title="Edit"
                      style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '16px' }}>✏️</button>
                    <button onClick={() => copyNote(note)} title="Copy"
                      style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '16px' }}>
                      {copied === note.id ? '✅' : '📋'}
                    </button>
                    <button onClick={() => deleteNote(note.id)} title="Delete"
                      style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '16px' }}>🗑️</button>
                  </div>
                </div>

                <p style={{ color: theme.subtext, margin: '0 0 12px 0', lineHeight: '1.7', whiteSpace: 'pre-wrap' }}>
                  {note.content}
                </p>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', flexWrap: 'wrap', gap: '6px' }}>
                  <span style={{ color: theme.subtext, fontSize: '12px' }}>
                    🕒 {formatDate(note.updated_at)} · {note.content.split(' ').length} words
                  </span>
                </div>

                {note.summary && (
                  <div style={{ background: theme.summaryBg, padding: '12px 16px', borderRadius: '8px', marginBottom: '12px', borderLeft: '3px solid #2ecc71' }}>
                    <strong style={{ color: '#2ecc71', fontSize: '13px' }}>🤖 AI Summary</strong>
                    <p style={{ margin: '6px 0 0 0', color: theme.subtext, fontSize: '14px', lineHeight: '1.6' }}>{note.summary}</p>
                  </div>
                )}

                <button onClick={() => summarize(note.id)} disabled={summarizingId === note.id}
                  style={{ padding: '7px 16px', background: summarizingId === note.id ? '#aaa' : '#2ecc71', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '14px' }}>
                  {summarizingId === note.id ? '⏳ Summarizing...' : '✨ AI Summarize'}
                </button>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}