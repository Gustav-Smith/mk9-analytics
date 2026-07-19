import { Bell, Menu, Search } from 'lucide-react';
import { Breadcrumb } from './Breadcrumb';
import { UserMenu } from './UserMenu';

interface HeaderProps { onMenuToggle: () => void }

export function Header({ onMenuToggle }: HeaderProps) {
  const currentDate = new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date());

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-[#e7e7e3] bg-white/95 px-4 backdrop-blur-md md:px-6">
      <div className="flex items-center gap-3">
        <button aria-label="Abrir menu" onClick={onMenuToggle} className="rounded-md p-1.5 text-[#73736f] hover:bg-[#f3f3f0] lg:hidden"><Menu className="h-4 w-4" /></button>
        <Breadcrumb />
      </div>
      <div className="flex items-center gap-3">
        <div className="relative hidden min-w-[210px] md:block lg:min-w-[260px]">
          <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#9b9b96]" />
          <input type="search" aria-label="Buscar" placeholder="Buscar" className="w-full rounded-md border border-[#deded9] bg-[#fafaf9] py-1.5 pl-9 pr-4 text-xs text-[#1b1b1a] outline-none placeholder:text-[#9b9b96] focus:border-[#aaa9a4]" />
        </div>
        <span className="hidden border-l border-[#e7e7e3] pl-3 text-xs text-[#73736f] xl:block">{currentDate}</span>
        <button aria-label="Notificações" className="rounded-md p-2 text-[#73736f] hover:bg-[#f3f3f0] hover:text-[#1b1b1a]"><Bell className="h-4 w-4" /></button>
        <UserMenu />
      </div>
    </header>
  );
}

export default Header;
