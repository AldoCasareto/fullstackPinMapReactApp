import { useState, useEffect } from 'react';
import ReactMapGL, { Marker, Popup } from 'react-map-gl';
import { Room, Star } from '@material-ui/icons';
import './App.css';
import axios from 'axios';
import { format } from 'timeago.js';
import Register from './components/Register';
import Login from './components/Login';

function App() {
  const myStorage = window.localStorage;
  const [currentUser, setCurrentUser] = useState(myStorage.getItem('user'));
  const [pins, setPins] = useState([]);
  const [currentPlaceId, setCurrentPlaceId] = useState(null);
  const [newPlace, setNewPlace] = useState(null);
  const [title, setTitle] = useState(null);
  const [description, setDescription] = useState(null);
  const [rating, setRating] = useState(0);
  const [showRegister, setShowRegister] = useState(false);
  const [showLogin, setShowlogin] = useState(false);

  const [viewport, setViewport] = useState({
    width: '100vw',
    height: '100vh',
    latitude: 46,
    longitude: 17,
    zoom: 4,
  });

  const getPins = async () => {
    try {
      const res = await axios.get('/pins');
      setPins(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getPins();
  }, []);

  const handleMarker = (id, lat, long) => {
    setCurrentPlaceId(id);
    setViewport({ ...viewport, latitude: lat, longitude: long });
  };

  const handleAddClick = (e) => {
    const [long, lat] = e.lngLat;
    setNewPlace({ lat, long });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newPin = {
      username: currentUser,
      title,
      description,
      rating,
      lat: newPlace.lat,
      long: newPlace.long,
    };
    try {
      const response = await axios.post('/pins', newPin);
      setPins([...pins, response.data]);
      setNewPlace(null);
    } catch (error) {
      console.log(error);
    }
  };

  const handleLogout = () => {
    myStorage.removeItem('user');
    setCurrentUser(null);
  };

  return (
    <div className='App'>
      <ReactMapGL
        {...viewport}
        mapboxApiAccessToken={process.env.REACT_APP_MAPBOX}
        onViewportChange={(nextViewport) => setViewport(nextViewport)}
        mapStyle='mapbox://styles/acasareto/ckp716h5e3cn818ojr77uercx'
        onDblClick={handleAddClick}
        transitionDuration='200'
      >
        {pins.map((pin) => (
          // const {lat, long, _id} = pin
          <>
            <Marker
              latitude={pin.lat}
              longitude={pin.long}
              offsetLeft={-20}
              offsetTop={-10}
            >
              <Room
                style={{
                  fontSize: viewport.zoom * 5,
                  color: 'red',
                  cursor: 'pointer',
                }}
                onClick={() => handleMarker(pin._id, pin.lat, pin.long)}
              />
            </Marker>
            {pin._id === currentPlaceId && (
              <Popup
                latitude={pin.lat}
                longitude={pin.long}
                closeButton={true}
                closeOnClick={false}
                anchor='left'
                onClose={() => setCurrentPlaceId(null)}
              >
                <div className='card'>
                  <label>Place</label>
                  <h4 className='place'>{pin.title}</h4>
                  <label>Review</label>
                  <p className='description'>{pin.description}</p>
                  <label>{pin.rating}</label>
                  <div className='stars'>
                    {Array(pin.rating).fill(<Star className='star' />)}
                  </div>

                  <label>Information</label>
                  <span className='username'>{pin.username}</span>
                  <span className='date'>{format(pin.createdAt)}</span>
                </div>
              </Popup>
            )}
            {newPlace && (
              <Popup
                latitude={newPlace.lat}
                longitude={newPlace.long}
                closeButton={true}
                closeOnClick={false}
                anchor='left'
                onClose={() => setNewPlace(null)}
              >
                <form onSubmit={handleSubmit}>
                  <label>Title</label>
                  <input
                    type='text'
                    placeholder='Give a Title'
                    onChange={(e) => setTitle(e.target.value)}
                  />
                  <label>Review</label>
                  <textarea
                    placeholder='leave your review'
                    onChange={(e) => setDescription(e.target.value)}
                  />
                  <select onChange={(e) => setRating(e.target.value)}>
                    <option value='1'>1</option>
                    <option value='2'>2</option>
                    <option value='3'>3</option>
                    <option value='4'>4</option>
                    <option value='5'>5</option>
                  </select>
                  <button className='submitButton' type='submit'>
                    Add
                  </button>
                </form>
              </Popup>
            )}
          </>
        ))}
        {currentUser ? (
          <button className='button logout' onClick={handleLogout}>
            Log out
          </button>
        ) : (
          <div className='buttons'>
            <button className='button login' onClick={() => setShowlogin(true)}>
              Login
            </button>
            <button
              className='button register'
              onClick={() => setShowRegister(true)}
            >
              Register
            </button>
          </div>
        )}
        {showRegister && <Register setShowRegister={setShowRegister} />}
        {showLogin && (
          <Login
            setShowlogin={setShowlogin}
            myStorage={myStorage}
            setCurrentUser={setCurrentUser}
          />
        )}
      </ReactMapGL>
    </div>
  );
}

export default App;
