import { useState, useRef, useEffect } from "react";
import { Loader } from "@/app/components/Loader";

type Props = {
  onEdit: () => void;
  onDelete: () => void;
  isDeleting: boolean;
};

export function ClientCardMenu({ onEdit, onDelete, isDeleting }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu on outside click
  useEffect(() => {
    if (!isOpen) return;
    
    const handleClickOutside = (e: MouseEvent | TouchEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);
    
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        className="p-1 -mr-2 rounded-full text-white/60 hover:text-white hover:bg-white/10 transition-colors"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="1" />
          <circle cx="12" cy="5" r="1" />
          <circle cx="12" cy="19" r="1" />
        </svg>
      </button>

      {isOpen && (
        <div
          className="absolute right-0 top-full mt-2 w-48 rounded-2xl bg-slate-800/95 backdrop-blur-xl border border-white/15 shadow-2xl overflow-hidden shadow-black/50 z-50"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex flex-col py-1">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsOpen(false);
                onEdit();
              }}
              className="px-4 py-2.5 text-sm text-left text-white/90 hover:bg-white/10 transition-colors"
            >
              Редагувати
            </button>
            <div className="h-px bg-white/10 mx-2" />
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (!isDeleting) {
                  onDelete();
                }
              }}
              disabled={isDeleting}
              className="px-4 py-2.5 text-sm text-left text-red-400 hover:bg-red-400/10 hover:text-red-300 transition-colors flex items-center justify-center gap-2"
            >
              {isDeleting ? (
                <div className="flex justify-center w-full py-0.5">
                  <Loader className="h-4 w-4 text-red-400" />
                </div>
              ) : (
                <span className="w-full text-left">Видалити</span>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
