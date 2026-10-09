import React, { useState, useEffect } from 'react';
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
  // Parse initial state from URL query parameters or path
  const getInitialState = () => {
    const params = new URLSearchParams(window.location.search);
    const path = window.location.pathname.toLowerCase();
    
    let tab = 'home';
    if (params.get('tab')) {
      tab = params.get('tab');
    } else if (path.includes('trends') || path.includes('explore')) {
      tab = 'explore';
    } else if (path.includes('live')) {
      tab = 'explorelive';
    } else if (path.includes('evidence') || path.includes('historical')) {
      tab = 'historical';
    } else if (path.includes('case')) {
      tab = 'casestudies';
    } else if (path.includes('preparedness')) {
      tab = 'preparedness';
    } else if (path.includes('methodology') || path.includes('science')) {
      tab = 'methodology';
    }

    const region = params.get('region') || params.get('zone') || 'bangladesh';
    return { tab, region };
  };

  const initialState = getInitialState();
  const [activeTab, setActiveTab] = useState(initialState.tab);
  const [selectedRegionId, setSelectedRegionId] = useState(initialState.region);

  // Synchronize state with URL parameters
  const updateTab = (newTab, optionalRegion) => {
    const r = optionalRegion || selectedRegionId;
    setActiveTab(newTab);
    if (optionalRegion) setSelectedRegionId(optionalRegion);

    const params = new URLSearchParams(window.location.search);
    params.set('tab', newTab);
    if (r) params.set('region', r);

    const newUrl = `${window.location.pathname}?${params.toString()}`;
    window.history.pushState({ tab: newTab, region: r }, '', newUrl);
  };

  const updateRegion = (newRegion) => {
    setSelectedRegionId(newRegion);
    const params = new URLSearchParams(window.location.search);
    params.set('region', newRegion);
    if (activeTab) params.set('tab', activeTab);
    const newUrl = `${window.location.pathname}?${params.toString()}`;
    window.history.replaceState({ tab: activeTab, region: newRegion }, '', newUrl);
  };

  // Handle browser back/forward buttons
  useEffect(() => {
    const handlePopState = (e) => {
      const state = getInitialState();
      setActiveTab(state.tab);
      setSelectedRegionId(state.region);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const renderCurrentPage = () => {
    switch (activeTab) {
      case 'home':
        return (
          <Home
            setActiveTab={updateTab}
            setSelectedRegionId={updateRegion}
          />
        );
      case 'explorelive':
        return (
          <ExploreLive
            selectedRegionId={selectedRegionId}
            setSelectedRegionId={updateRegion}
            setActiveTab={updateTab}
          />
        );
      case 'explore':
      case 'trends':
        return (
          <ExploreTrends
            selectedRegionId={selectedRegionId}
            setSelectedRegionId={updateRegion}
            setActiveTab={updateTab}
          />
        );
      case 'historical':
      case 'evidence':
        return (
          <HistoricalEvidence
            setActiveTab={updateTab}
            setSelectedRegionId={updateRegion}
          />
        );
      case 'casestudies':
        return (
          <CaseStudies
            selectedRegionId={selectedRegionId}
            setSelectedRegionId={updateRegion}
            setActiveTab={updateTab}
          />
        );
      case 'preparedness':
        return (
          <PreparednessCenter
            selectedRegionId={selectedRegionId}
            setSelectedRegionId={updateRegion}
          />
        );
      case 'methodology':
      case 'science':
        return (
          <Methodology
            setActiveTab={updateTab}
          />
        );
      default:
        return (
          <Home
            setActiveTab={updateTab}
            setSelectedRegionId={updateRegion}
          />
        );
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--bg-space)' }}>
      {/* Sticky Global Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={updateTab}
      />

      {/* Main Page View Container */}
      <main style={{ flex: 1 }}>
        {renderCurrentPage()}
      </main>

      {/* Footer & NASA Data Attributions */}
      <Footer
        setActiveTab={updateTab}
        setSelectedRegionId={updateRegion}
      />
    </div>
  );
}
