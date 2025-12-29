import React from 'react';
import { Loader2 } from 'lucide-react';

const FullPageLoader = () => {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md">
            <div className="text-center">
                {/* Animated spinner */}
                <div className="relative">
                    {/* Outer glowing ring */}
                    <div className="absolute inset-0 w-24 h-24 mx-auto">
                        <div className="absolute inset-0 rounded-full border-[3px] border-transparent border-t-blue-500 animate-spin"></div>
                        <div className="absolute inset-0 rounded-full border-[3px] border-transparent border-r-amber-400 animate-spin" style={{ animationDelay: '0.1s' }}></div>
                        <div className="absolute inset-0 rounded-full border-[3px] border-transparent border-b-purple-500 animate-spin" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                    
                    {/* Main spinner */}
                    <Loader2 className="w-24 h-24 text-white mx-auto animate-spin" />
                </div>
            </div>
        </div>
    );
};

export default FullPageLoader;
