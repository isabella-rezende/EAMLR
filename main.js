// ══════════════════════════════
//   1. NAVBAR — efeito ao rolar
// ══════════════════════════════

const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
  if (window.scrollY > 60) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
});


// ══════════════════════════════
//   2. NAVBAR — link ativo
//   Destaca o link da página atual
// ══════════════════════════════

const paginaAtual = window.location.pathname.split('/').pop();
// Ex: "sobre.html", "index.html", ""

const linksNav = document.querySelectorAll('.nav-links a');

linksNav.forEach(link => {
  const href = link.getAttribute('href');

  // Compara o href do link com a página atual
  if (
    href === paginaAtual ||
    (paginaAtual === '' && href === 'index.html')
  ) {
    link.classList.add('ativo');
  }
});


// ══════════════════════════════
//   3. ANIMAÇÃO AO ROLAR
//   Elementos com classe .reveal
//   aparecem suavemente ao entrar
//   na tela
// ══════════════════════════════

const elementosReveal = document.querySelectorAll('.reveal');

// IntersectionObserver: observa quando
// o elemento entra na área visível
const observador = new IntersectionObserver((entradas) => {
  entradas.forEach((entrada, i) => {
    if (entrada.isIntersecting) {
      // Atraso escalonado: cada elemento
      // aparece 100ms depois do anterior
      setTimeout(() => {
        entrada.target.classList.add('visivel');
      }, i * 100);

      // Para de observar depois de animar
      observador.unobserve(entrada.target);
    }
  });
}, {
  threshold: 0.1 // Dispara quando 10% do elemento está visível
});

elementosReveal.forEach(el => observador.observe(el));


// ══════════════════════════════
//   4. BOTÃO VOLTAR AO TOPO
// ══════════════════════════════

const btnTopo = document.getElementById('btn-topo');

if (btnTopo) {
  // Mostra o botão só após rolar 400px
  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      btnTopo.classList.add('visivel');
    } else {
      btnTopo.classList.remove('visivel');
    }
  });

  // Ao clicar, vai suavemente ao topo
  btnTopo.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}


// ══════════════════════════════
//   5. FAQ — abrir e fechar
// ══════════════════════════════

const faqItems = document.querySelectorAll('.faq-item');

faqItems.forEach(item => {
  const pergunta = item.querySelector('.faq-pergunta');

  if (pergunta) {
    pergunta.addEventListener('click', () => {
      faqItems.forEach(outro => {
        if (outro !== item) outro.classList.remove('aberto');
      });
      item.classList.toggle('aberto');
    });
  }
});


// ══════════════════════════════
//   6. NOTÍCIAS — Feed RSS STJ
// ══════════════════════════════

async function carregarNoticias() {
  const grid = document.getElementById('noticias-grid');
  if (!grid) return;

  try {
    const apiUrl = `https://api.rss2json.com/v1/api.json?rss_url=https://www.stj.jus.br/sites/portalp/rss/noticias`;
    const resposta = await fetch(apiUrl);
    const dados = await resposta.json();

    if (dados.status !== 'ok' || !dados.items.length) throw new Error();

    const noticias = dados.items.slice(0, 3);

    grid.innerHTML = noticias.map(noticia => {
      const data = new Date(noticia.pubDate).toLocaleDateString('pt-BR', {
        day: '2-digit', month: 'long', year: 'numeric'
      });
      return `
        <div class="noticia-card reveal">
          <span class="noticia-data">${data}</span>
          <p class="noticia-titulo">${noticia.title}</p>
          <a href="${noticia.link}" target="_blank" class="noticia-link">Ler mais →</a>
        </div>
      `;
    }).join('');

  } catch {
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
// FAQ das Áreas
const areaFaqs = document.querySelectorAll('.area-faq');

areaFaqs.forEach(item => {
  const pergunta = item.querySelector('.area-faq-pergunta');

  if (pergunta) {
    pergunta.addEventListener('click', () => {
      areaFaqs.forEach(outro => {
        if (outro !== item) outro.classList.remove('aberto');
      });
      item.classList.toggle('aberto');
    });
  }
});
// ══════════════════════════════
//   7. ENVIO DE FORMULÁRIO (AJAX)
// ══════════════════════════════

const formContato = document.getElementById('form-contato');
const mensagemSucesso = document.getElementById('mensagem-sucesso');

if (formContato) {
  formContato.addEventListener('submit', async function(e) {
    e.preventDefault(); // Impede o redirecionamento padrão
    
    const btnSubmit = formContato.querySelector('.form-btn');
    btnSubmit.textContent = 'Enviando...';
    btnSubmit.disabled = true;

    const formData = new FormData(formContato);

    try {
      const response = await fetch(formContato.action, {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json'
        }
      });

      if (response.ok) {
        // Esconde o formulário e mostra a mensagem de sucesso
        formContato.style.display = 'none';
        document.querySelector('.contato-form-sub').style.display = 'none';
        mensagemSucesso.style.display = 'block';
      } else {
        alert('Ocorreu um problema ao enviar. Por favor, tente novamente ou nos chame no WhatsApp.');
        btnSubmit.textContent = 'Enviar mensagem';
        btnSubmit.disabled = false;
      }
    } catch (error) {
      alert('Ocorreu um erro de conexão. Por favor, tente novamente ou nos chame no WhatsApp.');
      btnSubmit.textContent = 'Enviar mensagem';
      btnSubmit.disabled = false;
    }
  });
}
// --- LÓGICA DO MENU MOBILE ---
const menuBtn = document.getElementById('mobile-menu');
const navMenu = document.getElementById('nav-menu');

if (menuBtn) {
    menuBtn.addEventListener('click', () => {
        navMenu.classList.toggle('active');
    });
}

// --- MÁSCARA DE TELEFONE ---
const inputTelefone = document.getElementById('telefone');

if (inputTelefone) {
    inputTelefone.addEventListener('input', (e) => {
        let x = e.target.value.replace(/\D/g, '').match(/(\d{0,2})(\d{0,5})(\d{0,4})/);
        e.target.value = !x[2] ? x[1] : '(' + x[1] + ') ' + x[2] + (x[3] ? '-' + x[3] : '');
    });
}