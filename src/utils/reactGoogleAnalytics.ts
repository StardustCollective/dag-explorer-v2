import ReactGA from 'react-ga4';

const isProduction = process.env.NODE_ENV === 'production';

const initializeReactGaLib = async () => {
  await ReactGA.initialize(process.env.REACT_APP_GA4_MEASUREMENT_ID ?? '', {
    testMode: !isProduction,
  });
};

export { initializeReactGaLib };
