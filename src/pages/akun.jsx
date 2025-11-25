import React, { useState, useEffect } from 'react';
import { Search, Trash2, Edit, X, Trophy } from 'lucide-react'; // Tambah ikon Trophy
import './css/admin.css';
import Sidebar from './sidebar.jsx';

function Akun() {
  // ... (State sama seperti sebelumnya) ...
  const [semuaPengguna, setSemuaPengguna] = useState([]);
  const [penggunaTampil, setPenggunaTampil] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  
  // State Modal
  const [showModal, setShowModal] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [formData, setFormData] = useState({
    nama: '', email: '', umur: '', gender: 'Pria', tinggi: '', berat: '', poin: 0
  });

  // 1. FETCH DATA
  const fetchUsers = () => {
    setLoading(true);
    fetch('http://127.0.0.1:5000/api/users')
      .then(res => res.json())
      .then(data => {
        // Urutkan berdasarkan Poin Tertinggi (Leaderboard Style)
        const sortedData = data.sort((a, b) => b.poin - a.poin);
        setSemuaPengguna(sortedData);
        setPenggunaTampil(sortedData);
        setLoading(false);
      })
      .catch(err => console.error("Error:", err));
  };

  useEffect(() => { fetchUsers(); }, []);

  // ... (Handle Edit, Search, Delete biarkan sama, cuma tambah field poin di form) ...
  
  const handleEdit = (user) => {
    setCurrentId(user.id);
    setFormData({
      nama: user.nama, email: user.email, umur: user.umur,
      gender: user.gender, tinggi: user.tinggi, berat: user.berat, 
      poin: user.poin // Load Poin
    });
    setShowModal(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch(`http://127.0.0.1:5000/api/users/${currentId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    }).then(res => { if (res.ok) { alert("User updated!"); setShowModal(false); fetchUsers(); } });
  };

  const handleDelete = (id) => {
    if(window.confirm("Hapus user?")) {
      fetch(`http://127.0.0.1:5000/api/users/${id}`, { method: 'DELETE' })
      .then(() => { alert("Terhapus!"); fetchUsers(); });
    }
  };

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    if (term === '') { setPenggunaTampil(semuaPengguna); } 
    else {
      const filtered = semuaPengguna.filter(u => u.nama.toLowerCase().includes(term));
      setPenggunaTampil(filtered);
    }
  };

  return (
    <div className="admin-page-container">
      <Sidebar />
      <main className="main-content">
        <header className="main-header"><h1>Manajemen Akun (Leaderboard)</h1></header>

        <div className="report-table-section">
          <div className="search-bar-container">
             <Search className="search-icon" size={18} style={{position:'absolute', left:'10px', top:'50%', transform:'translateY(-50%)', color:'#999'}}/>
             <input type="text" placeholder="Cari pengguna..." className="search-input" value={searchTerm} onChange={handleSearch} style={{paddingLeft:'35px'}}/>
          </div>

          {loading ? <p>Memuat...</p> : (
            <table className="report-table">
              <thead>
                <tr>
                  <th>Rank</th>
                  <th>Pengguna</th>
                  <th>Email</th>
                  <th>Fisik (T/B)</th>
                  <th>Poin</th> {/* KOLOM BARU */}
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {penggunaTampil.map((user, index) => (
                  <tr key={user.id}>
                    <td>#{index + 1}</td>
                    <td><strong>{user.nama}</strong><br/><span style={{fontSize:'12px', color:'#888'}}>{user.gender}, {user.umur} thn</span></td>
                    <td>{user.email}</td>
                    <td>{user.tinggi}cm / {user.berat}kg</td>
                    <td>
                      <span style={{display:'flex', alignItems:'center', gap:'5px', color:'#d97706', fontWeight:'bold'}}>
                        <Trophy size={14}/> {user.poin}
                      </span>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button className="edit-button" onClick={() => handleEdit(user)}><Edit size={14}/></button>
                        <button className="delete-button" onClick={() => handleDelete(user.id)}><Trash2 size={14}/></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Modal Edit */}
        {showModal && (
          <div className="modal-overlay">
            <div className="modal-content">
              <div className="modal-header"><h2>Edit User</h2><button className="close-btn" onClick={()=>setShowModal(false)}><X size={24}/></button></div>
              <form onSubmit={handleSubmit}>
                <div className="form-group"><label>Nama</label><input type="text" value={formData.nama} onChange={(e)=>setFormData({...formData, nama:e.target.value})}/></div>
                <div className="form-group"><label>Email</label><input type="email" value={formData.email} onChange={(e)=>setFormData({...formData, email:e.target.value})}/></div>
                
                <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'10px'}}>
                   <div className="form-group"><label>Tinggi</label><input type="number" value={formData.tinggi} onChange={(e)=>setFormData({...formData, tinggi:e.target.value})}/></div>
                   <div className="form-group"><label>Berat</label><input type="number" value={formData.berat} onChange={(e)=>setFormData({...formData, berat:e.target.value})}/></div>
                   <div className="form-group"><label>Umur</label><input type="number" value={formData.umur} onChange={(e)=>setFormData({...formData, umur:e.target.value})}/></div>
                   <div className="form-group"><label>Poin</label><input type="number" value={formData.poin} onChange={(e)=>setFormData({...formData, poin:e.target.value})}/></div>
                </div>

                <div className="form-actions">
                  <button type="button" className="cancel-btn" onClick={()=>setShowModal(false)}>Batal</button>
                  <button type="submit" className="save-btn">Simpan</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
export default Akun;