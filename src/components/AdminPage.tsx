import React, { useState } from 'react';
import { Link2, Copy, MessageSquareText } from 'lucide-react';
import { Toaster, toast } from 'sonner';
import {
  BRIDE_NAME,
  GROOM_NAME,
  GUEST_PREFIXES,
  GuestPrefix,
  getDisplayName,
  getInvitationLink,
  getInvitationMessage,
} from '../lib/wedding';

interface Generated {
  displayName: string;
  link: string;
  message: string;
}

const fieldClass =
  'w-full bg-white px-5 py-3.5 rounded-2xl border border-stone-200 focus:ring-2 focus:ring-brand-gold/30 focus:border-brand-mocha/40 outline-none transition-all duration-300 font-serif text-lg text-brand-mocha placeholder:text-stone-300';
const labelClass = 'block text-[10px] uppercase tracking-[0.2em] font-bold text-brand-sand mb-2 ml-1';
const copyButtonClass =
  'flex-1 inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-full border border-brand-gold/50 bg-white text-brand-mocha font-sans tracking-[0.2em] font-bold text-[10px] uppercase hover:bg-brand-gold/10 transition-all duration-300 active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white';

export const AdminPage: React.FC = () => {
  const [prefix, setPrefix] = useState<GuestPrefix>(GUEST_PREFIXES[0]);
  const [guestName, setGuestName] = useState('');
  const [generated, setGenerated] = useState<Generated | null>(null);

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    const displayName = getDisplayName(prefix, guestName);
    if (!displayName) return;

    const link = getInvitationLink(window.location.origin, displayName);
    setGenerated({ displayName, link, message: getInvitationMessage(displayName, link) });
  };

  const copy = async (text: string, successMessage: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success(successMessage);
    } catch (error) {
      console.error('Copy failed: ', error);
      toast.error('Could not copy. Please select the text and copy it manually.');
    }
  };

  return (
    <div className="min-h-screen font-sans text-brand-mocha bg-brand-champagne bg-texture-paper px-4 py-10 sm:py-16">
      <Toaster position="top-center" />

      <div className="max-w-xl mx-auto">
        <div className="text-center mb-8">
          <span className="text-brand-sand uppercase tracking-[0.4em] text-[10px] font-bold block mb-3">
            {GROOM_NAME} & {BRIDE_NAME}
          </span>
          <h1 className="text-3xl sm:text-4xl font-display text-brand-mocha tracking-tight">Invitation Links</h1>
          <div className="w-12 h-px bg-brand-gold/50 mx-auto mt-5" />
        </div>

        <form
          onSubmit={handleGenerate}
          className="bg-white/80 p-6 sm:p-8 rounded-3xl border border-brand-gold/30 shadow-[0_20px_40px_rgba(197,160,89,0.12)] space-y-5"
        >
          <div>
            <label htmlFor="prefix" className={labelClass}>Select Prefix</label>
            <select
              id="prefix"
              className={`${fieldClass} cursor-pointer`}
              value={prefix}
              onChange={(e) => {
                setPrefix(e.target.value as GuestPrefix);
                setGenerated(null);
              }}
            >
              {GUEST_PREFIXES.map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="guestName" className={labelClass}>Guest Name</label>
            <input
              id="guestName"
              required
              type="text"
              placeholder="e.g. Sanjaya"
              className={fieldClass}
              value={guestName}
              onChange={(e) => {
                setGuestName(e.target.value);
                setGenerated(null);
              }}
            />
          </div>

          <button
            type="submit"
            className="w-full inline-flex items-center justify-center gap-3 bg-brand-mocha text-brand-champagne py-4 rounded-full font-sans tracking-[0.3em] font-bold text-[11px] uppercase hover:bg-brand-mocha/90 transition-all duration-300 shadow-[0_10px_20px_rgba(0,0,0,0.15)] active:scale-[0.98]"
          >
            <Link2 className="w-4 h-4 text-brand-gold" />
            Generate Link
          </button>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              type="button"
              disabled={!generated}
              onClick={() => generated && copy(generated.link, 'Link copied!')}
              className={copyButtonClass}
            >
              <Copy className="w-4 h-4 text-brand-gold" />
              Copy Link Only
            </button>
            <button
              type="button"
              disabled={!generated}
              onClick={() => generated && copy(generated.message, 'Message copied!')}
              className={copyButtonClass}
            >
              <MessageSquareText className="w-4 h-4 text-brand-gold" />
              Copy Full Message
            </button>
          </div>
        </form>

        {generated && (
          <div className="mt-6 bg-white/80 p-6 sm:p-8 rounded-3xl border border-brand-gold/30 shadow-[0_20px_40px_rgba(197,160,89,0.12)] space-y-6">
            <div>
              <span className={labelClass}>Generated Link</span>
              <a
                href={generated.link}
                target="_blank"
                rel="noopener noreferrer"
                className="block bg-brand-champagne/70 px-5 py-3.5 rounded-2xl border border-brand-gold/30 font-mono text-sm text-brand-sand break-all hover:border-brand-gold transition-colors duration-300"
              >
                {generated.link}
              </a>
            </div>

            <div>
              <span className={labelClass}>Message Preview</span>
              <p className="bg-brand-champagne/70 px-5 py-4 rounded-2xl border border-brand-gold/30 font-serif text-lg leading-relaxed text-brand-mocha whitespace-pre-wrap break-words">
                {generated.message}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
