//GET
const [data, setData] = useState([]);
useEffect(() => {
  fetchDataFromServer();
}, []);
const fetchDataFromServer = async () => {
  try {
    const response = await fetch('http://45.9.63.16:3000/api/getUserData');
    if (response.ok) {
      const responseData = await response.json();
      setData(responseData);
    } else {
      console.error('Fehler beim Abrufen der Daten.');
    }
  } catch (error) {
    console.error('Ein Fehler ist aufgetreten:', error);
  }
};
