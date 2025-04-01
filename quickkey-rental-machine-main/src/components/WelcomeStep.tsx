
import React from 'react';
import { useKiosk } from '@/contexts/KioskContext';
import { Button } from '@/components/ui/button';

const WelcomeStep: React.FC = () => {
  const { nextStep, setLanguage } = useKiosk();
  
  const languages = [
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Español' },
    { code: 'fr', name: 'Français' },
    { code: 'de', name: 'Deutsch' },
    { code: 'it', name: 'Italiano' },
    { code: 'pt', name: 'Português' },
    { code: 'nl', name: 'Nederlands' }
  ];

  const handleLanguageSelect = (langCode: string) => {
    setLanguage(langCode);
    nextStep();
  };

  return (
    <div className="fixed inset-0 w-full h-full overflow-hidden flex flex-col" style={{ fontFamily: 'SF Pro Display, sans-serif' }}>
      {/* Background Image */}
      <div className="absolute inset-0 w-full h-full bg-black">
        <div className="relative w-full h-full bg-cover bg-center" style={{ backgroundImage: 'url(https://i.ibb.co/pjWh4wfd/IMG-20250228-102535.jpg)' }}>
          <div className="absolute inset-0 bg-black/60 z-10"></div>
        </div>
      </div>
      
      {/* Content Overlay */}
      <div className="relative z-20 w-full h-full flex flex-col items-center justify-center">
        {/* Logo & Title */}
        <div className="absolute top-10 left-10">
          <h1 className="text-4xl font-bold text-white mb-2">Key'N'Go</h1>
          <p className="text-white/80">Self-service key collection</p>
        </div>
        
        {/* Language Selection Panel */}
        <div className="absolute right-0 top-0 bottom-0 w-96 bg-black/70 backdrop-blur-sm p-10 flex flex-col items-center justify-center">
          <div className="w-full">
            <h2 className="text-3xl font-semibold text-white text-center mb-8">
              Select Your Language
            </h2>
            
            <div className="grid grid-cols-1 gap-4 w-full">
              {languages.map((lang) => (
                <Button
                  key={lang.code}
                  onClick={() => handleLanguageSelect(lang.code)}
                  className="w-full h-14 text-lg font-medium bg-white/10 hover:bg-white/20 text-white border border-white/20"
                >
                  {lang.name}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomeStep;
