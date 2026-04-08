'use client';

import { useState, FormEvent } from 'react';

export default function NewsletterForm() {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [city, setCity] = useState('');
  const [loading, setLoading] = useState(false);
  const [ok, setOk] = useState<boolean | null>(null);
  const [err, setErr] = useState<string | null>(null);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setOk(null);
    setErr(null);

    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          name,
          city,
          // honeypot: campo hidden; lasciarlo vuoto in uso reale
          honeypot: (document.getElementById('company') as HTMLInputElement)?.value || ''
        }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data?.ok) {
        setOk(false);
        setErr(data?.error || 'Errore');
      } else {
        setOk(true);
        setEmail('');
        setName('');
      }
    } catch {
      setOk(false);
      setErr('Network error');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className='formSubscribe'>
      <label className='labelInput'>
        Email Address*
        <input
          type="email"
          className="inputFormSubsIndex"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
          disabled={loading}
          style={{ width: '100%', padding: '10px'}}
        />
      </label>

      <label className='labelInput'>
        Name*
        <input
          type="text"
          className="inputFormSubsIndex"
          value={name}
          onChange={(e) => setName(e.target.value)}
          autoComplete="name"
          disabled={loading}
          style={{ width: '100%', padding: '10px'}}
        />
      </label>

      <label className='labelInput'>
        City*
        <input
          type="text"
          className="inputFormSubsIndex"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          autoComplete="city"
          disabled={loading}
          style={{ width: '100%', padding: '10px'}}
        />
      </label>

      {/* Honeypot anti-bot (nascosto a vista/AT) */}
      <div aria-hidden="true" style={{ position: 'absolute', display:'none' }}>
        <label>
          Company
          <input id="company" name="company" type="text" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

     

      <button
        type="submit"
        className='submitFormSubsIndex'
        disabled={loading}
       
      >
        {loading ? 'Subscribing...' : 'Subscribe \u2192'}
      </button>

      {ok === true && <p style={{ color: '#e6f5ff' }}>Thanks for subscribing.</p>}
      {ok === false && <p style={{ color: '#e6f5ff' }}>Errore: {err}</p>}
    </form>
  );
}
