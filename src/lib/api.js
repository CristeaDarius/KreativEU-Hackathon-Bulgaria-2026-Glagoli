export const getPlaceId = (place) => String(place?.id || '').trim();

export const getPlaceName = (place) => place?.name || getPlaceId(place) || 'Unknown place';

export const normalizePlaces = (places) => {
  const seen = new Set();

  return (Array.isArray(places) ? places : []).filter(place => {
    const id = getPlaceId(place);
    const key = id.toLowerCase();

    if (!id || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
};

export const fetchPlaces = async () => {
  const res = await fetch('/api/places');
  if (!res.ok) throw new Error('Unable to load places');
  return normalizePlaces(await res.json());
};

export const fetchPlace = async (id) => {
  const cleanId = String(id || '').trim();
  if (!cleanId) throw new Error('Missing place id');

  const res = await fetch(`/api/places/${encodeURIComponent(cleanId)}`);
  if (!res.ok) throw new Error('Unable to load place');
  return res.json();
};
