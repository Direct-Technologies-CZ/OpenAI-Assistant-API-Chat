import React, { useEffect } from 'react';

const NotFoundPage: React.FC = () => {
  useEffect(() => {
    // Redirect to home page after a short delay
    const timer = setTimeout(() => {
      window.location.href = '/';
    }, 10); // Redirect after 3 seconds

    // Clean up the timer when the component unmounts
    return () => clearTimeout(timer);
  }, []);

  return (
    <div>
      <h1>404 - Page Not Found</h1>
      <p>You will be redirected to the homepage in 1 second...</p>
    </div>
  );
};

export default NotFoundPage;