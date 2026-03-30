const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
  if (window.scrollY > 60) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
});

const faqItems = document.querySelectorAll('.faq-item');

faqItems.forEach(item => {
  const pergunta = item.querySelector('.faq-pergunta');

  pergunta.addEventListener('click', () => {
    faqItems.forEach(outro => {
      if (outro !== item) outro.classList.remove('aberto');
    });
    item.classList.toggle('aberto');
  });
});

async function carregarNoticias() {
  const grid = document.getElementById('noticias-grid');

  try {
    const rssUrl = 'https://www.stj.jus.br/sites/portalp/Paginas/Comunicacao/Noticias.aspx';
    const apiUrl = `https://api.rss2json.com/v1/api.json?rss_url=https://www.stj.jus.br/sites/portalp/rss/noticias`;

    const resposta = await fetch(apiUrl);
    const dados = await resposta.json();

    if (dados.status !== 'ok' || !dados.items.length) {
      throw new Error('Sem notícias');
    }
    const noticias = dados.items.slice(0, 3);

    grid.innerHTML = noticias.map(noticia => {
      const data = new Date(noticia.pubDate).toLocaleDateString('pt-BR', {
        day: '2-digit', month: 'long', year: 'numeric'
      });

      return `
        <div class="noticia-card">
          <span class="noticia-data">${data}</span>
          <p class="noticia-titulo">${noticia.title}</p>
          <a href="${noticia.link}" target="_blank" class="noticia-link">Ler mais →</a>
        </div>
      `;
    }).join('');

  } catch (erro) {
    grid.innerHTML = `
      <div class="noticia-card">
        <span class="noticia-data">Notícias do STJ</span>
        <p class="noticia-titulo">Acompanhe as decisões mais recentes do Superior Tribunal de Justiça.</p>
        <a href="https://www.stj.jus.br/sites/portalp/Paginas/Comunicacao/Noticias.aspx" target="_blank" class="noticia-link">Ver no site do STJ →</a>
      </div>
      <div class="noticia-card">
        <span class="noticia-data">Jurisprudência</span>
        <p class="noticia-titulo">Pesquise a jurisprudência atualizada diretamente no portal do STJ.</p>
        <a href="https://scon.stj.jus.br/SCON/" target="_blank" class="noticia-link">Acessar jurisprudência →</a>
      </div>
      <div class="noticia-card">
        <span class="noticia-data">Informativos</span>
        <p class="noticia-titulo">Confira os informativos semanais com os principais julgamentos.</p>
        <a href="https://www.stj.jus.br/sites/portalp/Paginas/Comunicacao/Informativos-de-Jurisprudencia.aspx" target="_blank" class="noticia-link">Ver informativos →</a>
      </div>
    `;
  }
}

carregarNoticias();