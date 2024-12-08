// Fetching API key using POST method, gets API key
async function getApiKey() {
  try {
    let response = await fetch( // Send POST request to return the API key.
      "https://n5n3eiyjb0.execute-api.eu-north-1.amazonaws.com/keys", 
      {
        method: "POST",
      }
    );
    if (!response.ok) { // Checks if response is not OK, throws error if it isn't.
      throw new Error("Failed to fetch API key"); // Error message that will be displayed if it fails.
    }
    let data = await response.json(); // If response is successful, respondse is parsed as JSON and returns the API key.

    return data.key;
  } catch (error) { // If any Errors occur, it is caught here and logges error message below.
    console.error("Error fetching API key:", error);
  }
}

// Fetching planet data using GET, use our returned API key to open up "locked away information."
async function fetchPlanets(apiKey) {
  try {
    let response = await fetch( // Send a GET request with the API key in headers.
      "https://n5n3eiyjb0.execute-api.eu-north-1.amazonaws.com/bodies",
      {
        method: "GET",
        headers: { "x-zocom": apiKey }, // API key is passed in headers under the key "x-zocom."
      }
    );
    if (!response.ok) { // Checks if the responsive is not OK and logs out error message.
      throw new Error(`Error: ${response.status}`);
    }
    let data = await response.json(); // If respons is successful, response is parsed as JSON.
    return data;
  } catch (error) { // If any Errors occur, it is caught here and logges error message.
    console.error("Error fetching planets:", error);
  }
}

// Main controller to load solar system data, ties together the process of fetching API key, retrieving planet data and rendering data on page.
async function loadSolarSystemData() { // async function that allows other parts of program to run while it waits for other tasks to complete.
  const apiKey = await getApiKey(); // Since it is a promise, await pauses this line until the promise is resolved or until an error occurs.

  if (!apiKey) { // If it fails and the API key can not be retrieved, stop execution, error message will be displayed.
    console.error("Failed to retrieve API key. Cannot continue.");
    return;
  }

  const planets = await fetchPlanets(apiKey); // Fetch planet data using API key as a parameter, await pauses execution until data is fetched.
  if (!planets || !planets.bodies) { // If planets data is null, undefined, missing or malformed, the function logs the error and execution stops.
    console.error("Planets data is missing or malformed.");
    return;
  }

  console.log("Planets data:", planets.bodies); // Logging planet data for debugging.

  //Accessing individual planets from the `bodies` array through their index, assigning variables for them.
  const sun = planets.bodies[0];
  const mercury = planets.bodies[1];
  const venus = planets.bodies[2];
  const earth = planets.bodies[3];
  const mars = planets.bodies[4];
  const jupiter = planets.bodies[5];
  const saturn = planets.bodies[6];
  const uranus = planets.bodies[7];
  const neptune = planets.bodies[8];


console.log(planets.bodies); // Logs planets.
const planetList = document.getElementById("planet-list"); // Select element to display planet list.

// Loop through each planet and create HTML content for it.
planets.bodies.forEach((body) => { // Using forEach to loop through each planet in the bodies array and creates a new li element for every planet filling it with HTML content.
    const listItem = document.createElement("li");

    // Creates and fills out the HTML for each planet.
    listItem.innerHTML = ` 
  <section class="planet-container">
    <section class="planet-details">
        <h2><b>${body.name}</b></h2>
        <p><b>Latin: </b> ${body.latinName}</p>
        <p><b>Typ: </b>${body.type}</p>
        <p><b>Rotation: </b>${body.rotation} jorddygn</p>
        <p><b>Omkrets: </b>${body.circumference} km</p>
        <p><b>Temperatur Dag: </b>${body.temp.day} &deg;C</p>
        <p><b>Temperatur Natt: </b>${body.temp.night} &deg;C</p>
        <p><b>Avstånd från Solen: </b>${body.distance} km</p>
        <p><b>Omloppsperiod: </b>${body.orbitalPeriod} jorddagar</p><br>
        <p><b>Beskrivning:  </b>${body.desc}</p><br>

        <p><b>Månar:</b></p>
        <section class="moons-list">
            ${body.moons && body.moons.length > 0 ? body.moons.map(moon => `<span class="moon-name">${moon}</span>`).join(', ') : "Saknar månar"}
        </section>
    </section>
</section>
  `;
    
  planetList.appendChild(listItem); // Appends the new li elements to the planetList.
});


 // SEARCH BAR START
const searchBar = document.getElementById("search-bar"); // Targeting elements by their id name.
const searchButton = document.getElementById("search-button"); // Targeting elements by their id name.
const clearButton = document.getElementById("clear-button"); // Targeting elements by their id name.
const searchResult = document.getElementById("search-result"); // Targeting elements by their id name.
const planetsVisuals = document.querySelectorAll(".planets-drawings > section"); // Selects all the section elements inside the container, these elements visually represents the planets on the page.

// Function to perform search
function performSearch() { // This is the function that performs the search.
  const query = searchBar.value.toLowerCase().trim(); // Converts user input to lowercase and tims spaces to ensure consistent matching.
  searchResult.innerHTML = ""; // Clear previous results.

  if (query === "") { // If input field is empty, the alert below is shown.
    alert("Du måste skriva in en planet för att söka.");
    return;
  }

  let matches = 0; // Initializes a counter to keep track on matching planets.

  // Match search input with planet names.
  planets.bodies.forEach((planet, index) => { // For matching planets, a new search result is added to search results container.
    if (planet.name.toLowerCase().includes(query)) { // Converts user input to lowercase to ensure consistent matching.
      matches++; // Incraments counter for each matching planet. 

       // Create a search result section for the planet details.
       const listItem = document.createElement("section");
       listItem.classList.add("planet-container"); // Adds "planet-container" class to the section element, allowing us to style it with CSS.
       // Set innerHTML, display name, latin name, type etc.
       listItem.innerHTML = ` 
         <section class="planet-details">
             <h2><b>${planet.name}</b></h2>
             <p><b>Latin: </b> ${planet.latinName}</p>
             <p><b>Typ: </b>${planet.type}</p>
             <p><b>Rotation: </b>${planet.rotation} jorddygn</p>
             <p><b>Omkrets: </b>${planet.circumference} km</p>
             <p><b>Temperatur Dag: </b>${planet.temp.day} &deg;C</p>
             <p><b>Temperatur Natt: </b>${planet.temp.night} &deg;C</p>
             <p><b>Avstånd från Solen: </b>${planet.distance} km</p>
             <p><b>Omloppsperiod: </b>${planet.orbitalPeriod} jorddagar</p><br>
             <p><b>Beskrivning: </b>${planet.desc}</p><br>
             <p><b>Månar:</b></p>
             <section class="moons-list">
                 ${planet.moons && planet.moons.length > 0 // Checks if moons porperty exists and contains atleast one moon.
                   ? planet.moons.map(moon => `<span class="moon-name">${moon}</span>`).join(', ') // Loops through moons array and creates span elements for each moon, joins them with a comma, if no moons are available, message below will be displayed.
                   : "Saknar månar"}
             </section> 
         </section>
       `;
       searchResult.appendChild(listItem); // Append the element to listItem.
    


      // Scroll to the visual planet and highlight it
      listItem.addEventListener("click", function () { // Using an event listener so the something happens when it is triggered. 
        const visualPlanet = planetsVisuals[index]; // Match the visual planet by index in array.


        // Temporarily highlight the planet being serched for in white circle.
        visualPlanet.classList.add("highlight");
        setTimeout(() => visualPlanet.classList.remove("highlight"), 2000); // Highlights planet that have been searched for, for 2 sec.
      });

      searchResult.appendChild(listItem); //Appends seachresult to listItem.

    }
  });

  // If no matches found when searching for planets, display the error message below.
  if (matches === 0) {
    const noResult = document.createElement("li");
    noResult.textContent = "Hittade inga planeter med detta namn."; // Will be displayed if no planets are found.
    searchResult.appendChild(noResult); // No result found.
  }
}

// Event listeners
searchButton.addEventListener("click", performSearch); // Here an event listener is added to the search button so that something actually happens when user presses enter key.
searchBar.addEventListener("keydown", (e) => {
  if (e.key === "Enter") performSearch(); // Search when pressing down enter key.
});

clearButton.addEventListener("click", function() { // Eventlistener is added to clear key, meaning something will happen, results will clear, when button is pressed.
    searchBar.value = ""; // Clears search bar.
    searchResult.innerHTML = ""; // Clear search result.
});
 // SEARCH BAR STOP 


 //STARS START
 function drawBackground() { // Fills canvas with black background color to represent outer space. 
    ctx.fillStyle = "black"; // Sets fill color to black.
    ctx.fillRect(0, 0, canvas.width, canvas.height); // Fills entire canvas.
 }
 const canvas = document.getElementById("starCanvas"); // Target the canvas element for drawing stars.
 const ctx = canvas.getContext("2d"); // Gets the 2D drawing context providing methods to draw shapes.
 canvas.width = window.innerWidth; // Setting height and width of browser window.
 canvas.height = window.innerHeight; // Setting height and width of browser window.
 
 function drawStars() { // Generates 100 random starts by drawing white cricles (stars) at random positions on the canvas.
     for (let i = 0; i <100; i++) { // Loops 100 times to create 100 stars.
        // Generates random position and size for each star within canvas
         const x = Math.random() * canvas.width; // Random x-coordinate within the canvas width.
         const y = Math.random() * canvas.height; // Random y-coordinate within the canvas height.
         const size = Math.random() * 2; // Generates a random size for the star, up to maximum of 2px in radius.

         ctx.fillStyle = "white"; // Fills stars with white color.
         ctx.beginPath(); // Starts new drawing path for each star.
         ctx.arc(x, y, size, 0, Math.PI * 2); // Draws circle at (x, y) with radius `size`.
         ctx.fill(); // Fills shape with white.
     }
 }
 drawBackground(); // Calls function filling canvas with black background color to mimic outer space.
  drawStars(); // Calls function adding 100 random white circles to mimic stars. 
 //STARS STOP

}

loadSolarSystemData(); // Calls the function to fetch the API key and planet data. It processes the data and renders it so the user can see it on the webpage.