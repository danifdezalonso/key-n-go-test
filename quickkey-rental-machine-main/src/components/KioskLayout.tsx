
import React from 'react';
import { useKiosk } from '@/contexts/KioskContext';
import { Car, Calendar, CreditCard, Key, ShieldCheck, Video, Globe } from 'lucide-react';

interface KioskLayoutProps {
  children: React.ReactNode;
}

const KioskLayout: React.FC<KioskLayoutProps> = ({ children }) => {
  const { state, goToStep } = useKiosk();
  const { currentStep } = state;

  const steps = [
    { number: 1, name: 'Welcome', icon: <Video className="w-5 h-5" /> },
    { number: 2, name: 'Verification', icon: <Calendar className="w-5 h-5" /> },
    { number: 3, name: 'Vehicle', icon: <Car className="w-5 h-5" /> },
    { number: 4, name: 'Insurance', icon: <ShieldCheck className="w-5 h-5" /> },
    { number: 5, name: 'Summary', icon: <Globe className="w-5 h-5" /> },
    { number: 6, name: 'Payment', icon: <CreditCard className="w-5 h-5" /> },
    { number: 7, name: 'Key Pickup', icon: <Key className="w-5 h-5" /> },
  ];

  const handleStepClick = (stepNumber: number) => {
    // Only allow clicking on steps that have been completed or the current step
    if (stepNumber <= currentStep) {
      goToStep(stepNumber);
    }
  };

  return (
    <div className="min-h-screen flex flex-col px-4 py-8 bg-gray-100">
      <header className="mb-8">
        <div className="container mx-auto">
          <h1 className="text-3xl font-bold text-gray-800">Key'N'Go</h1>
          <p className="text-gray-600">Self-service key collection</p>
        </div>
      </header>

      <div className="container mx-auto mb-8">
        <div className="flex items-center justify-between px-4 lg:px-6 mb-2">
          {steps.map((step, index) => (
            <React.Fragment key={step.number}>
              <div 
                className="flex flex-col items-center"
                onClick={() => handleStepClick(step.number)}
                style={{ cursor: step.number <= currentStep ? 'pointer' : 'default' }}
                role="button"
                tabIndex={step.number <= currentStep ? 0 : -1}
                aria-label={`Go to ${step.name} step`}
                aria-current={currentStep === step.number ? 'step' : undefined}
              >
                <div 
                  className={`
                    kiosk-progress-step
                    ${currentStep === step.number ? 'kiosk-progress-step-active' : ''}
                    ${currentStep > step.number ? 'kiosk-progress-step-completed' : ''}
                    ${currentStep < step.number ? 'kiosk-progress-step-pending' : ''}
                  `}
                >
                  {currentStep > step.number ? (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    step.icon
                  )}
                </div>
                <span className={`text-xs mt-1 ${currentStep === step.number ? 'text-rental-primary font-medium' : 'text-gray-500'}`}>
                  {step.name}
                </span>
              </div>
              
              {index < steps.length - 1 && (
                <div 
                  className={`kiosk-progress-connector ${
                    currentStep > index + 1 ? 'kiosk-progress-connector-active' : ''
                  }`}
                />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      <main className="flex-grow flex flex-col items-center justify-center">
        <div className="kiosk-container w-full">
          {children}
        </div>
      </main>

      <footer className="mt-8">
        <div className="container mx-auto">
          <div className="text-center text-gray-500 text-sm">
            <p>© 2023 Key'N'Go. Need assistance? Call our 24/7 help line: 0800-123-4567</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default KioskLayout;
