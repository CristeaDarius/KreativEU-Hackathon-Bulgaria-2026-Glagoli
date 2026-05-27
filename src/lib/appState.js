const readJson = (key, fallback) => {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
};

const writeJson = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value));
};

export const isLoggedIn = () => localStorage.getItem('locaiaLoggedIn') === 'true';

export const setLoggedIn = () => localStorage.setItem('locaiaLoggedIn', 'true');

export const getProfile = () => readJson('locaiaProfile', null);

export const saveProfile = (profile) => writeJson('locaiaProfile', profile);

export const getPlan = () => readJson('locaiaPlan', null);

export const savePlan = (plan) => writeJson('locaiaPlan', plan);

export const getCollection = () => readJson('locaiaCollection', []);

export const saveToCollection = (place) => {
  const current = getCollection();
  if (current.some(item => item.id?.toLowerCase() === place.id?.toLowerCase())) return current;

  const next = [{ ...place, savedAt: new Date().toISOString() }, ...current];
  writeJson('locaiaCollection', next);
  return next;
};

export const getVisited = () => readJson('locaiaVisited', []);

export const markVisited = (place) => {
  const current = getVisited();
  if (current.some(item => item.id?.toLowerCase() === place.id?.toLowerCase())) return current;

  const next = [{ id: place.id, name: place.name, visitedAt: new Date().toISOString() }, ...current];
  writeJson('locaiaVisited', next);
  return next;
};
