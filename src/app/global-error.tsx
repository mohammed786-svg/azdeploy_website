'use client';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body style={{ background: '#0a0a0c', color: '#e8f4f8', fontFamily: 'system-ui, sans-serif', margin: 0, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
        <div style={{ maxWidth: '28rem', width: '100%', textAlign: 'center', border: '1px solid rgba(0,212,255,0.3)', borderRadius: '4px', padding: '2rem', background: 'rgba(0,0,0,0.6)' }}>
          <p style={{ fontSize: '10px', color: '#ef4444', marginBottom: '1rem' }}>ERROR_500 — SYSTEM_FAULT</p>
          <h1 style={{ fontSize: '2rem', fontWeight: 700, color: '#fff', textShadow: '0 0 20px rgba(0,212,255,0.5)', marginBottom: '0.5rem' }}>CRITICAL_FAILURE</h1>
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.875rem', marginBottom: '1.5rem' }}>A critical error occurred. Please try again.</p>
          <button
            type="button"
            onClick={() => reset()}
            style={{ padding: '0.75rem 1.5rem', border: '1px solid #00d4ff', color: '#00d4ff', background: 'transparent', cursor: 'pointer', fontSize: '0.875rem' }}
          >
            RETRY
          </button>
        </div>
      </body>
    </html>
  );
}
