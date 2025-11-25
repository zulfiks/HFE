import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, Users, Utensils, BookOpen, AlertCircle, 
  Edit, X, Save, User, LogOut, ChevronRight 
} from 'lucide-react';
import './css/admin.css'; // Pastikan path CSS benar

function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;

  // State Profil
  const [adminData, setAdminData] = useState({ nama: 'Admin', email: '' });
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ nama: '', password: '' });

  // 1. Ambil Data Profil Saat Dimuat
  useEffect(() => {
    const email = localStorage.getItem('adminEmail');
    if (email) {
      fetch(`http://127.0.0.1:5000/api/admin/profile?email=${email}`)
        .then(res => res.json())
        .then(data => { if (data.nama) setAdminData(data); })
        .catch(err => console.error(err));
    }
  }, []);

  // Handler Klik Profil
  const handleProfileClick = () => {
    setFormData({ nama: adminData.nama, password: '' });
    setShowModal(true);
  };

  // Handler Simpan Profil
  const handleSaveProfile = (e) => {
    e.preventDefault();
    const email = localStorage.getItem('adminEmail');
    fetch('http://127.0.0.1:5000/api/admin/profile', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email_lama: email, nama: formData.nama, password: formData.password })
    })
    .then(res => res.json())
    .then(() => {
      alert("Profil berhasil diperbarui!");
      setAdminData(prev => ({ ...prev, nama: formData.nama }));
      setShowModal(false);
    });
  };

  // Handler Logout
  const handleLogout = () => {
    if(window.confirm("Apakah Anda yakin ingin keluar?")) {
      localStorage.clear(); // Hapus sesi login
      navigate('/logan');
    }
  };

  const isActive = (path) => currentPath === path ? 'active' : '';

  return (
    <>
      <aside className="sidebar">
        {/* 1. HEADER LOGO */}
        <div className="sidebar-header">
          <img src="/assets/healthify logo.png" alt="logo" width="32" />
          <span>Healthify<span style={{color:'#333'}}>Admin</span></span>
        </div>

        {/* 2. MENU UTAMA */}
        <nav className="sidebar-nav">
          <div onClick={() => navigate('/admin')} className={`nav-item ${isActive('/admin')}`}>
            <LayoutDashboard size={20} /> <span>Dashboard</span>
          </div>
          <div onClick={() => navigate('/akun')} className={`nav-item ${isActive('/akun')}`}>
            <Users size={20} /> <span>Manajemen Akun</span>
          </div>
          <div onClick={() => navigate('/konten')} className={`nav-item ${currentPath.startsWith('/konten') ? 'active' : ''}`}>
            <BookOpen size={20} /> <span>Konten Edukasi</span>
          </div>
          <div onClick={() => navigate('/kendala')} className={`nav-item ${isActive('/kendala')}`}>
            <AlertCircle size={20} /> <span>Laporan Kendala</span>
          </div>
          <div onClick={() => navigate('/kelola')} className={`nav-item ${isActive('/kelola-makanan')}`}>
            <Utensils size={20} /> <span>Kelola Makanan</span>
          </div>
        </nav>

        {/* 3. FOOTER PROFIL & LOGOUT */}
        <div className="sidebar-footer">
          <div className="admin-profile" onClick={handleProfileClick} title="Klik untuk edit profil">
            <img 
              src="https://placehold.co/40x40/EFEFEF/0d9488?text=A" 
              alt="avatar" 
              style={{ borderRadius: '10px' }} 
            />
            <div className="admin-info" style={{flex: 1}}>
              <strong>{adminData.nama}</strong>
              <span>Admin <ChevronRight size={12}/></span>
            </div>
          </div>
          
          <div onClick={handleLogout} className="nav-item" style={{color:'#ef4444', marginTop:'5px'}}>
            <LogOut size={20} /> <span>Logout</span>
          </div>
        </div>
      </aside>

      {/* --- MODAL EDIT PROFIL --- */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2 style={{display:'flex', alignItems:'center', gap:'10px', margin:0}}>
                <User size={24} className="text-teal-600"/> Edit Profil
              </h2>
              <button className="close-btn" onClick={() => setShowModal(false)}>
                <X size={24}/>
              </button>
            </div>
            
            <form onSubmit={handleSaveProfile} style={{marginTop:'20px'}}>
              <div className="form-group">
                <label>Nama Lengkap</label>
                <input 
                  type="text" 
                  value={formData.nama} 
                  onChange={(e) => setFormData({...formData, nama: e.target.value})}
                  required 
                />
              </div>
              <div className="form-group">
                <label>Password Baru</label>
                <input 
                  type="password" 
                  placeholder="(Biarkan kosong jika tidak ingin ganti)" 
                  value={formData.password} 
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                />
              </div>
              <div className="form-actions">
                <button type="button" className="cancel-btn" onClick={() => setShowModal(false)}>Batal</button>
                <button type="submit" className="save-btn">
                  <Save size={18}/> Simpan Perubahan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export default Sidebar;