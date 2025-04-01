
import React, { useEffect, useState } from 'react';
import { useKiosk } from '@/contexts/KioskContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Key, CarFront, Check, Printer, User } from 'lucide-react';

const KeyDeliveryStep: React.FC = () => {
  const { state, resetKiosk } = useKiosk();
  const { selectedVehicle, selectedInsurance, keyReady } = state;
  const [isAnimating, setIsAnimating] = useState(true);
  const [showCompletedScreen, setShowCompletedScreen] = useState(false);
  
  useEffect(() => {
    // Simulate key dispensing process
    if (keyReady) {
      const timer = setTimeout(() => {
        setIsAnimating(false);
        setShowCompletedScreen(true);
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [keyReady]);

  return (
    <div className="space-y-6">
      {!showCompletedScreen ? (
        <>
          <div className="text-center">
            <h2 className="kiosk-title">Your Key is Being Prepared</h2>
            <p className="kiosk-text">
              Please wait while we process your request and dispense your key
            </p>
          </div>
          
          <div className="flex justify-center py-10">
            <div className="relative">
              <div className={`w-32 h-32 rounded-full ${isAnimating ? 'bg-rental-light animate-pulse-slow' : 'bg-green-100'} flex items-center justify-center`}>
                <Key className={`h-16 w-16 ${isAnimating ? 'text-rental-primary' : 'text-green-500'}`} />
              </div>
              
              {isAnimating && (
                <div className="absolute -inset-3">
                  <div className="w-full h-full rounded-full border-4 border-rental-primary border-t-transparent animate-spin"></div>
                </div>
              )}
            </div>
          </div>
          
          <Card className="max-w-md mx-auto">
            <CardContent className="p-6">
              <h3 className="font-semibold text-lg mb-4">Processing your request...</h3>
              <ul className="space-y-3">
                <li className="flex items-center text-green-600">
                  <Check className="h-5 w-5 mr-2" />
                  <span>Booking verification complete</span>
                </li>
                <li className="flex items-center text-green-600">
                  <Check className="h-5 w-5 mr-2" />
                  <span>Vehicle confirmed: {selectedVehicle?.name}</span>
                </li>
                <li className="flex items-center text-green-600">
                  <Check className="h-5 w-5 mr-2" />
                  <span>Insurance selected: {selectedInsurance?.name}</span>
                </li>
                <li className="flex items-center text-green-600">
                  <Check className="h-5 w-5 mr-2" />
                  <span>Payment processed successfully</span>
                </li>
                <li className={`flex items-center ${!isAnimating ? 'text-green-600' : 'text-gray-400'}`}>
                  {!isAnimating ? <Check className="h-5 w-5 mr-2" /> : <div className="h-5 w-5 mr-2" />}
                  <span>Key dispensing {isAnimating ? 'in progress...' : 'complete'}</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </>
      ) : (
        <>
          <div className="text-center">
            <div className="inline-block mb-6 p-3 bg-green-100 rounded-full">
              <Check className="h-16 w-16 text-green-600" />
            </div>
            <h2 className="kiosk-title">Your Key is Ready!</h2>
            <p className="kiosk-text">
              Your key has been dispensed. Please collect it from the tray below.
            </p>
          </div>
          
          <div className="max-w-md mx-auto">
            <Card className="mb-6 border-green-300 bg-green-50">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <CarFront className="h-6 w-6 text-rental-primary mr-3" />
                  <h3 className="font-semibold text-lg">Vehicle Details</h3>
                </div>
                
                {selectedVehicle && (
                  <div className="space-y-1 text-gray-700">
                    <p><strong>Vehicle:</strong> {selectedVehicle.name}</p>
                    <p><strong>Category:</strong> {selectedVehicle.category}</p>
                    <p><strong>Space:</strong> P42 (Row C)</p>
                    <p className="mt-3 text-sm">Follow the signs to Parking Area C to find your vehicle.</p>
                  </div>
                )}
              </CardContent>
            </Card>
            
            <div className="flex flex-col space-y-3">
              <Button className="kiosk-button kiosk-button-primary h-auto py-3" onClick={() => window.print()}>
                <Printer className="mr-2 h-5 w-5" />
                Print Rental Receipt
              </Button>
              
              <Button variant="outline" className="kiosk-button kiosk-button-secondary h-auto py-3" onClick={resetKiosk}>
                <User className="mr-2 h-5 w-5" />
                Start New Rental
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default KeyDeliveryStep;
