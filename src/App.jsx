import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Pages
import Home from './pages/Home';
import ExploreTrends from './pages/ExploreTrends';
import ExploreLive from './pages/ExploreLive';
import HistoricalEvidence from './pages/HistoricalEvidence';
import CaseStudies from './pages/CaseStudies';
import PreparednessCenter from './pages/PreparednessCenter';
import Methodology from './pages/Methodology';

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [selectedRegionId, setSelectedRegionId] = useState('bangladesh');

  const renderCurrentPage = () => {
    switch (activeTab) {
      case 'home':
        return (
          <Home
            setActiveTab={setActiveTab}
            setSelectedRegionId={setSelectedRegionId}
          />
        );
      case 'explorelive':
        return (
          <ExploreLive
            selectedRegionId={selectedRegionId}
            setSelectedRegionId={setSelectedRegionId}
          />
        );
      case 'explore':
        return (
          <ExploreTrends
            selectedRegionId={selectedRegionId}
            setSelectedRegionId={setSelectedRegionId}
          />
        );
      case 'historical':
        return (
          <HistoricalEvidence
            setActiveTab={setActiveTab}
            setSelectedRegionId={setSelectedRegionId}
          />
        );
      case 'casestudies':
        return (
          <CaseStudies
            selectedRegionId={selectedRegionId}
          />
        );
      case 'preparedness':
        return (
          <PreparednessCenter
            selectedRegionId={selectedRegionId}
          />
        );
      case 'methodology':
        return (
          <Methodology />
        );
      default:
        return (
          <Home
            setActiveTab={setActiveTab}
            setSelectedRegionId={setSelectedRegionId}
          />
        );
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Sticky Global Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* Main Page View Container */}
      <main style={{ flex: 1 }}>
        {renderCurrentPage()}
      </main>

      {/* Footer & NASA Data Attributions */}
      <Footer
        setActiveTab={setActiveTab}
      />
    </div>
  );
}
