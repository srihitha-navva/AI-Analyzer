document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('analyze-form');
    const input = document.getElementById('url-input');
    const btn = document.getElementById('submit-btn');
    const loading = document.getElementById('loading-indicator');
    const errorAlert = document.getElementById('error-message');
    const warningAlert = document.getElementById('warning-message');
    const dashboard = document.getElementById('results-dashboard');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const url = input.value.trim();
        if (!url) return;

        // Reset UI State
        errorAlert.classList.add('hidden');
        warningAlert.classList.add('hidden');
        dashboard.classList.add('hidden');
        loading.classList.remove('hidden');
        
        // Lock controls
        input.disabled = true;
        btn.disabled = true;
        btn.querySelector('span').innerText = 'Analyzing...';
        btn.style.opacity = '0.7';

        try {
            const response = await fetch('/api/analyze', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ url })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to analyze website due to an unknown issue.');
            }

            // Bind values to UI elements natively
            populateDashboard(data);
            
            if(data.warning) {
                warningAlert.innerHTML = `<i class="fa-solid fa-triangle-exclamation"></i> ${data.warning}`;
                warningAlert.classList.remove('hidden');
            }
            
            // Pop the dashboard open with CSS animation
            dashboard.classList.remove('hidden');

            setTimeout(() => {
                dashboard.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 100);

        } catch (error) {
            errorAlert.innerHTML = `<i class="fa-solid fa-triangle-exclamation"></i> ${error.message}`;
            errorAlert.classList.remove('hidden');
        } finally {
            // Restore controls
            loading.classList.add('hidden');
            input.disabled = false;
            btn.disabled = false;
            btn.querySelector('span').innerText = 'Analyze';
            btn.style.opacity = '1';
        }
    });

    function populateDashboard(data) {
        // Image & Headers
        document.getElementById('res-screenshot').src = data.screenshot || 'https://via.placeholder.com/800x600/0a0a0f/ffffff?text=Screenshot+Not+Available';
        document.getElementById('res-category').innerText = data.category || 'Information Portal';
        document.getElementById('res-summary').innerText = data.summary || 'Summary generation failed or was empty.';
        
        // Ensure "Structured Text" or Content Layout is visible if we want it dynamic, 
        // though we hardcoded it in HTML. We can just ignore setting the ID if we removed it.
        
        // Populate standard list nodes cleanly
        populateList('res-key-points', data.key_points);
        populateList('res-notes', data.notes);
        populateList('res-resources', data.resources);

        // Tags
        populateTags('res-tech-stack', data.tech_stack);
    }

    function populateList(id, items) {
        const el = document.getElementById(id);
        el.innerHTML = '';
        if (Array.isArray(items) && items.length > 0) {
            items.forEach(item => {
                const li = document.createElement('li');
                li.innerText = item;
                el.appendChild(li);
            });
        } else {
            el.innerHTML = '<li>No clear data identified.</li>';
        }
    }

    function populateTags(id, items) {
        const el = document.getElementById(id);
        el.innerHTML = '';
        if (Array.isArray(items) && items.length > 0) {
            items.forEach(item => {
                const span = document.createElement('span');
                span.innerText = item;
                el.appendChild(span);
            });
        } else {
            el.innerHTML = '<span>Unknown</span>';
        }
    }
});
