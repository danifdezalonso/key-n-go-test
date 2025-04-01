
import React from 'react';
import { useKiosk } from '@/contexts/KioskContext';
import KioskLayout from './KioskLayout';
import WelcomeStep from './WelcomeStep';
import VerificationStep from './VerificationStep';
import VehicleSelectionStep from './VehicleSelectionStep';
import InsuranceStep from './InsuranceStep';
import BookingSummaryStep from './BookingSummaryStep';
import PaymentStep from './PaymentStep';
import KeyDeliveryStep from './KeyDeliveryStep';

const Kiosk: React.FC = () => {
  const { state } = useKiosk();
  const { currentStep } = state;

  // Render the appropriate step based on currentStep
  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <WelcomeStep />;
      case 2:
        return <VerificationStep />;
      case 3:
        return <VehicleSelectionStep />;
      case 4:
        return <InsuranceStep />;
      case 5:
        return <BookingSummaryStep />;
      case 6:
        return <PaymentStep />;
      case 7:
        return <KeyDeliveryStep />;
      default:
        return <WelcomeStep />;
    }
  };

  // Only show the KioskLayout for steps 2 and above
  // Welcome screen has its own full-page layout
  return currentStep === 1 ? (
    renderStep()
  ) : (
    <KioskLayout>
      {renderStep()}
    </KioskLayout>
  );
};

export default Kiosk;
