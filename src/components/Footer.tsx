import { Share2, AtSign } from "lucide-react";
import { Link } from "react-router-dom";

export const Footer = () => {
  return (
    <footer className="bg-surface-container-low py-24 px-8 border-t border-surface-container-highest">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center space-y-12 md:space-y-0">
        <div className="flex flex-col gap-4 text-center md:text-left">
          <div className="text-2xl font-bold text-on-background font-headline tracking-tighter">Wayfound</div>
          <div className="text-on-surface-variant font-body text-sm tracking-wide">© 2026 Wayfound.</div>
        </div>
        
        <div className="flex flex-wrap justify-center gap-8">
          {[
            { name: "Privacy", path: "/legal#privacy" },
            { name: "Terms", path: "/legal#terms" },
            { name: "Contact", path: "/legal#contact" }
          ].map((link) => (
            <Link 
              key={link.name} 
              className="text-on-surface-variant hover:text-primary transition-colors font-body text-sm tracking-wide" 
              to={link.path}
            >
              {link.name}
            </Link>
          ))}
        </div>

        <div className="flex gap-4">
          <button className="w-12 h-12 flex items-center justify-center rounded-full bg-surface-container-lowest text-on-surface-variant hover:text-primary transition-colors editorial-shadow">
            <Share2 className="w-5 h-5" />
          </button>
          <button className="w-12 h-12 flex items-center justify-center rounded-full bg-surface-container-lowest text-on-surface-variant hover:text-primary transition-colors editorial-shadow">
            <AtSign className="w-5 h-5" />
          </button>
        </div>
      </div>
    </footer>
  );
};
