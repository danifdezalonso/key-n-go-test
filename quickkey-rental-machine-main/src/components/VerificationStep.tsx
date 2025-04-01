
import React, { useState } from 'react';
import { useKiosk } from '@/contexts/KioskContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { CalendarIcon, QrCode } from 'lucide-react';
import { format } from 'date-fns';

import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const VerificationStep: React.FC = () => {
  const { state, setRentalNumber, setBirthDate, nextStep } = useKiosk();
  const { rentalNumber, birthDate } = state;
  const [errors, setErrors] = useState({ rentalNumber: '', birthDate: '' });
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('manual');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate inputs
    const newErrors = { rentalNumber: '', birthDate: '' };
    let hasError = false;
    
    if (!rentalNumber) {
      newErrors.rentalNumber = 'Reservation number is required';
      hasError = true;
    } else if (!/^[A-Z0-9]{6,10}$/.test(rentalNumber)) {
      newErrors.rentalNumber = 'Please enter a valid reservation number (6-10 alphanumeric characters)';
      hasError = true;
    }
    
    if (!birthDate) {
      newErrors.birthDate = 'Birth date is required';
      hasError = true;
    }
    
    setErrors(newErrors);
    
    if (hasError) return;
    
    // Simulate checking with backend
    toast({
      title: "Verification successful",
      description: "Your details have been verified",
    });
    
    nextStep();
  };

  const handleQrScan = () => {
    // Simulate QR scanning
    setRentalNumber('QR123456');
    setBirthDate(new Date('1990-01-01').toISOString());
    
    toast({
      title: "QR Code Scanned",
      description: "Reservation details retrieved successfully",
    });
    
    // You could automatically proceed here, but we'll let the user confirm
    // nextStep();
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="kiosk-title">Verify Your Reservation</h2>
        <p className="kiosk-text">
          Please verify your identity to access your reservation
        </p>
      </div>
      
      <Tabs defaultValue="manual" className="w-full max-w-md mx-auto" onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="manual">Manual Entry</TabsTrigger>
          <TabsTrigger value="qr">QR Code</TabsTrigger>
        </TabsList>
        
        <TabsContent value="manual">
          <form onSubmit={handleSubmit} className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="rentalNumber">Reservation Number</Label>
              <Input
                id="rentalNumber"
                placeholder="e.g. ABC12345"
                className="kiosk-input"
                value={rentalNumber}
                onChange={(e) => setRentalNumber(e.target.value.toUpperCase())}
              />
              {errors.rentalNumber && (
                <p className="text-sm text-red-500">{errors.rentalNumber}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="birthDate">Date of Birth</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={`kiosk-input w-full justify-start text-left font-normal ${!birthDate ? 'text-muted-foreground' : ''}`}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {birthDate ? format(new Date(birthDate), 'PPP') : <span>Select your date of birth</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={birthDate ? new Date(birthDate) : undefined}
                    onSelect={(date) => date && setBirthDate(date.toISOString())}
                    disabled={(date) => date > new Date() || date < new Date('1900-01-01')}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              {errors.birthDate && (
                <p className="text-sm text-red-500">{errors.birthDate}</p>
              )}
            </div>
            
            <Button type="submit" className="kiosk-button kiosk-button-primary w-full mt-6">
              Verify & Continue
            </Button>
          </form>
        </TabsContent>
        
        <TabsContent value="qr">
          <div className="flex flex-col items-center justify-center p-6 space-y-4">
            <div className="bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg w-64 h-64 flex flex-col items-center justify-center">
              <QrCode className="w-16 h-16 text-gray-400 mb-2" />
              <p className="text-gray-500 text-center">
                Scan the QR code from your reservation confirmation
              </p>
            </div>
            
            <Button 
              className="kiosk-button kiosk-button-primary w-full mt-4"
              onClick={handleQrScan}
            >
              Simulate QR Scan
            </Button>
            
            {(rentalNumber && birthDate && activeTab === 'qr') && (
              <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg w-full">
                <p className="text-green-700 font-medium">Scan successful!</p>
                <p className="text-sm text-green-600">Reservation Number: {rentalNumber}</p>
                <p className="text-sm text-green-600">Birth Date: {birthDate ? format(new Date(birthDate), 'PPP') : ''}</p>
                <Button 
                  className="kiosk-button kiosk-button-primary w-full mt-4"
                  onClick={nextStep}
                >
                  Confirm & Continue
                </Button>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default VerificationStep;
