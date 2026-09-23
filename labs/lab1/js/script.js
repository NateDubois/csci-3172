let masterProduceData = [];
const produceMap = new Map();
let sortAscending = true;

document.addEventListener('DOMContentLoaded', async function() {
    const catalogContainer = document.getElementById('produceCatalog');
    const searchInput = document.getElementById('searchInput');
    const typeFilter = document.getElementById('typeFilter');
    const sortBtn = document.getElementById('sortBtn');

    try {
        const response = await fetch('data/data.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        masterProduceData = await response.json();
        
        masterProduceData.forEach(item => {
            produceMap.set(item.name.toLowerCase(), {
                type: item.type,
                colour: item.colour
            });
        });

        // Initial render of all items
        renderProduce(masterProduceData);

    } catch (error) {
        console.error("Failed to fetch or parse data/data.json:", error);
        catalogContainer.innerHTML = `<div class="col-12 text-danger">Failed to load inventory data from data/data.json. Make sure you are running a local server (like Live Server).</div>`;
    }

    // Function to handle filtering and sorting logic
    function updateDisplay() {
        const searchTerm = searchInput.value.toLowerCase().trim();
        const selectedType = typeFilter.value;

        let filteredData = masterProduceData.filter(item => {
            const matchesSearch = item.name.toLowerCase().includes(searchTerm) || 
                                  item.colour.toLowerCase().includes(searchTerm);
            const matchesType = selectedType === "" || item.type === selectedType;
            return matchesSearch && matchesType;
        });

        // Use .sort() to organize items dynamically
        filteredData.sort((a, b) => {
            if (sortAscending) {
                return a.name.localeCompare(b.name);
            } else {
                return b.name.localeCompare(a.name);
            }
        });

        renderProduce(filteredData);
    }

    // Render function using .map() to transform array data into DOM strings
    function renderProduce(dataArray) {
        if (dataArray.length === 0) {
            catalogContainer.innerHTML = `<div class="col-12 text-muted text-center py-3">No matching produce found.</div>`;
            return;
        }

        // Use .map() to create HTML string elements, then join them together
        const cardsHTML = dataArray.map(item => `
            <div class="col-md-4 mb-3">
                <div class="card h-100 border-secondary shadow-sm">
                    <div class="card-body">
                        <h5 class="card-title text-success font-weight-bold">${item.name}</h5>
                        <h6 class="card-subtitle mb-2 text-muted">Type: ${item.type}</h6>
                        <p class="card-text mb-0">Colour: <span class="badge badge-pill badge-light border">${item.colour}</span></p>
                    </div>
                </div>
            </div>
        `).join('');

        catalogContainer.innerHTML = cardsHTML;
    }

    if (searchInput) searchInput.addEventListener('input', updateDisplay);
    if (typeFilter) typeFilter.addEventListener('change', updateDisplay);
    
    if (sortBtn) {
        sortBtn.addEventListener('click', function() {
            sortAscending = !sortAscending;
            sortBtn.textContent = sortAscending ? "Sort by Name: A-Z" : "Sort by Name: Z-A";
            updateDisplay();
        });
    }

    const form = document.getElementById('addProduceForm');
    
    if (form) {
        form.addEventListener('submit', function(event) {
            event.preventDefault(); // Prevent actual page reload

            // Get form values
            const method = document.getElementById('httpMethod').value;
            const name = document.getElementById('produceName').value.trim();
            const type = document.getElementById('produceType').value.trim();
            const colour = document.getElementById('produceColour').value.trim();

            let httpMessage = "";

            if (method === "GET") {
                const queryString = `name=${encodeURIComponent(name)}&type=${encodeURIComponent(type)}&colour=${encodeURIComponent(colour)}`;
                
                httpMessage = `GET /api/produce?${queryString} HTTP/1.1\n` +
                              `Host: localhost:8080\n` +
                              `User-Agent: ProduceClient/1.0\n` +
                              `Accept: application/json\n\n`;
            } else if (method === "POST") {
                const payload = JSON.stringify({
                    produceName: name,
                    produceType: type,
                    produceColour: colour
                }, null, 2);

                httpMessage = `POST /api/produce HTTP/1.1\n` +
                              `Host: localhost:8080\n` +
                              `User-Agent: ProduceClient/1.0\n` +
                              `Content-Type: application/json\n` +
                              `Content-Length: ${payload.length}\n\n` +
                              payload;
            }

            document.getElementById('httpMessageOutput').textContent = httpMessage;
        });
    }
});