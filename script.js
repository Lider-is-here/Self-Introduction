document.addEventListener('DOMContentLoaded', function() {
    const navbar = document.getElementById('navbar');
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');
    const heroCard = document.querySelector('.hero-card');
    const skillProgressBars = document.querySelectorAll('.skill-progress');
    const animateElements = document.querySelectorAll('.animate-fade-up');
    const contactForm = document.getElementById('contactForm');

    let lastScrollY = window.scrollY;

    // 导航栏滚动效果
    function handleNavbarScroll() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        lastScrollY = window.scrollY;
    }

    window.addEventListener('scroll', handleNavbarScroll);
    handleNavbarScroll();

    // 移动端菜单切换
    hamburger.addEventListener('click', function() {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // 点击导航链接关闭移动端菜单
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    // 点击页面其他区域关闭菜单
    document.addEventListener('click', (e) => {
        if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        }
    });

    // 导航链接高亮（基于滚动位置）
    function updateActiveNavLink() {
        const sections = document.querySelectorAll('section[id]');
        const scrollPosition = window.scrollY + 100;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    window.addEventListener('scroll', updateActiveNavLink);

    // Hero卡片3D悬浮效果
    if (heroCard) {
        const hero = document.querySelector('.hero');

        hero.addEventListener('mousemove', (e) => {
            const rect = hero.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = (y - centerY) / 25;
            const rotateY = (centerX - x) / 25;

            heroCard.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
        });

        hero.addEventListener('mouseleave', () => {
            heroCard.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
        });
    }

    // 元素进入视口时的渐入动画
    const observerOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -80px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');

                // 如果是技能进度条的父元素，触发进度条动画
                if (entry.target.closest('.skill-card')) {
                    const progressBars = entry.target.closest('.skill-card').querySelectorAll('.skill-progress');
                    progressBars.forEach(bar => {
                        const width = bar.getAttribute('data-width');
                        bar.style.width = width;
                    });
                }

                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    animateElements.forEach(el => observer.observe(el));

    // 技能进度条单独观察（确保在视口中时才动画）
    const skillObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const width = entry.target.getAttribute('data-width');
                entry.target.style.width = width;
                skillObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    skillProgressBars.forEach(bar => skillObserver.observe(bar));

    // 表单提交处理
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const formData = new FormData(contactForm);
            const submitBtn = contactForm.querySelector('.btn-submit');
            const originalText = submitBtn.textContent;

            submitBtn.textContent = '发送中...';
            submitBtn.disabled = true;

            setTimeout(() => {
                alert('消息已发送！感谢您的联系。');
                contactForm.reset();
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }, 1500);
        });
    }

    // 平滑滚动到锚点（兼容性处理）
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                const navHeight = navbar.offsetHeight;
                const targetPosition = targetElement.offsetTop - navHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // 页面加载完成后的初始化动画
    window.addEventListener('load', () => {
        document.body.classList.add('loaded');

        // 确保Hero区的卡片立即显示
        const heroCardAnimated = document.querySelector('.hero-card.animate-fade-up');
        if (heroCardAnimated) {
            setTimeout(() => {
                heroCardAnimated.classList.add('visible');
            }, 200);
        }
    });

    // 防抖函数用于性能优化
    function debounce(func, wait = 10) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // 使用防抖优化滚动事件
    window.addEventListener('scroll', debounce(updateActiveNavLink, 10));
});
