const formatLabel = (value) => value.charAt(0).toUpperCase() + value.slice(1);

const populateFilter = (select, values, allLabel, selectedValue) => {
    const fragment = document.createDocumentFragment();
    const allOption = document.createElement('option');
    allOption.value = 'all';
    allOption.textContent = allLabel;
    fragment.appendChild(allOption);

    values.forEach((value) => {
        const option = document.createElement('option');
        option.value = value;
        option.textContent = formatLabel(value);
        fragment.appendChild(option);
    });

    select.replaceChildren(fragment);
    select.value = values.includes(selectedValue) ? selectedValue : 'all';
};

const initializeTripsCatalog = async () => {
    const list = document.getElementById('trips-list');
    const template = document.getElementById('trip-card-template');
    const regionFilter = document.getElementById('region-filter');
    const seasonFilter = document.getElementById('season-filter');
    const loading = document.getElementById('trips-loading');
    const errorMessage = document.getElementById('trips-error');
    const emptyMessage = document.getElementById('trips-empty');

    if (!list || !template || !regionFilter || !seasonFilter || !loading || !errorMessage || !emptyMessage) {
        return;
    }

    try {
        const response = await fetch('/api/trips');
        if (!response.ok) {
            throw new Error(`Failed to load trips (${response.status})`);
        }

        const trips = await response.json();
        if (!Array.isArray(trips)) {
            throw new Error('The Trips API returned an invalid response.');
        }

        const params = new URLSearchParams(window.location.search);
        const regions = [...new Set(trips.map((trip) => trip.region))].sort();
        const seasons = [...new Set(trips.map((trip) => trip.bestSeason).filter(Boolean))].sort();

        populateFilter(regionFilter, regions, 'All Regions', params.get('region'));
        populateFilter(seasonFilter, seasons, 'Any Season', params.get('season'));

        const renderTrips = () => {
            const filteredTrips = trips.filter((trip) => {
                const matchesRegion = regionFilter.value === 'all' || trip.region === regionFilter.value;
                const matchesSeason = seasonFilter.value === 'all' || trip.bestSeason === seasonFilter.value;
                return matchesRegion && matchesSeason;
            });
            const fragment = document.createDocumentFragment();

            filteredTrips.forEach((trip) => {
                const card = template.content.firstElementChild.cloneNode(true);
                card.classList.add(trip.region);
                card.querySelector('[data-field="name"]').textContent = trip.name;
                card.querySelector('[data-field="region"]').textContent = trip.region;
                card.querySelector('[data-field="start-station"]').textContent = trip.startStation;
                card.querySelector('[data-field="end-station"]').textContent = trip.endStation;
                card.querySelector('[data-field="duration"]').textContent = trip.duration;
                card.querySelector('[data-field="distance"]').textContent = `${trip.distance}km`;
                card.querySelector('[data-field="description"]').textContent = trip.description || '';

                const season = card.querySelector('[data-field="season"]');
                season.textContent = trip.bestSeason ? `Best in ${trip.bestSeason}` : '';
                if (trip.bestSeason) {
                    season.classList.add(`season-${trip.bestSeason}`);
                }

                const highlightsContainer = card.querySelector('[data-field="highlights-container"]');
                const highlightsList = card.querySelector('[data-field="highlights"]');
                const highlights = Array.isArray(trip.highlights) ? trip.highlights : [];
                highlights.forEach((highlight) => {
                    const tag = document.createElement('span');
                    tag.className = 'highlight-tag';
                    tag.textContent = highlight;
                    highlightsList.appendChild(tag);
                });
                highlightsContainer.hidden = highlights.length === 0;

                card.querySelector('[data-field="details-link"]').href = `/trips/${encodeURIComponent(trip.id)}`;
                fragment.appendChild(card);
            });

            list.replaceChildren(fragment);
            emptyMessage.hidden = filteredTrips.length > 0;
            loading.hidden = true;
            errorMessage.hidden = true;
        };

        const updateUrl = () => {
            const url = new URL(window.location.href);
            if (regionFilter.value === 'all') {
                url.searchParams.delete('region');
            } else {
                url.searchParams.set('region', regionFilter.value);
            }

            if (seasonFilter.value === 'all') {
                url.searchParams.delete('season');
            } else {
                url.searchParams.set('season', seasonFilter.value);
            }

            window.history.replaceState({}, '', url);
        };

        regionFilter.addEventListener('change', () => {
            updateUrl();
            renderTrips();
        });
        seasonFilter.addEventListener('change', () => {
            updateUrl();
            renderTrips();
        });

        renderTrips();
    } catch (error) {
        console.error('Error fetching trips:', error);
        loading.hidden = true;
        emptyMessage.hidden = true;
        errorMessage.textContent = 'Unable to load trips right now. Please try again.';
        errorMessage.hidden = false;
    }
};

document.addEventListener('DOMContentLoaded', initializeTripsCatalog);
