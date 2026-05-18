'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('pending');

  return (
    <div className="min-h-screen bg-bgPrimary flex">
      {/* Sidebar */}
      <aside className="w-64 bg-bgSecondary border-r border-borderLight hidden md:flex flex-col">
        <div className="p-6 border-b border-borderLight">
          <h2 className="font-outfit font-bold text-xl text-white">
            ADMIN<span className="text-accentGreen">PANEL</span>
          </h2>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <button 
            onClick={() => setActiveTab('pending')}
            className={`w-full text-left px-4 py-3 rounded flex items-center justify-between ${activeTab === 'pending' ? 'bg-bgTertiary text-accentGreen border border-borderLight' : 'text-textSecondary hover:text-white hover:bg-bgTertiary/50'}`}
          >
            <span>Antrean Event</span>
            <span className="bg-statusWarning text-bgPrimary text-xs font-bold px-2 py-0.5 rounded">3</span>
          </button>
          <button 
            onClick={() => setActiveTab('published')}
            className={`w-full text-left px-4 py-3 rounded ${activeTab === 'published' ? 'bg-bgTertiary text-accentGreen border border-borderLight' : 'text-textSecondary hover:text-white hover:bg-bgTertiary/50'}`}
          >
            Event Aktif
          </button>
          <button 
            onClick={() => setActiveTab('slider')}
            className={`w-full text-left px-4 py-3 rounded ${activeTab === 'slider' ? 'bg-bgTertiary text-accentGreen border border-borderLight' : 'text-textSecondary hover:text-white hover:bg-bgTertiary/50'}`}
          >
            Slider Hero Iklan
          </button>
        </nav>
        <div className="p-4 border-t border-borderLight">
          <button className="w-full px-4 py-2 text-sm text-statusDanger border border-statusDanger/50 rounded hover:bg-statusDanger/10 transition-colors">
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        <header className="h-16 bg-bgSecondary border-b border-borderLight flex items-center justify-between px-6">
          <h1 className="text-xl font-bold">
            {activeTab === 'pending' && 'Antrean Persetujuan Event'}
            {activeTab === 'published' && 'Event Sedang Tayang'}
            {activeTab === 'slider' && 'Manajemen Slider Iklan'}
          </h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-textSecondary">admin@infopelari.id</span>
            <div className="w-8 h-8 rounded-full bg-accentGreen flex items-center justify-center text-bgPrimary font-bold">A</div>
          </div>
        </header>

        <div className="flex-1 overflow-auto p-6">
          
          {/* MOCK DATA: PENDING EVENTS */}
          {activeTab === 'pending' && (
            <div className="bg-bgSecondary rounded-lg border border-borderLight overflow-hidden">
              <table className="w-full text-left text-sm">
                <thead className="bg-bgTertiary text-textSecondary border-b border-borderLight">
                  <tr>
                    <th className="px-6 py-4 font-medium">Nama Event & Tanggal</th>
                    <th className="px-6 py-4 font-medium">Pengirim (Internal)</th>
                    <th className="px-6 py-4 font-medium">Status</th>
                    <th className="px-6 py-4 font-medium text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-borderLight">
                  {/* Row 1 */}
                  <tr className="hover:bg-bgTertiary/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-bold text-white mb-1">Bandung Ultra 100 2026</div>
                      <div className="text-textSecondary text-xs">Mulai: 12 Nov 2026</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-white">Budi Santoso</div>
                      <div className="text-textSecondary text-xs">budi@trailbdg.com | 08123456789</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="bg-statusWarning/20 text-statusWarning border border-statusWarning/30 px-2 py-1 rounded text-xs">Menunggu Review</span>
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <button className="px-3 py-1 bg-bgTertiary border border-borderLight rounded text-white hover:border-accentGreen text-xs">Lihat Detail</button>
                      <button className="px-3 py-1 bg-accentGreen text-bgPrimary font-bold rounded hover:bg-accentYellow shadow-[0_0_10px_rgba(57,255,20,0.2)] text-xs">Approve</button>
                    </td>
                  </tr>
                  
                  {/* Row 2 */}
                  <tr className="hover:bg-bgTertiary/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-bold text-white mb-1">Jakarta Fun Run 5K</div>
                      <div className="text-textSecondary text-xs">Mulai: 05 Okt 2026</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-white">Siti Aminah</div>
                      <div className="text-textSecondary text-xs">siti@eventjkt.id | 08987654321</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="bg-statusWarning/20 text-statusWarning border border-statusWarning/30 px-2 py-1 rounded text-xs">Menunggu Review</span>
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <button className="px-3 py-1 bg-bgTertiary border border-borderLight rounded text-white hover:border-accentGreen text-xs">Lihat Detail</button>
                      <button className="px-3 py-1 bg-accentGreen text-bgPrimary font-bold rounded hover:bg-accentYellow shadow-[0_0_10px_rgba(57,255,20,0.2)] text-xs">Approve</button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}
