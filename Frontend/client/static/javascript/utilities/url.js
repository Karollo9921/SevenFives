const returnOrigin = (isBackend) => {

  let url;

  if (window.location.origin === 'https://seven-fives.herokuapp.com' || !isBackend ) 
  { 
    url = window.location.origin;
  } else {
    url = 'http://localhost:3000';
  }

  return url;
}

export { returnOrigin };