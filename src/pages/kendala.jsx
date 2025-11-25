import React, { useState, useEffect } from 'react';
import { Search, ImageIcon } from 'lucide-react'; // Icon Image
import './css/admin.css';
import Sidebar from './sidebar.jsx';

function LaporanKendala() {
  const [laporan, setLaporan] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://127.0.0.1:5000/api/laporan')
      .then(res => res.json())
      .then(data => {
        setLaporan(data);
        setLoading(false);
      })
      .catch(err => setLoading(false));
  }, []);

  return (
    <div className="admin-page-container">
      <Sidebar />
      <main className="main-content">
        <header className="main-header"><h1>Laporan Kendala</h1></header>

        <div className="report-table-section">
          {loading ? <p>Memuat...</p> : (
            <table className="report-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Pengguna</th>
                  <th>Tanggal</th>
                  <th>Deskripsi</th>
                  <th>Bukti</th> {/* Kolom Baru */}
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {laporan.map((item) => (
                  <tr key={item.id}>
                    <td>#{item.id}</td>
                    <td><strong>{item.pengguna}</strong></td>
                    <td>{item.tanggal}</td>
                    <td>{item.deskripsi}</td>
                    <td>
                      {item.image ? (
                        <a href={item.image} target="_blank" rel="noreferrer" style={{color:'#0d9488', display:'flex', gap:'5px', alignItems:'center', textDecoration:'none'}}>
                          <ImageIcon size={16}/> Lihat
                        </a>
                      ) : (
                        <span style={{color:'#999', fontSize:'12px'}}>-</span>
                      )}
                    </td>
                    <td><span className={`status ${item.status.toLowerCase()}`}>{item.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </main>
    </div>
  );
}
export default LaporanKendala;