import { Bell, HelpCircle, Settings } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <nav className="bg-white border-b border-gray-200 px-6 h-14 flex items-center justify-between sticky top-0 z-40">
      <Link to="/" className="flex items-center gap-1">
        <span className="text-xl font-bold text-brand-text tracking-tight">
          PRD<span className="text-brand-orange font-extrabold">AI</span>Studio
        </span>
      </Link>
      <div className="flex items-center gap-2">
        <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
          <HelpCircle size={18} className="text-brand-muted" />
        </button>
        <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
          <Bell size={18} className="text-brand-muted" />
        </button>
        <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
          <Settings size={18} className="text-brand-muted" />
        </button>
        <div className="w-8 h-8 rounded-full bg-brand-blue flex items-center justify-center ml-1">
          <span className="text-white text-xs font-semibold">A</span>
        </div>
      </div>
    </nav>
  );
}
