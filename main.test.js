const { initializeMapFunctionality } = require("./main");

/**
 * @jest-environment jsdom
 */

describe("initializeMapFunctionality", () => {
  let mapSection;

  beforeEach(() => {
    // Set up the DOM structure
    document.body.innerHTML = `
            <div class="map-section">
                <h3>Map Section</h3>
                <div class="map-placeholder"></div>
            </div>
        `;
    mapSection = document.querySelector(".map-section");
  });

  it("should replace the map placeholder with the map container", () => {
    initializeMapFunctionality();

    const mapContainer = mapSection.querySelector(".map-container");
    expect(mapContainer).not.toBeNull();
    expect(mapSection.querySelector(".map-placeholder")).toBeNull();
  });

  it("should add floor navigation buttons", () => {
    initializeMapFunctionality();

    const floorButtons = mapSection.querySelectorAll(".floor-btn");
    expect(floorButtons.length).toBe(6);
    expect(floorButtons[0].textContent).toBe("Ground Floor");
    expect(floorButtons[1].textContent).toBe("First Floor");
  });

  it("should add a search box", () => {
    initializeMapFunctionality();

    const searchBox = mapSection.querySelector(".search-box");
    expect(searchBox).not.toBeNull();
    expect(searchBox.querySelector(".search-input")).not.toBeNull();
    expect(searchBox.querySelector(".search-results")).not.toBeNull();
  });

  it("should add a legend", () => {
    initializeMapFunctionality();

    const legend = mapSection.querySelector(".legend");
    expect(legend).not.toBeNull();
    const legendItems = legend.querySelectorAll(".legend-item");
    expect(legendItems.length).toBe(4);
    expect(legendItems[0].textContent).toContain("Rooms");
    expect(legendItems[1].textContent).toContain("Boys Washroom");
  });

  it("should add event listeners to floor buttons", () => {
    initializeMapFunctionality();

    const floorButtons = mapSection.querySelectorAll(".floor-btn");
    const firstFloorButton = floorButtons[1];

    firstFloorButton.click();
    expect(firstFloorButton.classList.contains("active")).toBe(true);
    expect(floorButtons[0].classList.contains("active")).toBe(false);
  });

  it("should add search functionality", () => {
    initializeMapFunctionality();

    const searchInput = mapSection.querySelector(".search-input");
    const searchResults = mapSection.querySelector(".search-results");

    // Mock room elements
    document.body.innerHTML += `
            <div class="room" data-room="Library" data-floor="ground"></div>
            <div class="room" data-room="Computer Lab" data-floor="first"></div>
        `;

    searchInput.value = "Library";
    searchInput.dispatchEvent(new Event("input"));

    expect(searchResults.classList.contains("active")).toBe(true);
    expect(searchResults.textContent).toContain("Library (Ground Floor)");
  });
});
