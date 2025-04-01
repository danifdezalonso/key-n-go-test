
import React, { createContext, useState, useContext } from 'react';

// Define the vehicle type
export type Vehicle = {
  id: string;
  name: string;
  brand: string;
  brandLogo: string;
  category: string;
  transmission: "automatic" | "manual";
  luggage: number;
  fuelType: "electric" | "hybrid" | "petrol";
  range?: number; // for electric vehicles
  airConditioning: boolean;
  seats: number;
  features: string[];
  deposit: number;
  upgradePrice: number;
  isDefault?: boolean;
};

// Define insurance options
export type Insurance = {
  id: string;
  name: string;
  description: string;
  coverageDetails: string[];
  price: number;
  isDefault: boolean;
};

// Define the state shape
type KioskState = {
  currentStep: number;
  language: string;
  rentalNumber: string;
  birthDate: string;
  selectedVehicle: Vehicle | null;
  selectedInsurance: Insurance | null;
  depositAmount: number;
  upgradeAmount: number;
  paymentProcessed: boolean;
  keyReady: boolean;
};

// Define the context shape
type KioskContextType = {
  state: KioskState;
  setLanguage: (lang: string) => void;
  setRentalNumber: (number: string) => void;
  setBirthDate: (date: string) => void;
  setSelectedVehicle: (vehicle: Vehicle | null) => void;
  setSelectedInsurance: (insurance: Insurance | null) => void;
  nextStep: () => void;
  prevStep: () => void;
  goToStep: (step: number) => void;
  processPayment: () => Promise<boolean>;
  resetKiosk: () => void;
};

// Create the context
const KioskContext = createContext<KioskContextType | undefined>(undefined);

// Sample data
const sampleInsuranceOptions: Insurance[] = [
  {
    id: 'basic',
    name: 'Super Relax Coverage',
    description: 'Essential coverage included with your rental',
    coverageDetails: [
      'Zero excess',
      'No damage deposit',
      'Basic roadside assistance'
    ],
    price: 0,
    isDefault: true
  },
  {
    id: 'premium',
    name: 'Mega Relax Coverage',
    description: 'Enhanced protection for complete peace of mind',
    coverageDetails: [
      'Zero excess',
      'No damage deposit',
      'Premium roadside assistance',
      'Assistance for refueling error',
      'Rescue on special roads',
      'Assistance for broken windows',
      'Assistance for lost keys',
      'Emergency wheel repairs'
    ],
    price: 19.99,
    isDefault: false
  }
];

// Sample vehicles data with updated details
const sampleVehicles: Vehicle[] = [
  {
    id: 'compact-1',
    name: 'VW Golf',
    brand: 'Volkswagen',
    brandLogo: 'https://upload.wikimedia.org/wikipedia/commons/6/6d/Volkswagen_logo_2019.svg',
    category: 'Compact',
    transmission: "manual",
    luggage: 2,
    fuelType: "petrol",
    airConditioning: true,
    seats: 5,
    features: ['5 seats', 'Manual', 'Air conditioning', '2 bags'],
    deposit: 200,
    upgradePrice: 0,
    isDefault: true
  },
  {
    id: 'compact-2',
    name: 'Ford Focus',
    brand: 'Ford',
    brandLogo: 'https://upload.wikimedia.org/wikipedia/commons/3/3a/Ford_Motor_Company_Logo.svg',
    category: 'Compact',
    transmission: "automatic",
    luggage: 2,
    fuelType: "hybrid",
    airConditioning: true,
    seats: 5,
    features: ['5 seats', 'Automatic', 'Air conditioning', '2 bags', 'Bluetooth'],
    deposit: 200,
    upgradePrice: 12.99
  },
  {
    id: 'intermediate-1',
    name: 'Toyota Corolla',
    brand: 'Toyota',
    brandLogo: 'https://upload.wikimedia.org/wikipedia/commons/9/9d/Toyota_carlogo.svg',
    category: 'Intermediate',
    transmission: "automatic",
    luggage: 3,
    fuelType: "hybrid",
    airConditioning: true,
    seats: 5,
    features: ['5 seats', 'Automatic', 'Air conditioning', '3 bags'],
    deposit: 250,
    upgradePrice: 24.99
  },
  {
    id: 'suv-1',
    name: 'Nissan Qashqai',
    brand: 'Nissan',
    brandLogo: 'https://upload.wikimedia.org/wikipedia/commons/8/8c/Nissan_logo.svg',
    category: 'SUV',
    transmission: "automatic",
    luggage: 4,
    fuelType: "electric",
    range: 450,
    airConditioning: true,
    seats: 5,
    features: ['5 seats', 'Automatic', 'Air conditioning', '4 bags', 'GPS'],
    deposit: 300,
    upgradePrice: 49.99
  }
];

// Provider component
export const KioskProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<KioskState>({
    currentStep: 1,
    language: 'en',
    rentalNumber: '',
    birthDate: '',
    selectedVehicle: sampleVehicles.find(v => v.isDefault) || null,
    selectedInsurance: sampleInsuranceOptions.find(i => i.isDefault) || null,
    depositAmount: sampleVehicles.find(v => v.isDefault)?.deposit || 0,
    upgradeAmount: 0,
    paymentProcessed: false,
    keyReady: false
  });

  // Helper function to set the language
  const setLanguage = (lang: string) => {
    setState(prev => ({ ...prev, language: lang }));
  };

  // Helper functions to update state
  const setRentalNumber = (number: string) => {
    setState(prev => ({ ...prev, rentalNumber: number }));
  };

  const setBirthDate = (date: string) => {
    setState(prev => ({ ...prev, birthDate: date }));
  };

  const setSelectedVehicle = (vehicle: Vehicle | null) => {
    const defaultVehicle = sampleVehicles.find(v => v.isDefault);
    const upgradeAmount = vehicle && !vehicle.isDefault ? vehicle.upgradePrice : 0;
    
    setState(prev => ({ 
      ...prev, 
      selectedVehicle: vehicle,
      depositAmount: vehicle ? vehicle.deposit : 0,
      upgradeAmount
    }));
  };

  const setSelectedInsurance = (insurance: Insurance | null) => {
    setState(prev => ({ ...prev, selectedInsurance: insurance }));
  };

  const nextStep = () => {
    setState(prev => ({ ...prev, currentStep: prev.currentStep + 1 }));
  };

  const prevStep = () => {
    setState(prev => ({ ...prev, currentStep: Math.max(1, prev.currentStep - 1) }));
  };

  const goToStep = (step: number) => {
    setState(prev => ({ ...prev, currentStep: step }));
  };

  // Simulate payment processing
  const processPayment = async (): Promise<boolean> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        setState(prev => ({ 
          ...prev, 
          paymentProcessed: true,
          keyReady: true
        }));
        resolve(true);
      }, 2000);
    });
  };

  // Reset kiosk for a new customer
  const resetKiosk = () => {
    setState({
      currentStep: 1,
      language: 'en',
      rentalNumber: '',
      birthDate: '',
      selectedVehicle: sampleVehicles.find(v => v.isDefault) || null,
      selectedInsurance: sampleInsuranceOptions.find(i => i.isDefault) || null,
      depositAmount: sampleVehicles.find(v => v.isDefault)?.deposit || 0,
      upgradeAmount: 0,
      paymentProcessed: false,
      keyReady: false
    });
  };

  return (
    <KioskContext.Provider value={{
      state,
      setLanguage,
      setRentalNumber,
      setBirthDate,
      setSelectedVehicle,
      setSelectedInsurance,
      nextStep,
      prevStep,
      goToStep,
      processPayment,
      resetKiosk
    }}>
      {children}
    </KioskContext.Provider>
  );
};

// Custom hook to use the kiosk context
export const useKiosk = () => {
  const context = useContext(KioskContext);
  if (context === undefined) {
    throw new Error('useKiosk must be used within a KioskProvider');
  }
  return context;
};

// Helper functions for external use
export const getVehicles = (): Vehicle[] => {
  return sampleVehicles;
};

export const getInsuranceOptions = (): Insurance[] => {
  return sampleInsuranceOptions;
};
