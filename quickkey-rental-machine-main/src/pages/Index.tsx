
import React from 'react';
import { KioskProvider } from '@/contexts/KioskContext';
import Kiosk from '@/components/Kiosk';

const Index = () => {
  return (
    <KioskProvider>
      <Kiosk />
    </KioskProvider>
  );
};

export default Index;
