
import React from 'react';
import { useKiosk, getInsuranceOptions, Insurance } from '@/contexts/KioskContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ShieldCheck, Check } from 'lucide-react';

const InsuranceStep: React.FC = () => {
  const { state, setSelectedInsurance, nextStep, prevStep } = useKiosk();
  const { selectedInsurance } = state;
  const insuranceOptions = getInsuranceOptions();

  const handleInsuranceSelect = (insurance: Insurance) => {
    setSelectedInsurance(insurance);
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="kiosk-title">Select Insurance Coverage</h2>
        <p className="kiosk-text">
          Choose the insurance option that best fits your needs
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {insuranceOptions.map((insurance) => (
          <Card 
            key={insurance.id}
            className={`cursor-pointer transition-all duration-200 overflow-hidden hover:shadow-md ${
              selectedInsurance?.id === insurance.id 
                ? 'ring-2 ring-rental-primary border-rental-primary' 
                : 'border-gray-200'
            }`}
            onClick={() => handleInsuranceSelect(insurance)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleInsuranceSelect(insurance);
              }
            }}
            tabIndex={0}
            role="button"
            aria-pressed={selectedInsurance?.id === insurance.id}
            aria-label={`Select ${insurance.name}: ${insurance.description}`}
          >
            <div className="p-4 bg-gradient-to-r from-rental-light to-white border-b flex items-center justify-between">
              <div className="flex items-center">
                <ShieldCheck className="h-6 w-6 text-green-600 mr-2" />
                <h3 className="font-semibold text-lg">{insurance.name}</h3>
              </div>
              {selectedInsurance?.id === insurance.id && (
                <div className="bg-rental-primary rounded-full p-1">
                  <Check className="h-4 w-4 text-white" />
                </div>
              )}
            </div>
            <CardContent className="p-4">
              <p className="text-gray-600 mb-3">{insurance.description}</p>
              
              <div className="space-y-2 mb-4">
                {insurance.coverageDetails.map((detail, index) => (
                  <div key={index} className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span className="text-sm text-gray-700">{detail}</span>
                  </div>
                ))}
              </div>
              
              <div className="mt-4 pt-3 border-t border-gray-200">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Price:</span>
                  <span className="text-lg font-bold text-rental-primary">
                    {insurance.price === 0 ? 'Included' : `€${insurance.price.toFixed(2)}`}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <div className="flex justify-between mt-8">
        <Button onClick={prevStep} variant="outline" className="kiosk-button kiosk-button-secondary">
          Go Back
        </Button>
        <Button 
          onClick={nextStep}
          disabled={!selectedInsurance}
          className="kiosk-button kiosk-button-primary"
        >
          Continue to Summary
        </Button>
      </div>
    </div>
  );
};

export default InsuranceStep;
