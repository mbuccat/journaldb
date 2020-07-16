const API_URL = window.location.hostname === 'localhost'
  ? 'http://localhost:8000'
  : 'https://journaldb.herokuapp.com';

export default API_URL;
