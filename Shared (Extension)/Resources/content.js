browser.runtime.sendMessage({ greeting: "hello" }).then((response) => {
    console.log("Received response: ", response);
});

browser.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log("Received request: ", request);
});

function removeShortsMenuItem() {
    const shortsMenuItem = Array.from(document.querySelectorAll('tp-yt-paper-item')).find(item => {
        return item.textContent.includes('Shorts');
    });

    if (shortsMenuItem) {
        // Navigate to the grandparent element
        const grandParent = shortsMenuItem.parentElement?.parentElement;
        if (grandParent) {
            grandParent.remove();
            console.log("Removed grandparent of Shorts menu item");
        }
    }
}


function hideYouTubeShortsElements() {
    // Hide the Shorts menu in the sidebar
    const shortsMenuItems = document.querySelectorAll('ytd-guide-renderer:not([data-processed])');
    shortsMenuItems.forEach(item => {
        if (item.querySelector('.title') && item.querySelector('.title').textContent.trim() === 'Shorts') {
            item.style.display = 'none';
            item.setAttribute('data-processed', 'true');
            console.log("Removed Shorts from sidebar");
        }
    });

    // Hide Shorts videos in the feed
    const shortsVideos = document.querySelectorAll('ytd-rich-grid-slim-media[is-short]:not([data-processed])');
    shortsVideos.forEach(video => {
        video.style.display = 'none';
        video.setAttribute('data-processed', 'true');
        console.log("Removed a Shorts video");
    });

    // Attempt to remove the Shorts menu item
    removeShortsMenuItem();
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

    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };

        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
};

const debouncedHideYouTubeShorts = debounce(hideYouTubeShortsElements, 500);

const observer = new MutationObserver(mutations => {
    mutations.forEach(mutation => {
        if (mutation.addedNodes.length) {
            debouncedHideYouTubeShorts();
            removeShortsHeader();
        }
    });
});

observer.observe(document.body, {
    childList: true,
    subtree: true
});
