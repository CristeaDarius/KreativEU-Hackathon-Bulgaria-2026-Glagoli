import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchPlace, getPlaceName } from '../../lib/api';
import { markVisited, saveToCollection } from '../../lib/appState';
import { useNarration } from '../../context/NarrationContext';
import { useTranslation } from 'react-i18next';
import TTSHighlight from '../../components/TTSHighlight';

const isHeritagePlace = (place) => !String(place?.id || '').toLowerCase().includes('riverside');

const VisitPlace = () => {
  const { placeId } = useParams();
  const navigate = useNavigate();
  const { setNarrationKeys } = useNarration();
  const { t } = useTranslation();
  const [place, setPlace] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [photoTaken, setPhotoTaken] = useState(false);
  const [photoUrl, setPhotoUrl] = useState(null);
  const [saved, setSaved] = useState(false);
  const [visited, setVisited] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const videoRef = React.useRef(null);
  const streamRef = React.useRef(null);

  useEffect(() => {
    setNarrationKeys(['visit.arrived', 'visit.heritage_desc', 'visit.mark_visited', 'visit.back_route', 'visit.take_picture', 'visit.cancel', 'visit.save']);
    setLoading(true);
    fetchPlace(placeId)
      .then(setPlace)
      .catch(() => setError('This stop cannot be opened right now.'))
      .finally(() => setLoading(false));
  }, [placeId]);

  const heritage = isHeritagePlace(place);

  const handlePhoto = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPhotoUrl(URL.createObjectURL(file));
    setPhotoTaken(true);
  };

  const openCamera = async () => {
    setShowCamera(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      streamRef.current = stream;
      if (videoRef.current) videoRef.current.srcObject = stream;
    } catch {
      setShowCamera(false);
      alert('Camera not available. Please use the upload option.');
    }
  };

  const capturePhoto = () => {
    const video = videoRef.current;
    if (!video) return;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext('2d').drawImage(video, 0, 0);
    setPhotoUrl(canvas.toDataURL('image/jpeg'));
    setPhotoTaken(true);
    setShowCamera(false);
    streamRef.current?.getTracks().forEach(t => t.stop());
  };

  const closeCamera = () => {
    setShowCamera(false);
    streamRef.current?.getTracks().forEach(t => t.stop());
  };

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
            <span className="font-['IBM_Plex_Mono'] text-[11px] uppercase tracking-widest text-primary-fixed-dim"><TTSHighlight ttsKey="visit.arrived">{t('visit.arrived')}</TTSHighlight></span>
            <h1 className="text-[31px] leading-9 font-['Stack_Sans_Headline'] font-bold mt-2">{getPlaceName(place)}</h1>
            <p className="text-primary-fixed-dim mt-3 leading-6">
              {heritage ? <TTSHighlight ttsKey="visit.heritage_desc">{t('visit.heritage_desc')}</TTSHighlight> : <TTSHighlight ttsKey="visit.non_heritage_desc">{t('visit.non_heritage_desc')}</TTSHighlight>}
            </p>
          </section>

          {!heritage && (
            <section className="rounded-[24px] bg-surface-container-lowest border border-outline-variant p-5 flex flex-col gap-4">
              <p className="text-on-surface-variant leading-6"><TTSHighlight ttsKey="visit.non_heritage_visit">{t('visit.non_heritage_visit')}</TTSHighlight></p>
              <button type="button" onClick={handleVisited} className="bg-primary text-on-primary py-4 rounded-2xl font-['IBM_Plex_Mono'] text-[14px] font-bold active:scale-[0.98] transition-transform">
                <TTSHighlight ttsKey="visit.mark_visited">{visited ? t('visit.marked_visited') : t('visit.mark_visited')}</TTSHighlight>
              </button>
              <button type="button" onClick={() => navigate('/route-map')} className="bg-surface border border-outline-variant text-on-surface py-4 rounded-2xl font-['IBM_Plex_Mono'] text-[14px] font-bold active:scale-[0.98] transition-transform">
                <TTSHighlight ttsKey="visit.back_route">{t('visit.back_route')}</TTSHighlight>
              </button>
            </section>
          )}

          {/* Step 1: Take photo */}
          {heritage && !photoTaken && (
            <section className="rounded-[28px] bg-surface-container-lowest border border-outline-variant p-5 flex flex-col gap-4 shadow-sm">
              {showCamera ? (
                <>
                  <video ref={videoRef} autoPlay playsInline className="w-full aspect-[4/3] object-cover rounded-[20px] bg-black" />
                  <div className="grid grid-cols-2 gap-3">
                    <button type="button" onClick={closeCamera}
                      className="bg-surface border border-outline-variant text-on-surface py-4 rounded-2xl font-['IBM_Plex_Mono'] text-[13px] font-bold active:scale-[0.98] transition-transform">
                      <TTSHighlight ttsKey="visit.cancel">{t('visit.cancel')}</TTSHighlight>
                    </button>
                    <button type="button" onClick={capturePhoto}
                      className="bg-primary text-on-primary py-4 rounded-2xl font-['IBM_Plex_Mono'] text-[13px] font-bold active:scale-[0.98] transition-transform flex items-center justify-center gap-2">
                      <span className="material-symbols-outlined text-[20px]">camera</span> <TTSHighlight ttsKey="visit.take_picture">{t('visit.take_picture')}</TTSHighlight>
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div className="aspect-[4/3] rounded-[24px] bg-surface-container flex flex-col items-center justify-center text-center gap-3 border border-outline-variant border-dashed">
                    <span className="material-symbols-outlined text-primary text-[48px]">photo_camera</span>
                    <span className="font-['IBM_Plex_Mono'] text-[12px] uppercase tracking-widest text-on-surface-variant">Camera</span>
                  </div>
                  <button type="button" onClick={openCamera}
                    className="bg-primary text-on-primary py-4 rounded-2xl font-['IBM_Plex_Mono'] text-[14px] font-bold active:scale-[0.98] transition-transform flex items-center justify-center gap-2">
                    <span className="material-symbols-outlined text-[20px]">photo_camera</span> <TTSHighlight ttsKey="visit.open_camera">{t('visit.open_camera')}</TTSHighlight>
                  </button>
                  <label className="bg-surface border border-outline-variant text-on-surface py-4 rounded-2xl font-['IBM_Plex_Mono'] text-[14px] font-bold active:scale-[0.98] transition-transform text-center cursor-pointer">
                    <TTSHighlight ttsKey="visit.upload_photo">{t('visit.upload_photo')}</TTSHighlight>
                    <input type="file" accept="image/*" className="hidden" onChange={handlePhoto} />
                  </label>
                  <button type="button" onClick={handleVisited} className="bg-surface border border-outline-variant text-on-surface py-4 rounded-2xl font-['IBM_Plex_Mono'] text-[13px] font-bold active:scale-[0.98] transition-transform">
                    <TTSHighlight ttsKey="visit.mark_no_save">{visited ? t('visit.marked_visited') : t('visit.mark_no_save')}</TTSHighlight>
                  </button>
                </>
              )}
            </section>
          )}

          {/* Step 2: Show photo + Save/Cancel */}
          {heritage && photoTaken && !saved && (
            <section className="rounded-[28px] bg-surface-container-lowest border border-outline-variant p-5 flex flex-col gap-4 shadow-sm">
              {photoUrl && (
                <img src={photoUrl} alt="Your photo" className="w-full aspect-[4/3] object-cover rounded-[20px]" />
              )}
              <div className="grid grid-cols-2 gap-3">
                <button type="button" onClick={() => { setPhotoTaken(false); setPhotoUrl(null); }}
                  className="bg-surface border border-outline-variant text-on-surface py-4 rounded-2xl font-['IBM_Plex_Mono'] text-[13px] font-bold active:scale-[0.98] transition-transform">
                  <TTSHighlight ttsKey="visit.retake">{t('visit.retake')}</TTSHighlight>
                </button>
                <button type="button" onClick={handleSave}
                  className="bg-secondary text-on-secondary py-4 rounded-2xl font-['IBM_Plex_Mono'] text-[13px] font-bold active:scale-[0.98] transition-transform">
                  <TTSHighlight ttsKey="visit.save">{t('visit.save')}</TTSHighlight>
                </button>
              </div>
            </section>
          )}

          {/* Step 3: Saved — show story */}
          {heritage && saved && (            <section className="rounded-[28px] bg-surface-container-lowest border border-outline-variant p-5 flex flex-col gap-4 shadow-sm">
              {photoUrl && (
                <img src={photoUrl} alt="Your photo" className="w-full aspect-[4/3] object-cover rounded-[20px]" />
              )}
              <span className="font-['IBM_Plex_Mono'] text-[11px] uppercase tracking-widest text-outline"><TTSHighlight ttsKey="visit.unlocked">{t('visit.unlocked')}</TTSHighlight></span>
              <div className="text-on-surface leading-6">
                {typeof place.description === 'object' && place.description !== null && Object.keys(place.description).length > 0
                  ? Object.entries(place.description).filter(([k]) => k !== 'sources').map(([key, val]) => (
                      <div key={key} className="mb-4">
                        <span className="font-['IBM_Plex_Mono'] text-[11px] uppercase tracking-widest text-outline block mb-1">{key}</span>
                        <p>{val}</p>
                      </div>
                    ))
                  : <p>{place.additional_info || 'A cultural memory point connected to local identity.'}</p>
                }
              </div>
              <button type="button" onClick={() => navigate('/route-map')}
                className="bg-primary text-on-primary py-4 rounded-2xl font-['IBM_Plex_Mono'] text-[13px] font-bold active:scale-[0.98] transition-transform">
                <TTSHighlight ttsKey="visit.back_route">{t('visit.back_route')}</TTSHighlight>
              </button>
            </section>
          )}

          {/* Always show back button */}
          {heritage && !saved && (
            <button type="button" onClick={() => navigate('/route-map')}
              className="bg-surface border border-outline-variant text-on-surface py-4 rounded-2xl font-['IBM_Plex_Mono'] text-[14px] font-bold active:scale-[0.98] transition-transform">
              <TTSHighlight ttsKey="visit.back_route">{t('visit.back_route')}</TTSHighlight>
            </button>
          )}

          {/* Description always visible */}
          {heritage && !saved && place.description && typeof place.description === 'object' && Object.keys(place.description).filter(k => k !== 'sources').length > 0 && (
          // {heritage && place.description && typeof place.description === 'object' && Object.keys(place.description).filter(k => k !== 'sources').length > 0 && (
            <section className="rounded-[24px] bg-surface-container-lowest border border-outline-variant p-5 flex flex-col gap-4">
              {Object.entries(place.description).filter(([k]) => k !== 'sources').map(([key, val]) => (
                <div key={key}>
                  <span className="font-['IBM_Plex_Mono'] text-[11px] uppercase tracking-widest text-outline block mb-1">{key}</span>
                  <p className="text-on-surface leading-6">{val}</p>
                </div>
              ))}
            </section>
          )}
        </>
      )}
    </div>
  );
};

export default VisitPlace;
