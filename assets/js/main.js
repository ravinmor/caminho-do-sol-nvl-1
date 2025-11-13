document.addEventListener('DOMContentLoaded', () => {

    // --- Funcionalidade do Menu Mobile ---
    const menuToggle = document.getElementById('menuToggle');
    const mobileNav = document.getElementById('mobileNav');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

    if (menuToggle && mobileNav) {
        menuToggle.addEventListener('click', () => {
            mobileNav.classList.toggle('active');
            menuToggle.classList.toggle('active');
        });
    }
    
    mobileNavLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileNav.classList.remove('active');
            menuToggle.classList.remove('active');
        });
    });

    // --- Preloader ---
    window.addEventListener('load', () => {
        const preloader = document.getElementById('preloader');
        if (preloader) {
            // Adiciona a classe que faz o fade-out
            preloader.classList.add('fade-out');
            
            // (Opcional) Remove do DOM após a transição para limpar
            setTimeout(() => {
                preloader.style.display = 'none';
            }, 3000); // 500ms deve ser igual ao tempo de transition no CSS
        }
    });

    // --- CORRIGIDO: Funcionalidade da Paginação (Dots) ---
    
    const sections = document.querySelectorAll('main section');
    const dots = document.querySelectorAll('.pagination-dots .dot');
    const dotsContainer = document.querySelector('.pagination-dots');

    if (sections.length > 0 && dots.length > 0 && sections.length === dots.length) {
        
        // 2. Funcionalidade de Scroll (Atualiza o dot ativo)
        const observerOptions = {
            root: null,
            // CORREÇÃO: Define a "linha de ativação" como o centro exato da tela.
            // Qualquer seção que cruzar esta linha será "isIntersecting".
            rootMargin: "-50% 0px -50% 0px",
            threshold: 0 // Ativa assim que a seção tocar a linha central
        };

        const sectionObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Pega o índice da seção que cruzou o centro
                    const index = Array.from(sections).indexOf(entry.target);
                    
                    // Remove 'active' de TODOS os dots
                    dots.forEach(dot => dot.classList.remove('active'));
                    
                    // Adiciona 'active' apenas ao dot correspondente
                    dots[index].classList.add('active');
                }
            });
        }, observerOptions);

        sections.forEach(section => {
            sectionObserver.observe(section);
        });

        // 3. Funcionalidade de Clique (Rola para a seção)
        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                const targetSection = sections[index];

                // CORREÇÃO: Manda o navegador alinhar o CENTRO da seção
                // com o CENTRO da tela. Isso garante que o observer
                // (que também usa o centro) será disparado.
                targetSection.scrollIntoView({ 
                    behavior: 'smooth',
                    block: 'center' // Esta é a mudança chave
                });
            });
        });

    } else {
        if (dotsContainer) {
            dotsContainer.style.display = 'none';
        }
        console.warn('Pagination dots hidden: Mismatch between number of dots and sections.');
    }


    // --- Animação de Scroll (Reveal) ---
    // (Seu código original, sem alterações)
    const revealElements = document.querySelectorAll('.reveal');

    const revealObserverOptions = {
        root: null, 
        rootMargin: '0px',
        threshold: 0.1 
    };

    const revealObserverCallback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    };

    const revealObserver = new IntersectionObserver(revealObserverCallback, revealObserverOptions);

    revealElements.forEach(el => {
        revealObserver.observe(el);
    });

    // --- Funcionalidade de Copiar PIX ---
    const btnCopyPix = document.getElementById('btnCopyPix');
    const feedbackMsg = document.getElementById('copyFeedback');

    if (btnCopyPix) {
        btnCopyPix.addEventListener('click', () => {
            // Pega apenas o número limpo do atributo data-key
            const pixKey = btnCopyPix.getAttribute('data-key');

            // Usa a API da área de transferência
            navigator.clipboard.writeText(pixKey).then(() => {
                
                // Visual de Sucesso
                const originalText = btnCopyPix.innerHTML;
                btnCopyPix.innerHTML = "Copiado! ✅";
                btnCopyPix.style.borderColor = "#25D366";
                btnCopyPix.style.color = "#25D366";
                
                // Mostra a mensagem abaixo (opcional)
                if(feedbackMsg) feedbackMsg.style.opacity = '1';

                // Volta ao normal depois de 2 segundos
                setTimeout(() => {
                    btnCopyPix.innerHTML = originalText;
                    btnCopyPix.style.borderColor = "transparent";
                    btnCopyPix.style.color = ""; // Volta a cor do CSS
                    if(feedbackMsg) feedbackMsg.style.opacity = '0';
                }, 2000);

            }).catch(err => {
                console.error('Erro ao copiar: ', err);
                alert("Erro ao copiar automaticamente. Por favor, selecione e copie manualmente.");
            });
        });
    }
});