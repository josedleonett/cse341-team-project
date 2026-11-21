const initializeStationDetails = () => {
    const buttons = document.querySelectorAll('[data-station-id]');
    const dialog = document.getElementById('station-details-dialog');
    const title = document.getElementById('station-details-title');
    const status = document.getElementById('station-details-status');
    const details = document.getElementById('station-details-content');
    const facilitiesList = dialog?.querySelector('[data-station-field="facilities"]');

    if (!dialog || !title || !status || !details || !facilitiesList) {
        return;
    }

    const setField = (field, value) => {
        const element = dialog.querySelector(`[data-station-field="${field}"]`);
        if (element) {
            element.textContent = value;
        }
    };

    const showStationDetails = async (stationId) => {
        dialog.showModal();
        status.textContent = 'Loading station details...';
        details.hidden = true;
        facilitiesList.replaceChildren();

        try {
            const response = await fetch(`/api/stations/${encodeURIComponent(stationId)}`);
            if (!response.ok) {
                throw new Error(`Station request failed with status ${response.status}`);
            }

            const station = await response.json();
            title.textContent = station.name;
            setField('name', station.name);
            setField('prefecture', station.prefecture);
            setField('region', station.region);
            setField('description', station.description);

            station.facilities.forEach((facility) => {
                const item = document.createElement('li');
                item.textContent = facility.split('_').join(' ');
                facilitiesList.appendChild(item);
            });

            status.textContent = '';
            details.hidden = false;
        } catch (error) {
            console.error('Error fetching station details:', error);
            status.textContent = 'Unable to load station details. Please try again.';
        }
    };

    buttons.forEach((button) => {
        button.addEventListener('click', () => showStationDetails(button.dataset.stationId));
    });
};

document.addEventListener('DOMContentLoaded', initializeStationDetails);
