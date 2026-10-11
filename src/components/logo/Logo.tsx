// import Image from 'next/image';
import KaryaLogo from './Karya';
import { cn } from '@/lib/utils';
import Tino from './Tino';
const Logo = ({className}: {className?: string;}) => {
  return (
      <div className={cn(className,"relative flex h-2/5 w-max")}>
        {/* Tino logo */}
        <Tino 
          className="relative w-20 h-6 self-center aspect-auto transition-transform duration-300 transform hover:scale-105" />
        {/* Karya logo */}
        <KaryaLogo
          className="self-end h-auto ml-1 transition-transform duration-300 transform w-28 hover:scale-105"
        />
      </div>
  );
};

export default Logo;