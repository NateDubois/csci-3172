let catalogData = [];
let sortAscending = true;
let loadFailed = false;
let statusTimer = null;

// How long to wait after the last keystroke before announcing the count,
// so screen readers aren't flooded while someone is typing.
const STATUS_DELAY_MS = 400;

const byId = id => document.getElementById(id);

// Fetch the scraped dataset when page loads
document.addEventListener("DOMContentLoaded", () => {
    fetch("data/search_index.json")
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            catalogData = Array.isArray(data) ? data : [];
            filterAndRender("load");
        })
        .catch(error => {
            console.error("Error loading search index:", error);
            loadFailed = true;
            setStatus("", true);
            byId("resultsError").textContent =
                "Failed to load data/search_index.json. Check the file is next to index.html, then refresh the page.";
        });

    byId("searchInput").addEventListener("input", () => filterAndRender("filter"));
    byId("classFilter").addEventListener("change", () => filterAndRender("filter"));
    byId("sortBtn").addEventListener("click", toggleSort);
    byId("clearBtn").addEventListener("click", clearFilters);

    byId("searchForm").addEventListener("submit", event => event.preventDefault());
});

// Filter data dynamically based on user input
function filterAndRender(reason = "filter") {
    if (loadFailed) return;

    const searchTerm = byId("searchInput").value.toLowerCase().trim();
    const selectedClass = byId("classFilter").value;

    const filtered = catalogData.filter(item => {
        // Match against name or class properties in your JSON objects
        const matchesName = item.name ? item.name.toLowerCase().includes(searchTerm) : false;
        const matchesClassSearch = item.class ? item.class.toLowerCase().includes(searchTerm) : false;
        const matchesQuery = matchesName || matchesClassSearch;

        const matchesClassDropdown = selectedClass === "" || item.class === selectedClass;

        return matchesQuery && matchesClassDropdown;
    });

    // Apply sorting to filtered results
    filtered.sort((a, b) => {
        const nameA = a.name || "";
        const nameB = b.name || "";
        return sortAscending
            ? nameA.localeCompare(nameB)
            : nameB.localeCompare(nameA);
    });

    renderCatalog(filtered);
    announceResults(filtered.length, reason);
}

// Toggle Sort Direction
function toggleSort() {
    sortAscending = !sortAscending;
    byId("sortBtn").textContent = sortAscending ? "Sort: A-Z" : "Sort: Z-A";
    filterAndRender("sort");
}

// Reset the search box and class filter, then put focus back in the search box
function clearFilters() {
    byId("searchInput").value = "";
    byId("classFilter").value = "";
    filterAndRender("clear");
    byId("searchInput").focus();
}

// Update the live region with the current result count
function announceResults(count, reason) {
    let message;

    if (count === 0) {
        message = "No results found. Try a different name or class, or clear the filters.";
    } else {
        message = `${count} ${count === 1 ? "result" : "results"} found`;
        if (reason === "sort") {
            message += `, sorted ${sortAscending ? "A to Z" : "Z to A"}`;
        }
        message += ".";
    }

    if (reason === "clear") {
        message = `Filters cleared. ${message}`;
    }

    setStatus(message, reason !== "filter");
}

function setStatus(message, immediate) {
    const status = byId("resultsStatus");
    clearTimeout(statusTimer);

    if (immediate) {
        status.textContent = message;
    } else {
        statusTimer = setTimeout(() => {
            status.textContent = message;
        }, STATUS_DELAY_MS);
    }
}

// Escape scraped text before it goes into innerHTML
function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, char => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    }[char]));
}

// Render elements into Bootstrap grid cards
function renderCatalog(items) {
    const list = byId("resultsList");

    list.innerHTML = items.map(item => `
        <li class="col-md-4 mb-4">
            <article class="card h-100 shadow-sm item-card">
                <div class="card-body">
                    <h3 class="card-title card-title-custom">${escapeHtml(item.name || "Unknown")}</h3>
                    <dl class="card-meta mb-0">
                        <div><dt>Class</dt> <dd>${escapeHtml(item.class || "N/A")}</dd></div>
                        <div><dt>Release Date</dt> <dd>${escapeHtml(item.releaseDate || "N/A")}</dd></div>
                        <div><dt>Last Changed</dt> <dd>${escapeHtml(item.version || "N/A")}</dd></div>
                    </dl>
                </div>
            </article>
        </li>
    `).join("");
}