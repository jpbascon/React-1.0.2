const url = `https://api.spotify.com/v1/artists/0k17h0D3J5VfsdmQ1iZtE8`;

const request = new Request(url, { // Creates a Request object to be sent to Spotify's API
  headers: {
    'Authorization': 'Bearer 123' // Adds authorization header for API access
  }
})

async function getData() {
  try {
    const response = await fetch(request) // Sends the Request object and waits for the server's response
    const data = await response.json() // Reads the response body and parses it into a JavaScript object
    if (response.status === 200) {
      console.log('Success', data); // Logs data if the request was successful
    } else {
      console.log('Server Error', data.error.message); // Logs server error message if status isn't 200
    }

  } catch (error) {
    console.log('Error', error); // Logs network or fetch-related errors (e.g., connection issues)
  }
}

getData();