import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import i18n from '../../i18n';

const SUPPORTED = ['en', 'ro', 'bg', 'sk', 'pl'];

const ChangeLanguage = () => {
  const { lang } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (SUPPORTED.includes(lang)) {
      i18n.changeLanguage(lang);
      localStorage.setItem('lang', lang);
    }
    navigate('/', { replace: true });
  }, [lang, navigate]);

  return null;
};

export default ChangeLanguage;
