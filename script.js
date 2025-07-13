document.addEventListener('DOMContentLoaded', function() {
    const tableRows = document.querySelectorAll('tbody tr:not(.rest-day)');
    const pillarCounts = {};
    const pillarColors = [
        '#3498db', '#2ecc71', '#e74c3c', '#f1c40f', '#9b59b6',
        '#1abc9c', '#d35400', '#34495e', '#e67e22', '#27ae60',
        '#c0392b', '#8e44ad', '#00bcd4', '#7f8c8d' // Add more colors if more pillars
    ];
    const pillarNamesOrder = []; // To maintain consistent order for legend

    // Populate pillarCounts and pillarNamesOrder
    tableRows.forEach(row => {
        const pillarCell = row.querySelector('td[data-pillar]');
        if (pillarCell) {
            const pillarText = pillarCell.getAttribute('data-pillar').trim();
            const pillars = pillarText.split('/').map(p => p.trim()); // Handle multiple pillars in one cell

            pillars.forEach(pillar => {
                // Clean up pillar name for consistent counting
                let cleanedPillar = pillar.replace(/\s*\(.*\)/g, '').trim(); // Remove text in parentheses
                if (cleanedPillar.includes('Testimonials') && cleanedPillar.includes('Before vs After relocation')) {
                    cleanedPillar = 'Testimonials / Before vs After'; // Standardize this combined pillar
                } else if (cleanedPillar.includes('5 Reasons Why') && cleanedPillar.includes('Benefits')) {
                     cleanedPillar = '5 Reasons Why / Benefits';
                } else if (cleanedPillar.includes('Study Abroad') && cleanedPillar.includes('Benefits')) {
                     cleanedPillar = 'Study Abroad / Benefits';
                } else if (cleanedPillar === 'Relocation routes per country') {
                     cleanedPillar = 'Relocation Routes per Country';
                } else if (cleanedPillar === 'Benefits of moving to a country (student, parents, children etc) per country') {
                    cleanedPillar = 'Benefits of moving to a country';
                }

                pillarCounts[cleanedPillar] = (pillarCounts[cleanedPillar] || 0) + 1;
                if (!pillarNamesOrder.includes(cleanedPillar)) {
                    pillarNamesOrder.push(cleanedPillar);
                }
            });
        }
    });

    const pillarChart = document.getElementById('pillar-chart');
    const pillarLegend = document.getElementById('pillar-legend');
    let maxCount = 0;

    // Determine max count for chart scaling
    for (const pillar in pillarCounts) {
        if (pillarCounts[pillar] > maxCount) {
            maxCount = pillarCounts[pillar];
        }
    }

    // Create chart bars and legend items
    pillarNamesOrder.forEach((pillarName, index) => {
        const count = pillarCounts[pillarName] || 0;
        const barHeight = (count / maxCount) * 100; // Scale height to 100% of chart area

        // Create Bar
        const bar = document.createElement('div');
        bar.className = 'chart-bar';
        bar.style.height = `${barHeight}%`;
        bar.style.backgroundColor = pillarColors[index % pillarColors.length]; // Assign color from array
        bar.title = `${pillarName}: ${count} posts`; // Tooltip
        bar.innerHTML = `<span>${count}</span>`; // Display count on bar
        pillarChart.appendChild(bar);

        // Create Legend Item
        const legendItem = document.createElement('div');
        legendItem.className = 'legend-item';
        legendItem.innerHTML = `
            <div class="legend-color-box" style="background-color: ${pillarColors[index % pillarColors.length]}"></div>
            <span>${pillarName}</span>
        `;
        document.querySelector('.pillar-legend').appendChild(legendItem);
    });

    // Add data-label to table cells for responsive layout
    const headers = [];
    document.querySelectorAll('th').forEach(header => {
        headers.push(header.textContent.trim());
    });

    tableRows.forEach(row => {
        row.querySelectorAll('td').forEach((cell, index) => {
            cell.setAttribute('data-label', headers[index]);
        });
    });
});
