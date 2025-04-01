
import React, { useState } from 'react';
import { useKiosk, getVehicles, Vehicle } from '@/contexts/KioskContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  CheckCircle, 
  ArrowUpCircle, 
  BadgeDollarSign, 
  Info, 
  X, 
  Zap, 
  Car, 
  Luggage, 
  AirVent, 
  Users 
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetClose } from '@/components/ui/sheet';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

const VehicleSelectionStep: React.FC = () => {
  const { state, setSelectedVehicle, nextStep, prevStep } = useKiosk();
  const { selectedVehicle, upgradeAmount } = state;
  const vehicles = getVehicles();
  const [vehicleDetails, setVehicleDetails] = useState<Vehicle | null>(null);

  const handleVehicleSelect = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
  };

  const handleContinue = () => {
    if (selectedVehicle) {
      nextStep();
    }
  };

  const openVehicleDetails = (vehicle: Vehicle, e: React.MouseEvent) => {
    e.stopPropagation();
    setVehicleDetails(vehicle);
  };

  const closeVehicleDetails = () => {
    setVehicleDetails(null);
  };

  const getFuelTypeIcon = (fuelType: string) => {
    switch (fuelType) {
      case 'electric':
        return <Zap className="h-3 w-3" />;
      case 'hybrid':
        return <Zap className="h-3 w-3" />;
      default:
        return <Car className="h-3 w-3" />;
    }
  };

  const getFuelTypeText = (vehicle: Vehicle) => {
    if (vehicle.fuelType === 'electric') {
      return `Electric (${vehicle.range} km)`;
    }
    return vehicle.fuelType.charAt(0).toUpperCase() + vehicle.fuelType.slice(1);
  };

  // Group vehicles by category for better organization
  const vehiclesByCategory = vehicles.reduce((acc, vehicle) => {
    if (!acc[vehicle.category]) {
      acc[vehicle.category] = [];
    }
    acc[vehicle.category].push(vehicle);
    return acc;
  }, {} as Record<string, Vehicle[]>);

  // Sort categories by upgrade price (lowest to highest)
  const sortedCategories = Object.keys(vehiclesByCategory).sort((a, b) => {
    const minPriceA = Math.min(...vehiclesByCategory[a].map(v => v.upgradePrice));
    const minPriceB = Math.min(...vehiclesByCategory[b].map(v => v.upgradePrice));
    return minPriceA - minPriceB;
  });

  return (
    <div className="flex flex-col h-[768px] max-h-[768px]">
      <div className="text-center mb-4">
        <h2 className="kiosk-title">Select Your Vehicle</h2>
        <p className="kiosk-text mb-0">
          A car has been preselected for you. You can upgrade to another vehicle for an additional fee.
        </p>
      </div>
      
      <div className="flex-1 overflow-hidden">
        <div className="grid grid-cols-3 gap-3 h-full">
          {sortedCategories.map((category, categoryIndex) => (
            <div key={category} className="space-y-2">
              <h3 className="text-md font-medium text-gray-700 flex items-center gap-2 px-1">
                {category} 
                {category !== sortedCategories[0] && (
                  <Badge variant="outline" className="bg-rental-light text-rental-dark">
                    <ArrowUpCircle className="h-3 w-3 mr-1" />
                    Upgrade
                  </Badge>
                )}
              </h3>
              
              <div className="space-y-3 pr-1">
                {vehiclesByCategory[category].map((vehicle) => (
                  <Card 
                    key={vehicle.id}
                    className={`cursor-pointer transition-all duration-200 overflow-hidden hover:shadow-md ${
                      selectedVehicle?.id === vehicle.id 
                        ? 'ring-2 ring-rental-primary border-rental-primary' 
                        : 'border-gray-200'
                    } ${vehicle.isDefault ? 'border-l-4 border-l-rental-secondary' : ''}`}
                    onClick={() => handleVehicleSelect(vehicle)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        handleVehicleSelect(vehicle);
                      }
                    }}
                    tabIndex={0}
                    role="button"
                    aria-pressed={selectedVehicle?.id === vehicle.id}
                    aria-label={`Select ${vehicle.name} ${vehicle.brand} ${vehicle.category} with ${vehicle.seats} seats and ${vehicle.luggage} luggage spaces`}
                  >
                    <div className="p-2 flex items-center justify-between border-b relative">
                      <div className="flex items-center">
                        <Avatar className="h-10 w-10 mr-2 bg-white">
                          <AvatarImage src={vehicle.brandLogo} alt={vehicle.brand} />
                          <AvatarFallback>{vehicle.brand.substring(0, 2)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-semibold text-sm">{vehicle.name}</h3>
                          <span className="text-xs text-gray-500">{vehicle.brand}</span>
                        </div>
                      </div>
                      {selectedVehicle?.id === vehicle.id && (
                        <div className="absolute top-2 right-2">
                          <CheckCircle className="h-4 w-4 text-rental-primary" />
                        </div>
                      )}
                      {vehicle.isDefault && (
                        <span className="absolute bottom-1 right-2 text-white text-xs bg-rental-secondary px-1 py-0.5 rounded text-[10px]">
                          Pre-selected
                        </span>
                      )}
                    </div>
                    <CardContent className="p-2">
                      <div className="grid grid-cols-2 gap-x-2 gap-y-1 mb-2">
                        <div className="flex items-center text-xs">
                          <Car className="h-3 w-3 mr-1 text-gray-500" />
                          <span>{vehicle.transmission.charAt(0).toUpperCase() + vehicle.transmission.slice(1)}</span>
                        </div>
                        <div className="flex items-center text-xs">
                          <Luggage className="h-3 w-3 mr-1 text-gray-500" />
                          <span>{vehicle.luggage} {vehicle.luggage === 1 ? 'bag' : 'bags'}</span>
                        </div>
                        <div className="flex items-center text-xs">
                          <Users className="h-3 w-3 mr-1 text-gray-500" />
                          <span>{vehicle.seats} seats</span>
                        </div>
                        <div className="flex items-center text-xs">
                          {getFuelTypeIcon(vehicle.fuelType)}
                          <span className="ml-1">{getFuelTypeText(vehicle)}</span>
                        </div>
                        <div className="flex items-center text-xs col-span-2">
                          <AirVent className="h-3 w-3 mr-1 text-gray-500" />
                          <span>{vehicle.airConditioning ? 'Air conditioning' : 'No A/C'}</span>
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center mt-2 pt-2 border-t">
                        {vehicle.upgradePrice > 0 && (
                          <div className="flex items-center text-rental-secondary font-medium text-xs">
                            <BadgeDollarSign className="h-3 w-3 mr-0.5" />
                            +€{vehicle.upgradePrice.toFixed(2)}
                          </div>
                        )}
                        {vehicle.upgradePrice === 0 && <div></div>}
                        <div className="flex items-center gap-1 ml-auto">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="p-0 h-6 text-xs text-rental-primary hover:text-rental-primary-dark"
                            onClick={(e) => openVehicleDetails(vehicle, e)}
                            aria-label={`View details for ${vehicle.name}`}
                          >
                            <Info className="h-3 w-3 mr-1" />
                            Details
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="flex justify-between mt-3 pt-3 border-t">
        <Button onClick={prevStep} variant="outline" className="kiosk-button kiosk-button-secondary">
          Go Back
        </Button>
        <div className="text-right flex items-center gap-3">
          {upgradeAmount > 0 && (
            <div className="font-medium text-rental-dark">
              <span>Upgrade fee: </span>
              <span className="text-rental-primary">€{upgradeAmount.toFixed(2)}</span>
            </div>
          )}
          <Button 
            onClick={handleContinue}
            disabled={!selectedVehicle}
            className="kiosk-button kiosk-button-primary"
          >
            Continue
          </Button>
        </div>
      </div>

      {/* Vehicle Details Sheet (for mobile/touch interfaces) */}
      <Sheet open={!!vehicleDetails} onOpenChange={() => closeVehicleDetails()}>
        <SheetContent className="w-[400px] sm:w-[540px]">
          <SheetHeader>
            <SheetTitle>{vehicleDetails?.name}</SheetTitle>
            <SheetDescription>
              {vehicleDetails?.category} Class
              {vehicleDetails?.isDefault && (
                <Badge className="ml-2 bg-rental-secondary">Pre-selected</Badge>
              )}
            </SheetDescription>
          </SheetHeader>
          {vehicleDetails && (
            <div className="mt-4">
              <div className="flex items-center mb-4">
                <Avatar className="h-16 w-16 mr-3">
                  <AvatarImage src={vehicleDetails.brandLogo} alt={vehicleDetails.brand} />
                  <AvatarFallback>{vehicleDetails.brand.substring(0, 2)}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-lg font-medium">{vehicleDetails.name}</h3>
                  <p className="text-sm text-gray-500">{vehicleDetails.brand}</p>
                </div>
              </div>
              
              <div className="mt-4 space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-center">
                    <Car className="h-5 w-5 mr-2 text-rental-primary" />
                    <div>
                      <p className="text-sm font-medium">Transmission</p>
                      <p className="text-sm">{vehicleDetails.transmission.charAt(0).toUpperCase() + vehicleDetails.transmission.slice(1)}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <Luggage className="h-5 w-5 mr-2 text-rental-primary" />
                    <div>
                      <p className="text-sm font-medium">Luggage</p>
                      <p className="text-sm">{vehicleDetails.luggage} {vehicleDetails.luggage === 1 ? 'bag' : 'bags'}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <Users className="h-5 w-5 mr-2 text-rental-primary" />
                    <div>
                      <p className="text-sm font-medium">Capacity</p>
                      <p className="text-sm">{vehicleDetails.seats} seats</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    {vehicleDetails.fuelType === 'electric' ? (
                      <Zap className="h-5 w-5 mr-2 text-rental-primary" />
                    ) : vehicleDetails.fuelType === 'hybrid' ? (
                      <Zap className="h-5 w-5 mr-2 text-rental-primary" />
                    ) : (
                      <Car className="h-5 w-5 mr-2 text-rental-primary" />
                    )}
                    <div>
                      <p className="text-sm font-medium">Fuel Type</p>
                      <p className="text-sm">{getFuelTypeText(vehicleDetails)}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <AirVent className="h-5 w-5 mr-2 text-rental-primary" />
                    <div>
                      <p className="text-sm font-medium">Air Conditioning</p>
                      <p className="text-sm">{vehicleDetails.airConditioning ? 'Yes' : 'No'}</p>
                    </div>
                  </div>
                </div>
                
                {vehicleDetails.upgradePrice > 0 && (
                  <div className="flex items-center text-rental-secondary font-medium pt-3 border-t">
                    <BadgeDollarSign className="h-5 w-5 mr-1" />
                    Upgrade fee: €{vehicleDetails.upgradePrice.toFixed(2)}
                  </div>
                )}
                
                <div>
                  <h4 className="text-sm font-medium mb-2">Additional Features:</h4>
                  <div className="grid grid-cols-2 gap-1">
                    {vehicleDetails.features.map((feature, index) => (
                      <span key={index} className="text-xs text-gray-600">• {feature}</span>
                    ))}
                  </div>
                </div>
                
                <div className="pt-3 border-t">
                  <span className="text-sm font-medium text-gray-800">
                    Deposit required: €{vehicleDetails.deposit.toFixed(2)}
                  </span>
                </div>
                
                <div className="pt-3 flex justify-between">
                  <Button 
                    variant="outline" 
                    onClick={closeVehicleDetails}
                  >
                    Close
                  </Button>
                  <Button 
                    onClick={() => {
                      handleVehicleSelect(vehicleDetails);
                      closeVehicleDetails();
                    }}
                    variant={selectedVehicle?.id === vehicleDetails.id ? "outline" : "default"}
                  >
                    {selectedVehicle?.id === vehicleDetails.id ? "Selected" : "Select Vehicle"}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default VehicleSelectionStep;
