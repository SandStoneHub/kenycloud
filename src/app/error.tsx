"use client"

import React from 'react';
import { useEffect } from 'react';
import Page500 from './errors/500';

interface ErrorPageProps {
  error: Error;
  reset: () => void;
}

const Error500: React.FC<ErrorPageProps> = ({ error, reset }) => {
  useEffect(() => {
    console.error('Произошла ошибка 500:', error);
  }, [error]);

  return (
    <Page500/>
  );
};

export default Error500;
