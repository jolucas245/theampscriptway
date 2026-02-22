import React from 'react';
import BrowserOnly from '@docusaurus/BrowserOnly';
import Layout from '@theme/Layout';

export default function PlaygroundPage() {
  return (
    <Layout
      title="AMPscript Playground"
      description="Test and debug AMPscript code directly in the browser"
      noFooter
    >
      <BrowserOnly
        fallback={
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '60vh',
            color: '#888',
            fontFamily: 'monospace',
          }}>
            Loading playground...
          </div>
        }
      >
        {() => {
          const Playground = require('../components/Playground').default;
          return <Playground />;
        }}
      </BrowserOnly>
    </Layout>
  );
}