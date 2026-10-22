import React from 'react';
import { Sprout, Heart } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="agri-footer py-4 mt-5">
      <div className="container">
        <div className="row align-items-center">
          <div className="col-md-6 text-center text-md-start mb-3 mb-md-0">
            <div className="d-flex align-items-center justify-content-center justify-content-md-start gap-2">
              <Sprout size={24} className="text-success" />
              <span className="fw-bold fs-5 text-dark">AgriTech</span>
            </div>
            <p className="text-muted small mb-0 mt-1">
              {t('tagline')} — Bridging the gap between traditional farming and modern technology.
            </p>
          </div>
          <div className="col-md-6 text-center text-md-end text-muted small">
            <span>Built with MERN Stack (MongoDB, Express, React, Node.js)</span>
            <div className="mt-1">
              AgriTech Smart Farming Management System &copy; {new Date().getFullYear()}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
