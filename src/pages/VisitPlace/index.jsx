import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchPlace, getPlaceName } from '../../lib/api';
import { markVisited, saveToCollection } from '../../lib/appState';

const isHeritagePlace = (place) => !String(place?.id || '').toLowerCase().includes('riverside');

const VisitPlace = () => {
  const { placeId } = useParams();
  const navigate = useNavigate();
  const [place, setPlace] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [photoTaken, setPhotoTaken] = useState(false);
  const [saved, setSaved] = useState(false);
  const [visited, setVisited] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetchPlace(placeId)
      .then(setPlace)
      .catch(() => setError('This stop cannot be opened right now.'))
      .finally(() => setLoading(false));
  }, [placeId]);

  const heritage = isHeritagePlace(place);

  const handleVisited = () => {
    if (!place) return;
    markVisited(place);
    setVisited(true);
  };

  const handleSave = () => {
    if (!place) return;
    markVisited(place);
    saveToCollection(place);
    setSaved(true);
  };

  return (
    <div className="px-5 pt-5 pb-8 flex flex-col gap-5">
      {loading && <div className="rounded-2xl bg-surface-container p-5 text-on-surface-variant">Opening stop...</div>}
      {error && <div className="rounded-2xl bg-error-container p-5 text-on-error-container">{error}</div>}

      {place && (
        <>
          <section className="rounded-[28px] bg-primary text-on-primary p-6 shadow-sm">
            <span className="font-['IBM_Plex_Mono'] text-[11px] uppercase tracking-widest text-primary-fixed-dim">You arrived</span>
            <h1 className="text-[31px] leading-9 font-['Stack_Sans_Headline'] font-bold mt-2">{getPlaceName(place)}</h1>
            <p className="text-primary-fixed-dim mt-3 leading-6">
              {heritage ? 'This looks like a heritage stop. Take a demo photo to unlock the story card.' : 'This is a route stop, but not a collection heritage item.'}
            </p>
          </section>

          {!heritage && (
            <section className="rounded-[24px] bg-surface-container-lowest border border-outline-variant p-5 flex flex-col gap-4">
              <p className="text-on-surface-variant leading-6">You can mark this place as visited. It will not be saved to your heritage collection.</p>
              <button type="button" onClick={handleVisited} className="bg-primary text-on-primary py-4 rounded-2xl font-['IBM_Plex_Mono'] text-[14px] font-bold active:scale-[0.98] transition-transform">
                {visited ? 'Marked visited' : 'Mark as visited'}
              </button>
              <button type="button" onClick={() => navigate('/route-map')} className="bg-surface border border-outline-variant text-on-surface py-4 rounded-2xl font-['IBM_Plex_Mono'] text-[14px] font-bold active:scale-[0.98] transition-transform">Back to route</button>
            </section>
          )}

          {heritage && !photoTaken && (
            <section className="rounded-[28px] bg-surface-container-lowest border border-outline-variant p-5 flex flex-col gap-4 shadow-sm">
              <div className="aspect-[4/3] rounded-[24px] bg-surface-container flex flex-col items-center justify-center text-center gap-3 border border-outline-variant border-dashed">
                <span className="material-symbols-outlined text-primary text-[48px]">photo_camera</span>
                <span className="font-['IBM_Plex_Mono'] text-[12px] uppercase tracking-widest text-on-surface-variant">Demo camera</span>
              </div>
              <button type="button" onClick={() => setPhotoTaken(true)} className="bg-primary text-on-primary py-4 rounded-2xl font-['IBM_Plex_Mono'] text-[14px] font-bold active:scale-[0.98] transition-transform">Take picture</button>
              <button type="button" onClick={handleVisited} className="bg-surface border border-outline-variant text-on-surface py-4 rounded-2xl font-['IBM_Plex_Mono'] text-[14px] font-bold active:scale-[0.98] transition-transform">
                {visited ? 'Marked visited' : 'Mark visited without saving'}
              </button>
            </section>
          )}

          {heritage && photoTaken && (
            <section className="rounded-[28px] bg-surface-container-lowest border border-outline-variant p-5 flex flex-col gap-4 shadow-sm">
              <span className="font-['IBM_Plex_Mono'] text-[11px] uppercase tracking-widest text-outline">Unlocked story</span>
              <p className="text-on-surface leading-6">{place.description || place.additional_info || 'A cultural memory point connected to local identity.'}</p>
              <div className="grid grid-cols-2 gap-3">
                <button type="button" onClick={() => navigate('/route-map')} className="bg-surface border border-outline-variant text-on-surface py-4 rounded-2xl font-['IBM_Plex_Mono'] text-[13px] font-bold active:scale-[0.98] transition-transform">Cancel</button>
              <button type="button" onClick={handleSave} className="bg-secondary text-on-secondary py-4 rounded-2xl font-['IBM_Plex_Mono'] text-[13px] font-bold active:scale-[0.98] transition-transform">
                  {saved ? 'Saved' : 'Save'}
                </button>
              </div>
              {saved && (
                <button type="button" onClick={() => navigate('/route-map')} className="bg-primary text-on-primary py-4 rounded-2xl font-['IBM_Plex_Mono'] text-[13px] font-bold active:scale-[0.98] transition-transform">Back to route</button>
              )}
            </section>
          )}
        </>
      )}
    </div>
  );
};

export default VisitPlace;
