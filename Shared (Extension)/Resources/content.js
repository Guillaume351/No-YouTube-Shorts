function removeShortsMenuItem() {
    const shortsMenuItem = document.querySelector('a[title="Shorts"]');
    if (shortsMenuItem) {
        const grandParent = shortsMenuItem.closest('ytd-guide-entry-renderer');
        if (grandParent) {
            grandParent.remove();
            console.log("Removed Shorts menu item");
        }
    }
}

function removeShortsMiniMenuItem() {
    const shortsMiniMenuItem = document.querySelector('ytd-mini-guide-entry-renderer[aria-label="Shorts"]');
    if (shortsMiniMenuItem) {
        shortsMiniMenuItem.remove();
        console.log("Removed Shorts mini menu item");
    }
}

function removeShortsReelShelf() {
    document.querySelectorAll('ytd-reel-shelf-renderer').forEach(item => {
        item.remove();
        console.log("Removed Shorts reel shelf");
    });
}

function hideYouTubeShortsElements() {
    console.log("Hiding");

    // Hide the Shorts menu in the sidebar
    document.querySelectorAll('ytd-guide-renderer:not([data-processed])').forEach(item => {
        if (item.querySelector('a[title="Shorts"]')) {
            const grandParent = item.closest('ytd-guide-entry-renderer');
            if (grandParent) {
                grandParent.style.display = 'none';
                grandParent.setAttribute('data-processed', 'true');
                console.log("Removed Shorts from sidebar");
            }
        }
    });

    // Hide Shorts videos in the feed
    document.querySelectorAll('ytd-rich-grid-slim-media[is-short]:not([data-processed])').forEach(video => {
        video.style.display = 'none';
        video.setAttribute('data-processed', 'true');
        console.log("Removed a Shorts video");
    });

    // Attempt to remove the Shorts menu item
    removeShortsMenuItem();
    removeShortsMiniMenuItem();
    removeShortsReelShelf();
}

function removeShortsHeader() {
    const shortsHeaderContainer = document.getElementById('rich-shelf-header-container');
    if (shortsHeaderContainer) {
        shortsHeaderContainer.parentElement.remove();
        console.log("Removed Shorts header container");
    }
}

function debounce(func, wait) {
    let timeout;
    return function(...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func(...args), wait);
    };
}

const observer = new MutationObserver(mutations => {
    for (let mutation of mutations) {
        if (mutation.addedNodes.length) {
            hideYouTubeShortsElements();
            removeShortsHeader();
            break; // No need to continue looping if we already found a mutation
        }
    }
});

observer.observe(document.body, {
    childList: true,
    subtree: true
});

// Initial execution to handle already loaded elements
hideYouTubeShortsElements();
removeShortsHeader();
