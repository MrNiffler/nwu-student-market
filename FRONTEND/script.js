document.addEventListener('DOMContentLoaded', () => {
  const grid = document.getElementById('productsGrid');
  const searchInput = document.getElementById('searchInput');

  // Only run marketplace logic if we're on that page
  if (grid) {
    // fetch dummy data (requires Live Server or hosting)
    fetch('dummyData.json')
      .then(resp => resp.json())
      .then(data => {
        window._products = data; // keep in global for filtering
        renderProducts(data);
      })
      .catch(err => {
        console.error('Could not load dummy data:', err);
        grid.innerHTML = '<p>Unable to load listings. Make sure you run this with Live Server.</p>';
      });

    function renderProducts(items) {
      grid.innerHTML = '';
      if (!items.length) {
        grid.innerHTML = '<p>No listings found.</p>';
        return;
      }

      items.forEach(item => {
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
          <img src="${item.image}" alt="${escapeHtml(item.title)}">
          <div class="title">${escapeHtml(item.title)}</div>
          <div class="price">${escapeHtml(item.price)}</div>
          <div class="meta">Category: ${escapeHtml(item.category)}</div>
        `;
        card.addEventListener('click', () => {
          // placeholder action — later connect to product detail or messaging
          alert(`Clicked: ${item.title}\nSeller: ${item.seller}`);
        });
        grid.appendChild(card);
      });
    }

    // Simple client-side search
    if (searchInput) {
      searchInput.addEventListener('input', () => {
        const q = searchInput.value.trim().toLowerCase();
        if (!q) {
          renderProducts(window._products || []);
          return;
        }
        const filtered = (window._products || []).filter(p =>
          p.title.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q)
        );
        renderProducts(filtered);
      });
    }
  }

  // small escape function to avoid injecting HTML from data
  function escapeHtml(str) {
    return String(str).replace(/[&<>"'`=\/]/g, s =>
      ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;', '/': '&#x2F;' })[s]
    );
  }
});
