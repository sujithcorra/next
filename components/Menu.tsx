import Link from 'next/link';
import React from 'react';

export default function Menu() {
  return (
    <div className="menu">
      <Link href="/plp">getServerSideProps</Link>
      <Link href="/test">ClientSideRendering</Link>
      <Link href="/sample">getStaticProps</Link>
    </div>
  );
}
