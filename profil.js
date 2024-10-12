async function loadProfile() {
    console.log('loadProfile Funktion gestartet');
    const profileDiv = document.getElementById('nostr-profile');
    
    try {
        console.log('NostrTools verfügbar:', !!window.NostrTools);
        console.log('Versuche, Profilinformationen abzurufen');
        const pool = new window.NostrTools.SimplePool();
        
        let event = await pool.get(
            ['wss://relay.primal.net'],
            {
                kinds: [0],
                authors: ['77a5e5641a92dac3cec290ab79a9149bcf9deea8654083544a88f6c2ef6208bf']
            }
        );
        
        console.log('Event erhalten:', event);
        
        if (event) {
            const content = JSON.parse(event.content);
            profileDiv.innerHTML = `
                <img src="${content.picture || 'https://placehold.co/200x200?text=Kein+Bild'}" alt="Profilbild" style="width: 200px; height: 200px; object-fit: cover; border-radius: 50%;">
                <h2>${content.name || 'Unbekannter Name'}</h2>
                <p>${content.about || 'Keine Beschreibung verfügbar'}</p>
            `;
            
            // Positioniere das Burgermenü nach dem Laden des Profils
            positionBurgerMenu();
        } else {
            profileDiv.textContent = 'Profil konnte nicht geladen werden.';
        }
        
        pool.close(['wss://relay.primal.net']);
    } catch (error) {
        console.error('Fehler beim Laden des Profils:', error);
        profileDiv.textContent = 'Fehler beim Laden des Profils.';
    }
}

function positionBurgerMenu() {
    const profileName = document.querySelector('#nostr-profile h2');
    const burgerMenu = document.querySelector('.burger-menu');
    const profileImage = document.querySelector('#nostr-profile img');
    if (profileName && burgerMenu && profileImage) {
        const nameRect = profileName.getBoundingClientRect();
        const imageRect = profileImage.getBoundingClientRect();
        burgerMenu.style.top = `${nameRect.top}px`;
        burgerMenu.style.right = `${window.innerWidth - imageRect.right}px`;
    }
}

function setupNostrLink() {
    const nostrLink = document.getElementById('nostr-link');
    nostrLink.addEventListener('click', (e) => {
        e.preventDefault();
        window.open(`https://primal.net/p/${'77a5e5641a92dac3cec290ab79a9149bcf9deea8654083544a88f6c2ef6208bf'}`, '_blank');
    });
}

function setupMenuToggle() {
    const toggler = document.querySelector('.toggler');
    const hamburger = document.querySelector('.hamburger');

    hamburger.addEventListener('click', function(event) {
        event.stopPropagation();
        toggler.checked = !toggler.checked;
    });

    document.addEventListener('click', function(event) {
        const menu = document.querySelector('.menu');
        if (!menu.contains(event.target) && !hamburger.contains(event.target) && toggler.checked) {
            toggler.checked = false;
        }
    });
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        loadProfile();
        setupNostrLink();
        setupMenuToggle();
    });
} else {
    loadProfile();
    setupNostrLink();
    setupMenuToggle();
}

window.addEventListener('resize', positionBurgerMenu);

document.querySelector('.toggler').addEventListener('change', function() {
    console.log('Toggler wurde geklickt. Checked:', this.checked);
});
