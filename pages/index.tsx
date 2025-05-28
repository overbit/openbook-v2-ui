
import React from 'react';
import TradingDashboard from '../components/TradingDashboard';
import { Helmet } from 'react-helmet';

const Index = () => {
  return (
    <>
      <Helmet>
        <title>OpenBook V2 Trading Interface</title>
      </Helmet>
      <TradingDashboard />
    </>
  );
};

export default Index;
