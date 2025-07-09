import { CircleDollarSign } from 'lucide-react';
import { PropsWithChildren } from 'react';

export default function Guest({ children }: PropsWithChildren) {
    return (
        <div className="flex min-h-screen flex-col items-center bg-gray-100 pt-6 sm:justify-center sm:pt-0">
            <div>
                <div className="container flex h-16 gap-2 items-center">
                    <div className="relative flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-green-600 to-green-400 shadow-lg">
                        <CircleDollarSign className="h-6 w-6 text-white drop-shadow-md absolute transform -translate-y-[1px]" />
                        <div className="absolute inset-0 rounded-lg bg-white/10 backdrop-blur-[1px] opacity-20"></div>
                    </div>
                    <span className="text-xl font-medium tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-green-400 drop-shadow-sm">CHAPA</span>
                </div>
            </div>
            <div className="mt-6 w-full overflow-hidden bg-white px-6 py-4 shadow-md sm:max-w-md sm:rounded-lg">
                {children}
            </div>
        </div>
    );
}
