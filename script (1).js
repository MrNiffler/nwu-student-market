document.addEventListener('DOMContentLoaded', () => {
  const grid = document.getElementById('productsGrid');
  const searchInput = document.getElementById('searchInput');

  // Function to show notification messages
  function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    document.body.appendChild(notification);

    // Auto-remove after 3 seconds
    setTimeout(() => {
      notification.classList.add('fade-out');
      setTimeout(() => notification.remove(), 300);
    }, 3000);
  }

  
  if (grid) {
    // Fetch dummy data
    fetch('dummyData.json')
      .then(resp => {
        if (!resp.ok) throw new Error('Failed to fetch data');
        return resp.json();
      })
      .then(data => {
        window._products = data;
        renderProducts(data);
        showNotification('Products loaded successfully!', 'success');
      })
      .catch(err => {
        console.error('Could not load dummy data:', err);
        grid.innerHTML = '<p>Unable to load listings. Make sure you run this with Live Server.</p>';
        showNotification('Failed to load products. Please try again.', 'error');
      });

    function renderProducts(items) {
      grid.innerHTML = '';
      if (!items.length) {
        grid.innerHTML = '<p>No listings found.</p>';
        showNotification('No products match your search.', 'info');
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
          showNotification(`Viewing: ${item.title}`, 'success');
          // Placeholder action
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
          showNotification('Showing all products.', 'info');
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

  // Small escape function to avoid injecting HTML from data
  function escapeHtml(str) {
    return String(str).replace(/[&<>"'`=\/]/g, s =>
      ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;', '/': '&#x2F;' })[s]
    );
  }
});