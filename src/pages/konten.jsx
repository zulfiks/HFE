import React, { useState, useEffect } from 'react';
import { 
  LucidePlus, LucideEdit, LucideTrash2, LucideExternalLink, LucideX 
} from 'lucide-react';
import './css/admin.css'; // Pastikan file ini ada
import Sidebar from './sidebar.jsx'; // Pastikan file ini ada

function KontenEdukasi() {
  // --- STATE MANAGEMENT ---
  const [artikel, setArtikel] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // State untuk Modal (Pop-up)
  const [showModal, setShowModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false); 
  const [currentId, setCurrentId] = useState(null);
  
  // State untuk Form Input
  const [formData, setFormData] = useState({
    judul: '',
    kategori: 'Pola Makan',
    publikasi: '',
    tautan: ''
  });

  // --- 1. READ: AMBIL DATA DARI SERVER ---
  const fetchKonten = () => {
    setLoading(true);
    fetch('http://127.0.0.1:5000/api/konten')
      .then((res) => res.json())
      .then((data) => {
        setArtikel(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Gagal ambil data:", err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchKonten();
  }, []);

  // --- 2. HANDLER BUKA MODAL ---
  const handleAddNew = () => {
    setIsEdit(false);
    setFormData({ judul: '', kategori: 'Pola Makan', publikasi: '', tautan: '' });
    setShowModal(true);
  };

  const handleEdit = (item) => {
    setIsEdit(true);
    setCurrentId(item.id);
    setFormData({
      judul: item.judul,
      kategori: item.kategori,
      publikasi: item.publikasi, // Pastikan format tanggal YYYY-MM-DD jika pakai input date
      tautan: item.tautan
    });
    setShowModal(true);
  };

  // --- 3. CREATE & UPDATE: SIMPAN DATA ---
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Tentukan URL dan Method (POST untuk baru, PUT untuk edit)
    const url = isEdit 
      ? `http://127.0.0.1:5000/api/konten/${currentId}` 
      : 'http://127.0.0.1:5000/api/konten';
      
    const method = isEdit ? 'PUT' : 'POST';

    fetch(url, {
      method: method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    })
    .then(res => res.json())
    .then(data => {
      alert(isEdit ? "Data berhasil diperbarui!" : "Data berhasil ditambahkan!");
      setShowModal(false); // Tutup modal
      fetchKonten();       // Refresh tabel otomatis
    })
    .catch(err => console.error("Error saving:", err));
  };

  // --- 4. DELETE: HAPUS DATA ---
  const handleHapus = (id) => {
    if (window.confirm('Yakin ingin menghapus data ini selamanya?')) {
      fetch(`http://127.0.0.1:5000/api/konten/${id}`, { method: 'DELETE' })
        .then(res => {
          if (res.ok) {
            alert("Data berhasil dihapus!");
            fetchKonten(); // Refresh tabel
          }
        })
        .catch(err => console.error("Gagal menghapus:", err));
    }
  };

  return (
    <div className="admin-page-container">
      {/* Panggil Komponen Sidebar */}
      <Sidebar />

      <main className="main-content">
        <header className="main-header">
          <h1>Konten Edukasi</h1>
          <button className="add-new-button" onClick={handleAddNew}>
            <LucidePlus size={16} /> Add new
          </button>
        </header>

        <section className="report-table-section">
          {loading ? <p>Memuat data...</p> : (
            <table className="report-table">
              <thead>
                <tr>
                  <th>Judul</th>
                  <th>Kategori</th>
                  <th>Publikasi</th>
                  <th>Tautan</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {artikel.length > 0 ? (
                  artikel.map((item) => (
                    <tr key={item.id}>
                      <td><strong>{item.judul}</strong></td>
                      <td>{item.kategori}</td>
                      <td>{item.publikasi}</td>
                      <td>
                         <a href={item.tautan} target="_blank" rel="noreferrer" className="link-style">
                           Link <LucideExternalLink size={12}/>
                         </a>
                      </td>
                      <td>
                        <div className="action-buttons">
                          <button className="edit-button" onClick={() => handleEdit(item)}>
                            <LucideEdit size={14} /> Edit
                          </button>
                          <button className="delete-button" onClick={() => handleHapus(item.id)}>
                            <LucideTrash2 size={14} /> Hapus
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" style={{ textAlign: 'center', padding:'20px' }}>
                      Belum ada konten edukasi.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </section>

        {/* --- MODAL POP-UP FORM --- */}
        {/* Modal ini hanya muncul jika showModal bernilai true */}
        {showModal && (
          <div className="modal-overlay">
            <div className="modal-content">
              <div className="modal-header">
                <h2>{isEdit ? 'Edit Konten' : 'Tambah Konten Baru'}</h2>
                <button className="close-btn" onClick={() => setShowModal(false)}>
                  <LucideX size={24}/>
                </button>
              </div>
              
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Judul Konten</label>
                  <input 
                    type="text" 
                    required 
                    value={formData.judul}
                    onChange={(e) => setFormData({...formData, judul: e.target.value})}
                    placeholder="Judul artikel..."
                  />
                </div>

                <div className="form-group">
                  <label>Kategori</label>
                  <select 
                    value={formData.kategori}
                    onChange={(e) => setFormData({...formData, kategori: e.target.value})}
                  >
                    <option value="Pola Makan">Pola Makan</option>
                    <option value="Hidup Sehat">Hidup Sehat</option>
                    <option value="Olahraga">Olahraga</option>
                    <option value="Nutrisi">Nutrisi</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Tanggal Publikasi</label>
                  <input 
                    type="date" 
                    required
                    value={formData.publikasi}
                    onChange={(e) => setFormData({...formData, publikasi: e.target.value})}
                  />
                </div>

                <div className="form-group">
                  <label>Link Tautan (URL)</label>
                  <input 
                    type="url" 
                    required
                    value={formData.tautan}
                    onChange={(e) => setFormData({...formData, tautan: e.target.value})}
                    placeholder="https://..."
                  />
                </div>

                <div className="form-actions">
                  <button type="button" className="cancel-btn" onClick={() => setShowModal(false)}>Batal</button>
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

export default KontenEdukasi;