
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';

const Navigation = () => {
  const location = useLocation();
  
  const navItems = [
    { path: '/', label: 'Disparo em Massa' },
    { path: '/extraction', label: 'Extração de Listagens' },
  ];

  return (
    <nav className="flex items-center gap-6">
      {navItems.map((item) => (
        <Link
          key={item.path}
          to={item.path}
          className={cn(
            "text-sm font-medium transition-colors hover:text-whatsapp-primary",
            location.pathname === item.path
              ? "text-whatsapp-primary border-b-2 border-whatsapp-primary pb-1"
              : "text-gray-300"
          )}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
};

export default Navigation;
