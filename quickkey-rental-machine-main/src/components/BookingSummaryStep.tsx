
import React, { useState } from 'react';
import { useKiosk } from '@/contexts/KioskContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Car, Calendar, User, Globe, ShieldCheck, Check, RefreshCw, UserPlus } from 'lucide-react';
import { format } from 'date-fns';
import { Switch } from '@/components/ui/switch';

const BookingSummaryStep: React.FC = () => {
  const { state, nextStep, prevStep } = useKiosk();
  const { selectedVehicle, selectedInsurance, depositAmount, upgradeAmount } = state;
  
  // State for add-ons
  const [addons, setAddons] = useState({
    additionalDriver: false,
    smartReturn: false,
    crossborder: false
  });
  
  // Sample booking data (in a real app, this would come from the API)
  const bookingData = {
    rentalNumber: state.rentalNumber || 'ABC12345',
    startDate: new Date('2023-09-15T10:00:00'),
    endDate: new Date('2023-09-18T16:00:00'),
    primaryDriver: 'John Smith',
    location: 'Airport Terminal 2'
  };
  
  // Calculate costs
  const dailyRate = 49.99;
  const daysCount = 3;
  const baseRental = dailyRate * daysCount;
  const additionalDriverCost = addons.additionalDriver ? 15.00 * daysCount : 0;
  const smartReturnCost = addons.smartReturn ? 9.99 : 0;
  const crossborderCost = addons.crossborder ? 12.50 * daysCount : 0;
  const insuranceCost = selectedInsurance?.price || 0;
  const upgradeCharge = upgradeAmount;
  const subtotal = baseRental + additionalDriverCost + smartReturnCost + crossborderCost + insuranceCost + upgradeCharge;
  
  // Apply Key'n'Go discount (15%)
  const discountPercentage = 15;
  const discountAmount = subtotal * (discountPercentage / 100);
  
  const subtotalAfterDiscount = subtotal - discountAmount;
  const tax = subtotalAfterDiscount * 0.20; // 20% tax
  const totalPayment = subtotalAfterDiscount + tax;
  
  const handleAddonToggle = (addon: keyof typeof addons) => {
    setAddons(prev => ({ ...prev, [addon]: !prev[addon] }));
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="kiosk-title">Booking Summary</h2>
        <p className="kiosk-text">
          Please review your rental details before proceeding to payment
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Booking Details */}
        <div>
          <Card>
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold mb-4">Rental Details</h3>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Calendar className="w-5 h-5 text-gray-500" />
                  <div>
                    <p className="font-medium">Rental Period</p>
                    <p className="text-sm text-gray-600">
                      {format(bookingData.startDate, 'PPP, p')} — {format(bookingData.endDate, 'PPP, p')}
                    </p>
                    <p className="text-sm text-gray-600">{daysCount} days</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <User className="w-5 h-5 text-gray-500" />
                  <div>
                    <p className="font-medium">Primary Driver</p>
                    <p className="text-sm text-gray-600">{bookingData.primaryDriver}</p>
                  </div>
                </div>
                
                {selectedVehicle && (
                  <div className="flex items-center space-x-3">
                    <Car className="w-5 h-5 text-gray-500" />
                    <div>
                      <p className="font-medium">Vehicle</p>
                      <p className="text-sm text-gray-600">{selectedVehicle.name} ({selectedVehicle.category})</p>
                      <p className="text-sm text-gray-600">
                        {selectedVehicle.transmission}, {selectedVehicle.seats} seats, 
                        {selectedVehicle.airConditioning ? ' with A/C' : ' no A/C'}
                      </p>
                    </div>
                  </div>
                )}
                
                {selectedInsurance && (
                  <div className="flex items-center space-x-3">
                    <ShieldCheck className="w-5 h-5 text-gray-500" />
                    <div>
                      <p className="font-medium">Insurance</p>
                      <p className="text-sm text-gray-600">{selectedInsurance.name}</p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
          
          {/* Add-ons */}
          <Card className="mt-4">
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold mb-4">Would you like to add?</h3>
              
              <div className="space-y-4">
                <div className="flex items-start justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-start space-x-3">
                    <UserPlus className="w-5 h-5 text-rental-primary mt-0.5" />
                    <div>
                      <p className="font-medium">Additional Driver</p>
                      <p className="text-sm text-gray-600">Add another person to drive the vehicle</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium">€15.00/day</span>
                    <Switch 
                      checked={addons.additionalDriver} 
                      onCheckedChange={() => handleAddonToggle('additionalDriver')}
                      aria-label="Add additional driver"
                    />
                  </div>
                </div>
                
                <div className="flex items-start justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-start space-x-3">
                    <RefreshCw className="w-5 h-5 text-rental-primary mt-0.5" />
                    <div>
                      <p className="font-medium">Smart Return</p>
                      <p className="text-sm text-gray-600">Express check-out with fuel level flexibility</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium">€9.99/day</span>
                    <Switch 
                      checked={addons.smartReturn} 
                      onCheckedChange={() => handleAddonToggle('smartReturn')}
                      aria-label="Add smart return"
                    />
                  </div>
                </div>
                
                <div className="flex items-start justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-start space-x-3">
                    <Globe className="w-5 h-5 text-rental-primary mt-0.5" />
                    <div>
                      <p className="font-medium">Cross-border Travel</p>
                      <p className="text-sm text-gray-600">Permission to travel between countries</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium">€12.50/day</span>
                    <Switch 
                      checked={addons.crossborder} 
                      onCheckedChange={() => handleAddonToggle('crossborder')}
                      aria-label="Add cross-border travel"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Cost Breakdown */}
        <div>
          <Card>
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold mb-4">Cost Summary</h3>
              
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Item</TableHead>
                    <TableHead className="text-right">Price</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>Base Rental ({daysCount} days)</TableCell>
                    <TableCell className="text-right">€{baseRental.toFixed(2)}</TableCell>
                  </TableRow>
                  
                  {upgradeCharge > 0 && (
                    <TableRow>
                      <TableCell>Vehicle Upgrade</TableCell>
                      <TableCell className="text-right">€{upgradeCharge.toFixed(2)}</TableCell>
                    </TableRow>
                  )}
                  
                  {addons.additionalDriver && (
                    <TableRow>
                      <TableCell>Additional Driver (€15.00/day × {daysCount} days)</TableCell>
                      <TableCell className="text-right">€{additionalDriverCost.toFixed(2)}</TableCell>
                    </TableRow>
                  )}
                  
                  {addons.smartReturn && (
                    <TableRow>
                      <TableCell>Smart Return</TableCell>
                      <TableCell className="text-right">€{smartReturnCost.toFixed(2)}</TableCell>
                    </TableRow>
                  )}
                  
                  {addons.crossborder && (
                    <TableRow>
                      <TableCell>Cross-border Travel (€12.50/day × {daysCount} days)</TableCell>
                      <TableCell className="text-right">€{crossborderCost.toFixed(2)}</TableCell>
                    </TableRow>
                  )}
                  
                  {selectedInsurance && selectedInsurance.price > 0 && (
                    <TableRow>
                      <TableCell>{selectedInsurance.name}</TableCell>
                      <TableCell className="text-right">€{insuranceCost.toFixed(2)}</TableCell>
                    </TableRow>
                  )}
                  
                  <TableRow>
                    <TableCell>Subtotal</TableCell>
                    <TableCell className="text-right">€{subtotal.toFixed(2)}</TableCell>
                  </TableRow>
                  
                  <TableRow className="bg-green-50">
                    <TableCell className="font-medium text-green-700">
                      Key'N'Go Discount ({discountPercentage}%)
                    </TableCell>
                    <TableCell className="text-right font-medium text-green-700">
                      -€{discountAmount.toFixed(2)}
                    </TableCell>
                  </TableRow>
                  
                  <TableRow>
                    <TableCell>Tax (20%)</TableCell>
                    <TableCell className="text-right">€{tax.toFixed(2)}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
              
              <Separator className="my-4" />
              
              <div className="flex justify-between font-semibold text-lg">
                <span>Total Payment:</span>
                <span>€{totalPayment.toFixed(2)}</span>
              </div>
              
              <div className="mt-3 p-2 bg-green-100 rounded-md text-center">
                <p className="text-green-700 font-medium">
                  You saved €{discountAmount.toFixed(2)} with Key'N'Go!
                </p>
              </div>
              
              <Separator className="my-4" />
              
              <div className="flex justify-between text-sm text-gray-700">
                <span>Security Deposit (refundable):</span>
                <span>€{depositAmount.toFixed(2)}</span>
              </div>
              
              <div className="mt-6 pt-4 border-t">
                <div className="flex justify-between space-x-4">
                  <Button 
                    onClick={prevStep} 
                    variant="outline" 
                    className="flex-1"
                  >
                    Back
                  </Button>
                  <Button 
                    onClick={nextStep} 
                    className="flex-1 bg-[#DAED56] text-black hover:bg-[#cfe040]"
                  >
                    Proceed to Payment
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default BookingSummaryStep;
