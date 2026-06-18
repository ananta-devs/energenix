import React from 'react';
import Lottie from 'lottie-react';
import maintenanceAnimation from '../assets/Maintenance.json';
import {Link} from 'react-router-dom'

const Maintenance = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white px-4">
      <div className="w-full max-w-md mb-8 -ml-18">
        <Lottie 
          animationData={maintenanceAnimation} 
          loop={true} 
          className="w-full h-auto"
        />
      </div>
      
      <div className="text-center max-w-lg">
        <h1 className="text-4xl font-bold text-gray-900 mb-4 font-ubuntu">
          Under Maintenance
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          We're currently performing some scheduled maintenance to improve your experience. 
          We'll be back online shortly!
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <div className="bg-blue-50 px-6 py-3 rounded-full border border-blue-100">
            <p className="text-blue-700 font-medium">
              Thank you for your patience
            </p>
          </div>
          <a 
            href="mailto:energenix.help@gmail.com"
            className="text-gray-500 hover:text-gray-700 transition-colors underline underline-offset-4"
          >
            Need urgent help? Contact us
          </a>
        </div>
      </div>

      <div className="mt-16 text-gray-400 text-sm">
        &copy; {new Date().getFullYear()} EnergeniX. All rights reserved.
      </div>
      <div className="mt-6 text-gray-400 text-sm underline underline-offset-4">
         Build with <Link to="https://dorium.vercel.app/" target='blank'>
                      <span className="text-[#eab60c] hover:text-[#58e417]">
                        Dorium
                      </span>
                    </Link>
      </div>
    </div>
  );
};

export default Maintenance;
