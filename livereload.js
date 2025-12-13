// Auto-reload script during development
(function() {
    const filesToCheck = [
        'index.html',
        'assets/css/style.css',
        'assets/js/app.js',
        'assets/js/i18n.js',
        '_data/products.json',
        '_data/about.json'
    ];

    const fileModTimes = {};

    // Initialize with current mod times
    async function initializeModTimes() {
        for (const file of filesToCheck) {
            try {
                const response = await fetch(file, { method: 'HEAD' });
                const lastModified = response.headers.get('last-modified');
                if (lastModified) {
                    fileModTimes[file] = lastModified;
                }
            } catch (error) {
                console.debug(`Could not check ${file}`);
            }
        }
    }

    // Check for file changes
    async function checkForChanges() {
        for (const file of filesToCheck) {
            try {
                const response = await fetch(file, { method: 'HEAD' });
                const lastModified = response.headers.get('last-modified');
                
                if (lastModified && fileModTimes[file] && fileModTimes[file] !== lastModified) {
                    console.log(`${file} changed, reloading...`);
                    window.location.reload();
                    return;
                }
                
                if (lastModified && !fileModTimes[file]) {
                    fileModTimes[file] = lastModified;
                }
            } catch (error) {
                console.debug(`Could not check ${file}`);
            }
        }
    }

    // Initialize and start checking
    initializeModTimes();
    setInterval(checkForChanges, 1000);
})();
