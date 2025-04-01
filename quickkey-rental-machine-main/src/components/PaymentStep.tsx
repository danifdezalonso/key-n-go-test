
import React, { useState } from 'react';
import { useKiosk } from '@/contexts/KioskContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { CreditCard, Calendar, Lock } from 'lucide-react';

const PaymentStep: React.FC = () => {
  const { state, prevStep, processPayment, nextStep } = useKiosk();
  const { selectedVehicle, selectedInsurance, depositAmount } = state;
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  // Calculate total
  const insuranceCost = selectedInsurance?.price || 0;
  const subtotal = depositAmount + insuranceCost;
  
  // Apply Key'n'Go discount (15%)
  const discountPercentage = 15;
  const discountAmount = subtotal * (discountPercentage / 100);
  const totalCharge = subtotal - discountAmount;

  // Format card number with spaces
  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || '';
    const parts = [];

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    if (parts.length) {
      return parts.join(' ');
    } else {
      return value;
    }
  };

  // Format expiry date
  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length > 2) {
      return `${v.substring(0, 2)}/${v.substring(2, 4)}`;
    }
    return v;
  };

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!cardNumber || !cardName || !expiryDate || !cvv) {
      toast({
        variant: "destructive",
        title: "Missing information",
        description: "Please fill in all payment fields",
      });
      return;
    }
    
    if (cardNumber.replace(/\s/g, '').length !== 16) {
      toast({
        variant: "destructive",
        title: "Invalid card number",
        description: "Please enter a valid 16-digit card number",
      });
      return;
    }
    
    // Process payment
    setIsProcessing(true);
    
    try {
      const result = await processPayment();
      if (result) {
        toast({
          title: "Payment successful",
          description: `Your deposit of €${totalCharge.toFixed(2)} has been processed`,
        });
        nextStep();
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Payment failed",
        description: "There was an error processing your payment. Please try again.",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="kiosk-title">Payment Details</h2>
        <p className="kiosk-text">
          Please enter your payment information to secure your vehicle
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Payment form */}
        <div>
          <form onSubmit={handlePayment} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="cardName">Name on Card</Label>
              <Input
                id="cardName"
                placeholder="e.g. John Smith"
                className="kiosk-input"
                value={cardName}
                onChange={(e) => setCardName(e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="cardNumber">Card Number</Label>
              <div className="relative">
                <Input
                  id="cardNumber"
                  placeholder="1234 5678 9012 3456"
                  className="kiosk-input pl-10"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                  maxLength={19}
                  required
                />
                <CreditCard className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="expiryDate">Expiry Date</Label>
                <div className="relative">
                  <Input
                    id="expiryDate"
                    placeholder="MM/YY"
                    className="kiosk-input pl-10"
                    value={expiryDate}
                    onChange={(e) => setExpiryDate(formatExpiryDate(e.target.value))}
                    maxLength={5}
                    required
                  />
                  <Calendar className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="cvv">CVV</Label>
                <div className="relative">
                  <Input
                    id="cvv"
                    placeholder="123"
                    className="kiosk-input pl-10"
                    value={cvv}
                    onChange={(e) => setCvv(e.target.value.replace(/\D/g, ''))}
                    maxLength={3}
                    required
                  />
                  <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                </div>
              </div>
            </div>
            
            <div className="flex justify-between mt-8">
              <Button 
                type="button" 
                onClick={prevStep} 
                variant="outline" 
                className="kiosk-button kiosk-button-secondary"
                disabled={isProcessing}
              >
                Go Back
              </Button>
              <Button 
                type="submit"
                className="kiosk-button kiosk-button-primary bg-[#DAED56] text-black hover:bg-[#cfe040]"
                disabled={isProcessing}
              >
                {isProcessing ? 'Processing...' : 'Pay Now'}
              </Button>
            </div>
          </form>
        </div>
        
        {/* Summary */}
        <div>
          <Card>
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold mb-4">Payment Summary</h3>
              
              {selectedVehicle && (
                <div className="mb-4">
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center">
                      <CreditCard className="h-6 w-6 text-gray-700" />
                    </div>
                    <div>
                      <p className="font-medium">{selectedVehicle.name}</p>
                      <p className="text-sm text-gray-600">{selectedVehicle.category}</p>
                    </div>
                  </div>
                </div>
              )}
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Security Deposit:</span>
                  <span>€{depositAmount.toFixed(2)}</span>
                </div>
                
                {selectedInsurance && (
                  <div className="flex justify-between">
                    <span>{selectedInsurance.name}:</span>
                    <span>
                      {selectedInsurance.price === 0 
                        ? 'Included' 
                        : `€${selectedInsurance.price.toFixed(2)}`}
                    </span>
                  </div>
                )}
                
                <div className="flex justify-between text-green-700 font-medium">
                  <span>Key'N'Go Discount ({discountPercentage}%):</span>
                  <span>-€{discountAmount.toFixed(2)}</span>
                </div>
                
                <Separator className="my-2" />
                
                <div className="flex justify-between font-semibold text-lg">
                  <span>Total:</span>
                  <span>€{totalCharge.toFixed(2)}</span>
                </div>
              </div>
              
              <div className="mt-3 p-2 bg-green-100 rounded-md text-center">
                <p className="text-green-700 font-medium">
                  You saved €{discountAmount.toFixed(2)} with Key'N'Go!
                </p>
              </div>
              
              <div className="mt-6 text-sm text-gray-600 bg-gray-50 p-3 rounded">
                <p className="mb-2">
                  <strong>Note:</strong> The security deposit will be refunded when you return the vehicle in the same condition.
                </p>
                
                {selectedInsurance?.id === 'premium' && (
                  <p className="text-green-600">
                    ✓ With Premium Coverage, you have ZERO excess in case of damage or theft.
                  </p>
                )}
                
                {selectedInsurance?.id === 'basic' && (
                  <p className="text-amber-600">
                    ⚠️ With Basic Coverage, you may be liable for up to €1000 excess in case of damage or theft.
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PaymentStep;
