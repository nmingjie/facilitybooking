import React from 'react';
import { PuffLoader } from 'react-spinners';

const LoadingOverlay = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50 z-50">
      <PuffLoader
        size={100}
        color="blue"
      />
    </div>
  );
};

export default LoadingOverlay;