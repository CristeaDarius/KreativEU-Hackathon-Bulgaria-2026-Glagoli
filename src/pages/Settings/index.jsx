import React from 'react';

const Settings = () => {
  return (
    <div className="px-5 pt-5 flex flex-col gap-5">
      <section>
        <span className="font-['IBM_Plex_Mono'] text-[11px] uppercase tracking-widest text-outline">Preferences</span>
        <h1 className="text-[30px] leading-9 font-['Stack_Sans_Headline'] font-bold text-primary mt-1">Settings</h1>
        <p className="text-on-surface-variant mt-2 leading-6">Mobile-first options for a more comfortable cultural route.</p>
      </section>
      {[
        { icon: 'accessible_forward', title: 'Accessible mode', text: 'Prioritize clear text, simple movement, and readable stops.' },
        { icon: 'volume_up', title: 'Audio stories', text: 'Prepare narrated heritage descriptions for each stop.' },
        { icon: 'translate', title: 'Language', text: 'English route content for the hackathon demo.' },
      ].map(item => (
        <article key={item.title} className="rounded-[22px] bg-surface-container-lowest border border-outline-variant p-4 flex gap-4 shadow-sm">
          <span className="w-12 h-12 rounded-2xl bg-secondary-container text-secondary flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined">{item.icon}</span>
          </span>
          <span>
            <span className="block text-[18px] font-['Stack_Sans_Headline'] font-semibold text-on-surface">{item.title}</span>
            <span className="block text-[14px] leading-5 text-on-surface-variant mt-1">{item.text}</span>
          </span>
        </article>
      ))}
    </div>
  );
};

export default Settings;
