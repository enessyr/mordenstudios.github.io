function toggleAyarlar() {
  const ayar = document.getElementById('ayarlar');
  ayar.style.display = (ayar.style.display === 'block') ? 'none' : 'block';
}

function temaDegistir(tema) {
  document.body.className = tema;
}

function dilDegistir(dil) {
  // Basit örnek dil değişimi
  alert("Dil değiştirildi: " + dil);
}