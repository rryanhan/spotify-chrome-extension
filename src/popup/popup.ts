// src/popup/popup.ts
document.getElementById('search')?.addEventListener('input', (e) => {
    const searchTerm = (e.target as HTMLInputElement).value;
    console.log('Search Term:', searchTerm);
  });
  