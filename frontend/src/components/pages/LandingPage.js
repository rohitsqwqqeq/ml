import React from 'react';
import Task1 from '../Tasks/Task1';
import Task2 from '../Tasks/Task2';

const LandingPage = () => {
  return (
    <div style={{ alignItems: 'center' }}>
      <div style={{ width: '120vh', margin: 'auto', marginTop:'15vh' }}>
        <Task1 />
      </div>
      <div style={{ width: '120vh', margin: 'auto', marginTop:'25vh', marginBottom:'17vh' }}>
        <Task2 />
      </div>
    </div>
  );
};

export default LandingPage;
