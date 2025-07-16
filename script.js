// Aguarda o carregamento completo do DOM
document.addEventListener('DOMContentLoaded', function() {
    
    // Elementos do DOM
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    const agendamentoForm = document.getElementById('agendamento-form');
    const formSuccess = document.getElementById('form-success');
    
    // Navegação Mobile
    function initMobileNavigation() {
        if (hamburger && navMenu) {
            hamburger.addEventListener('click', function() {
                hamburger.classList.toggle('active');
                navMenu.classList.toggle('active');
                
                // Previne scroll do body quando menu está aberto
                document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : 'auto';
            });
            
            // Fecha menu ao clicar em um link
            navLinks.forEach(link => {
                link.addEventListener('click', function() {
                    hamburger.classList.remove('active');
                    navMenu.classList.remove('active');
                    document.body.style.overflow = 'auto';
                });
            });
            
            // Fecha menu ao clicar fora dele
            document.addEventListener('click', function(event) {
                if (!hamburger.contains(event.target) && !navMenu.contains(event.target)) {
                    hamburger.classList.remove('active');
                    navMenu.classList.remove('active');
                    document.body.style.overflow = 'auto';
                }
            });
        }
    }
    
    // Scroll suave para âncoras
    function initSmoothScroll() {
        navLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                const href = this.getAttribute('href');
                
                if (href.startsWith('#')) {
                    e.preventDefault();
                    const targetId = href.substring(1);
                    const targetElement = document.getElementById(targetId);
                    
                    if (targetElement) {
                        const headerHeight = document.querySelector('.header').offsetHeight;
                        const targetPosition = targetElement.offsetTop - headerHeight - 20;
                        
                        window.scrollTo({
                            top: targetPosition,
                            behavior: 'smooth'
                        });
                    }
                }
            });
        });
    }
    
    // Header com efeito de scroll
    function initHeaderScroll() {
        const header = document.querySelector('.header');
        let lastScrollTop = 0;
        
        window.addEventListener('scroll', function() {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            
            // Adiciona sombra quando rola
            if (scrollTop > 50) {
                header.style.boxShadow = '0 2px 20px rgba(74, 144, 164, 0.1)';
                header.style.background = 'rgba(255, 255, 255, 0.98)';
            } else {
                header.style.boxShadow = 'none';
                header.style.background = 'rgba(255, 255, 255, 0.95)';
            }
            
            lastScrollTop = scrollTop;
        });
    }
    
    // Animações de entrada
    function initScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fade-in-up');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);
        
        // Elementos para animar
        const animatedElements = document.querySelectorAll(
            '.valor-card, .medico-card, .servico-card, .blog-card, .contato-item'
        );
        
        animatedElements.forEach(el => {
            observer.observe(el);
        });
    }
    
    // Validação e envio do formulário
    function initFormHandling() {
        if (agendamentoForm) {
            agendamentoForm.addEventListener('submit', function(e) {
                e.preventDefault();
                
                // Validação básica
                if (validateForm()) {
                    // Simula envio do formulário
                    submitForm();
                }
            });
        }
    }
    
    // Validação do formulário
    function validateForm() {
        const requiredFields = agendamentoForm.querySelectorAll('[required]');
        const checkboxes = agendamentoForm.querySelectorAll('input[name="atendimento"]');
        let isValid = true;
        let errors = [];
        
        // Limpa erros anteriores
        clearFormErrors();
        
        // Valida campos obrigatórios
        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                showFieldError(field, 'Este campo é obrigatório');
                isValid = false;
            }
        });
        
        // Valida email
        const emailField = document.getElementById('email');
        if (emailField && emailField.value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(emailField.value)) {
                showFieldError(emailField, 'Por favor, insira um email válido');
                isValid = false;
            }
        }
        
        // Valida telefone
        const telefoneField = document.getElementById('telefone');
        if (telefoneField && telefoneField.value) {
            const telefoneRegex = /^[\(\)\s\-\+\d]{10,}$/;
            if (!telefoneRegex.test(telefoneField.value.replace(/\s/g, ''))) {
                showFieldError(telefoneField, 'Por favor, insira um telefone válido');
                isValid = false;
            }
        }
        
        // Valida data (não pode ser no passado)
        const dataField = document.getElementById('data');
        if (dataField && dataField.value) {
            const selectedDate = new Date(dataField.value);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            
            if (selectedDate < today) {
                showFieldError(dataField, 'A data deve ser hoje ou no futuro');
                isValid = false;
            }
        }
        
        // Valida tipo de atendimento
        const checkedBoxes = Array.from(checkboxes).filter(cb => cb.checked);
        if (checkedBoxes.length === 0) {
            const checkboxGroup = document.querySelector('.checkbox-group');
            showGroupError(checkboxGroup, 'Selecione pelo menos um tipo de atendimento');
            isValid = false;
        }
        
        return isValid;
    }
    
    // Mostra erro em campo específico
    function showFieldError(field, message) {
        field.style.borderColor = '#e74c3c';
        
        // Remove erro anterior se existir
        const existingError = field.parentNode.querySelector('.field-error');
        if (existingError) {
            existingError.remove();
        }
        
        // Adiciona nova mensagem de erro
        const errorDiv = document.createElement('div');
        errorDiv.className = 'field-error';
        errorDiv.style.color = '#e74c3c';
        errorDiv.style.fontSize = '0.875rem';
        errorDiv.style.marginTop = '0.25rem';
        errorDiv.textContent = message;
        field.parentNode.appendChild(errorDiv);
    }
    
    // Mostra erro em grupo de elementos
    function showGroupError(group, message) {
        // Remove erro anterior se existir
        const existingError = group.parentNode.querySelector('.group-error');
        if (existingError) {
            existingError.remove();
        }
        
        // Adiciona nova mensagem de erro
        const errorDiv = document.createElement('div');
        errorDiv.className = 'group-error';
        errorDiv.style.color = '#e74c3c';
        errorDiv.style.fontSize = '0.875rem';
        errorDiv.style.marginTop = '0.5rem';
        errorDiv.textContent = message;
        group.parentNode.appendChild(errorDiv);
    }
    
    // Limpa todos os erros do formulário
    function clearFormErrors() {
        // Remove bordas vermelhas
        const fields = agendamentoForm.querySelectorAll('input, select, textarea');
        fields.forEach(field => {
            field.style.borderColor = '';
        });
        
        // Remove mensagens de erro
        const errors = agendamentoForm.querySelectorAll('.field-error, .group-error');
        errors.forEach(error => error.remove());
    }
    
    // Simula envio do formulário
    function submitForm() {
        const submitButton = agendamentoForm.querySelector('.submit-button');
        const originalText = submitButton.innerHTML;
        
        // Mostra loading
        submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
        submitButton.disabled = true;
        
        // Simula delay de envio
        setTimeout(() => {
            // Esconde formulário e mostra mensagem de sucesso
            agendamentoForm.style.display = 'none';
            formSuccess.style.display = 'block';
            
            // Scroll para a mensagem de sucesso
            formSuccess.scrollIntoView({ behavior: 'smooth', block: 'center' });
            
            // Aqui você integraria com seu backend real
            console.log('Formulário enviado:', getFormData());
            
            // Reset do botão (caso o usuário volte ao formulário)
            setTimeout(() => {
                submitButton.innerHTML = originalText;
                submitButton.disabled = false;
            }, 1000);
            
        }, 2000);
    }
    
    // Coleta dados do formulário
    function getFormData() {
        const formData = new FormData(agendamentoForm);
        const data = {};
        
        // Campos simples
        for (let [key, value] of formData.entries()) {
            if (key !== 'atendimento') {
                data[key] = value;
            }
        }
        
        // Checkboxes de atendimento
        const checkboxes = agendamentoForm.querySelectorAll('input[name="atendimento"]:checked');
        data.atendimento = Array.from(checkboxes).map(cb => cb.value);
        
        return data;
    }
    
    // Máscaras para campos
    function initInputMasks() {
        const telefoneField = document.getElementById('telefone');
        
        if (telefoneField) {
            telefoneField.addEventListener('input', function(e) {
                let value = e.target.value.replace(/\D/g, '');
                
                if (value.length <= 11) {
                    if (value.length <= 10) {
                        value = value.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
                    } else {
                        value = value.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
                    }
                }
                
                e.target.value = value;
            });
        }
    }
    
    // Configuração da data mínima
    function initDateField() {
        const dataField = document.getElementById('data');
        if (dataField) {
            const today = new Date();
            const tomorrow = new Date(today);
            tomorrow.setDate(tomorrow.getDate() + 1);
            
            const minDate = tomorrow.toISOString().split('T')[0];
            dataField.setAttribute('min', minDate);
        }
    }
    
    // Efeitos de hover nos cards
    function initCardEffects() {
        const cards = document.querySelectorAll('.valor-card, .medico-card, .servico-card, .blog-card');
        
        cards.forEach(card => {
            card.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-5px)';
            });
            
            card.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0)';
            });
        });
    }
    
    // Lazy loading para imagens
    function initLazyLoading() {
        const images = document.querySelectorAll('img[loading="lazy"]');
        
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.src;
                        img.classList.remove('lazy');
                        imageObserver.unobserve(img);
                    }
                });
            });
            
            images.forEach(img => imageObserver.observe(img));
        }
    }
    
    // Contador de caracteres para textarea
    function initCharacterCounter() {
        const textarea = document.getElementById('comentarios');
        if (textarea) {
            const maxLength = 500;
            
            // Cria contador
            const counter = document.createElement('div');
            counter.className = 'character-counter';
            counter.style.textAlign = 'right';
            counter.style.fontSize = '0.875rem';
            counter.style.color = '#85929E';
            counter.style.marginTop = '0.25rem';
            
            textarea.parentNode.appendChild(counter);
            
            // Atualiza contador
            function updateCounter() {
                const remaining = maxLength - textarea.value.length;
                counter.textContent = `${remaining} caracteres restantes`;
                
                if (remaining < 50) {
                    counter.style.color = '#e74c3c';
                } else {
                    counter.style.color = '#85929E';
                }
            }
            
            textarea.addEventListener('input', updateCounter);
            textarea.setAttribute('maxlength', maxLength);
            updateCounter();
        }
    }
    
    // Inicialização de todas as funcionalidades
    function init() {
        initMobileNavigation();
        initSmoothScroll();
        initHeaderScroll();
        initScrollAnimations();
        initFormHandling();
        initInputMasks();
        initDateField();
        initCardEffects();
        initLazyLoading();
        initCharacterCounter();
        
        console.log('Site Lev inicializado com sucesso!');
    }
    
    // Inicia todas as funcionalidades
    init();
    
    // Utilitários globais
    window.LevSite = {
        // Função para resetar o formulário (útil para testes)
        resetForm: function() {
            if (agendamentoForm) {
                agendamentoForm.reset();
                agendamentoForm.style.display = 'block';
                formSuccess.style.display = 'none';
                clearFormErrors();
            }
        },
        
        // Função para scroll suave para qualquer elemento
        scrollTo: function(elementId) {
            const element = document.getElementById(elementId);
            if (element) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = element.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        }
    };
});

// Service Worker para cache (opcional - para PWA)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js')
            .then(function(registration) {
                console.log('SW registrado com sucesso:', registration.scope);
            })
            .catch(function(registrationError) {
                console.log('Falha no registro do SW:', registrationError);
            });
    });
}

// Tratamento de erros globais
window.addEventListener('error', function(e) {
    console.error('Erro capturado:', e.error);
    // Aqui você pode enviar erros para um serviço de monitoramento
});

// Performance monitoring
window.addEventListener('load', function() {
    setTimeout(function() {
        const perfData = performance.timing;
        const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
        console.log('Tempo de carregamento da página:', pageLoadTime + 'ms');
    }, 0);
});

