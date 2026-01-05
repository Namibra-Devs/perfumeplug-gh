// src/components/analytics/GoogleAnalytics.tsx
import React from 'react';
import { Helmet } from 'react-helmet-async';

interface GoogleAnalyticsProps {
  trackingId?: string;
}

const GoogleAnalytics: React.FC<GoogleAnalyticsProps> = ({ trackingId }) => {
  // Only load in production and if tracking ID is provided
  if (!trackingId || import.meta.env.DEV) {
    return null;
  }

  return (
    <Helmet>
      {/* Global site tag (gtag.js) - Google Analytics */}
      <script async src={`https://www.googletagmanager.com/gtag/js?id=${trackingId}`} />
      <script>
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${trackingId}', {
            page_title: document.title,
            page_location: window.location.href,
          });
        `}
      </script>
    </Helmet>
  );
};

export default GoogleAnalytics;

// Utility functions for tracking events
export const trackEvent = (action: string, category: string, label?: string, value?: number) => {
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }
};

export const trackPurchase = (transactionId: string, value: number, currency: string = 'GHS', items: any[]) => {
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', 'purchase', {
      transaction_id: transactionId,
      value: value,
      currency: currency,
      items: items,
    });
  }
};

export const trackAddToCart = (currency: string = 'GHS', value: number, items: any[]) => {
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', 'add_to_cart', {
      currency: currency,
      value: value,
      items: items,
    });
  }
};