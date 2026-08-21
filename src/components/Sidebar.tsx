"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { LayoutDashboard, Users, Clock, AlertTriangle, Trophy, LogOut, ChevronDown, ChevronRight, Database, FileText, Settings } from 'lucide-react';

export default function Sidebar({ onCloseMobile }: { onCloseMobile?: () => void }) {
  const pathname = usePathname();
  
  const isMasterDataActive = ['/siswa', '/tata-tertib', '/jenis-prestasi', '/pengaturan-waktu'].includes(pathname);
  const isRekapActive = pathname.startsWith('/rekap');
  
  const [isMasterOpen, setIsMasterOpen] = useState(isMasterDataActive);
  const [isRekapOpen, setIsRekapOpen] = useState(isRekapActive);

  // Sync state if pathname changes externally
  useEffect(() => {
    if (['/siswa', '/tata-tertib', '/jenis-prestasi', '/pengaturan-waktu'].includes(pathname)) {
      setIsMasterOpen(true);
    }
    if (pathname.startsWith('/rekap')) {
      setIsRekapOpen(true);
    }
  }, [pathname]);

  const menuItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
    { name: 'Manajemen Akun', icon: Users, path: '/akun' },
    { name: 'Catat Terlambat', icon: Clock, path: '/terlambat' },
    { name: 'Catat Pelanggaran', icon: AlertTriangle, path: '/pelanggaran' },
    { name: 'Catat Prestasi', icon: Trophy, path: '/prestasi' },
  ];

  const masterMenuItems = [
    { name: 'Data Siswa', icon: Users, path: '/siswa' },
    { name: 'Data Tata Tertib', icon: AlertTriangle, path: '/tata-tertib' },
    { name: 'Data Jenis Prestasi', icon: Trophy, path: '/jenis-prestasi' },
    { name: 'Pengaturan Waktu', icon: Settings, path: '/pengaturan-waktu' },
  ];

  const rekapMenuItems = [
    { name: 'Rekap Pelanggaran', icon: AlertTriangle, path: '/rekap/pelanggaran' },
    { name: 'Rekap Keterlambatan', icon: Clock, path: '/rekap/terlambat' },
    { name: 'Rekap Prestasi', icon: Trophy, path: '/rekap/prestasi' },
  ];

  return (
    <div className="w-64 h-full bg-white border-r border-slate-100 flex flex-col shadow-sm">
      <div className="p-6 border-b border-slate-100">
        <h1 className="text-2xl font-bold text-indigo-600 tracking-tight">Sistem Guru Piket</h1>
        <p className="text-sm text-slate-500 mt-1">Layanan Tata Tertib</p>
      </div>
      
      <div className="flex-1 overflow-y-auto">
        <nav className="px-4 py-6 space-y-2">
          {/* Dashboard Item */}
          {(() => {
            const dashboardItem = menuItems[0];
            const isActive = pathname === dashboardItem.path;
            return (
              <Link
                key={dashboardItem.name}
                href={dashboardItem.path}
                onClick={onCloseMobile}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-50 hover:text-indigo-600'
                }`}
              >
                <dashboardItem.icon size={20} className={isActive ? 'text-indigo-600' : ''} />
                <span className="font-medium">{dashboardItem.name}</span>
              </Link>
            )
          })()}

          {/* Master Data Collapsible Menu */}
          <div>
            <button 
              onClick={() => setIsMasterOpen(!isMasterOpen)}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-colors ${
                isMasterDataActive ? 'text-indigo-700' : 'text-slate-600 hover:bg-slate-50 hover:text-indigo-600'
              }`}
            >
              <div className="flex items-center gap-3">
                <Database size={20} className={isMasterDataActive ? 'text-indigo-600' : ''} />
                <span className="font-medium">Data Master</span>
              </div>
              {isMasterOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
            </button>
            
            {isMasterOpen && (
              <div className="mt-1 ml-4 pl-4 border-l-2 border-slate-100 space-y-1">
                {masterMenuItems.map((item) => {
                  const isActive = pathname === item.path;
                  return (
                    <Link
                      key={item.name}
                      href={item.path}
                      onClick={onCloseMobile}
                      className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors text-sm ${
                        isActive ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-50 hover:text-indigo-600'
                      }`}
                    >
                      <item.icon size={18} className={isActive ? 'text-indigo-600' : ''} />
                      <span className="font-medium">{item.name}</span>
                    </Link>
                  )
                })}
              </div>
            )}
          </div>

          {/* Catat Menu Items */}
          {menuItems.slice(1).map((item) => {
            const isActive = pathname === item.path;
            return (
              <Link
                key={item.name}
                href={item.path}
                onClick={onCloseMobile}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-50 hover:text-indigo-600'
                }`}
              >
                <item.icon size={20} className={isActive ? 'text-indigo-600' : ''} />
                <span className="font-medium">{item.name}</span>
              </Link>
            )
          })}

          {/* Rekapitulasi Collapsible Menu */}
          <div>
            <button 
              onClick={() => setIsRekapOpen(!isRekapOpen)}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-colors ${
                isRekapActive ? 'text-indigo-700' : 'text-slate-600 hover:bg-slate-50 hover:text-indigo-600'
              }`}
            >
              <div className="flex items-center gap-3">
                <FileText size={20} className={isRekapActive ? 'text-indigo-600' : ''} />
                <span className="font-medium">Rekapitulasi</span>
              </div>
              {isRekapOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
            </button>
            
            {isRekapOpen && (
              <div className="mt-1 ml-4 pl-4 border-l-2 border-slate-100 space-y-1">
                {rekapMenuItems.map((item) => {
                  const isActive = pathname === item.path;
                  return (
                    <Link
                      key={item.name}
                      href={item.path}
                      onClick={onCloseMobile}
                      className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors text-sm ${
                        isActive ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-50 hover:text-indigo-600'
                      }`}
                    >
                      <item.icon size={18} className={isActive ? 'text-indigo-600' : ''} />
                      <span className="font-medium">{item.name}</span>
                    </Link>
                  )
                })}
              </div>
            )}
          </div>

          <div className="pt-6 mt-6 border-t border-slate-100">
            <Link
              href="/logout"
              className="flex items-center gap-3 px-4 py-3 text-red-500 rounded-lg hover:bg-red-50 transition-colors"
            >
              <LogOut size={20} />
              <span className="font-medium">Logout</span>
            </Link>
          </div>
        </nav>
      </div>
    </div>
  );
}
