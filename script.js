document.addEventListener('DOMContentLoaded', function() {
    const navbar = document.getElementById('navbar');
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');
    const heroCard = document.querySelector('.hero-card');
    const animateElements = document.querySelectorAll('.animate-fade-up');
    const contactForm = document.getElementById('contactForm');
    const blurCircle = document.getElementById('blurCircle');

    let lastScrollY = window.scrollY;

    // ==================== 双层缓动鼠标光标 ====================
    const cursor = {
        dot: document.querySelector('.cursor-dot'),
        ring: document.querySelector('.cursor-ring'),
        container: document.querySelector('.custom-cursor'),
        mouseX: 0,
        mouseY: 0,
        ringX: 0,
        ringY: 0,
        isHovering: false,
        isClicking: false
    };

    // 检测设备是否支持hover
    const isTouchDevice = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
    
    if (!isTouchDevice && cursor.container) {
        // 不隐藏默认光标，让小圆圈跟随
        cursor.container.style.display = 'block';

        // 内层小圆点精确跟随（使用transform优化性能）
        document.addEventListener('mousemove', (e) => {
            cursor.mouseX = e.clientX;
            cursor.mouseY = e.clientY;
            cursor.dot.style.transform = `translate(${cursor.mouseX}px, ${cursor.mouseY}px) translate(-50%, -50%)`;
        });

        // 外层圆环缓动跟随（使用transform优化性能）
        function animateRing() {
            const lerpFactor = 0.15; // 缓动系数，越小越慢
            cursor.ringX += (cursor.mouseX - cursor.ringX) * lerpFactor;
            cursor.ringY += (cursor.mouseY - cursor.ringY) * lerpFactor;
            
            cursor.ring.style.transform = `translate(${cursor.ringX}px, ${cursor.ringY}px) translate(-50%, -50%)`;
            
            requestAnimationFrame(animateRing);
        }
        animateRing();

        // 交互元素检测
        const interactiveElements = document.querySelectorAll('a, button, .skill-card, .experience-item, .work-card, .social-icons a');
        
        interactiveElements.forEach(element => {
            element.addEventListener('mouseenter', () => {
                cursor.isHovering = true;
                cursor.ring.classList.add('hover');
            });
            
            element.addEventListener('mouseleave', () => {
                cursor.isHovering = false;
                cursor.ring.classList.remove('hover');
            });
        });

        // 点击效果
        document.addEventListener('mousedown', () => {
            cursor.isClicking = true;
            cursor.dot.classList.add('click');
            cursor.ring.classList.add('click');
        });

        document.addEventListener('mouseup', () => {
            cursor.isClicking = false;
            cursor.dot.classList.remove('click');
            cursor.ring.classList.remove('click');
        });

        // ==================== 磁吸悬浮效果 ====================
        const magneticElements = document.querySelectorAll('.btn, .skill-card, .experience-item, .work-card');
        
        magneticElements.forEach(element => {
            element.classList.add('magnetic-element');
            
            element.addEventListener('mousemove', (e) => {
                const rect = element.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                
                const strength = 0.1; // 磁吸强度（作品区域减弱）
                element.style.transform = `translate(${x * strength}px, ${y * strength}px)`;
            });
            
            element.addEventListener('mouseleave', () => {
                element.style.transform = 'translate(0, 0)';
            });
        });
    }

    // ==================== 页面滚动入场动画 ====================
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const scrollObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // 动画完成后停止观察
                scrollObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // 为所有需要动画的元素添加观察者
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    animatedElements.forEach(element => {
        scrollObserver.observe(element);
    });

    // ==================== 数字滚动增长动画 ====================
    const numberCounterOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.5
    };

    const numberObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.classList.contains('counter-animated')) {
                const target = entry.target;
                const finalNumber = target.dataset.number;
                target.classList.add('counter-animated', 'counting');
                
                animateNumber(target, 0, parseInt(finalNumber), 2000);
                numberObserver.unobserve(target);
            }
        });
    }, numberCounterOptions);

    // 查找所有带数字的元素并添加观察者
    const infoValues = document.querySelectorAll('.info-value');
    infoValues.forEach(element => {
        const text = element.textContent;
        const numberMatch = text.match(/^(\d+)$/); // 只匹配纯数字
        
        if (numberMatch) {
            const number = numberMatch[0];
            const textWithoutNumber = text.replace(numberMatch[0], '');
            
            element.innerHTML = `<span class="counter-number" data-number="${number}">0</span>${textWithoutNumber}`;
            
            const counterElement = element.querySelector('.counter-number');
            if (counterElement) {
                numberObserver.observe(counterElement);
            }
        }
    });

    function animateNumber(element, start, end, duration) {
        const startTime = performance.now();
        const easeOutQuart = (t) => 1 - Math.pow(1 - t, 4);
        
        function update(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easedProgress = easeOutQuart(progress);
            
            const currentNumber = Math.floor(start + (end - start) * easedProgress);
            element.textContent = currentNumber;
            
            if (progress < 1) {
                requestAnimationFrame(update);
            } else {
                element.textContent = end;
                setTimeout(() => {
                    element.classList.remove('counting');
                }, 100);
            }
        }
        
        requestAnimationFrame(update);
    }

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

    // 元素进入视口时的渐入动画（旧版，保留用于技能进度条）
    const oldObserverOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -80px 0px'
    };

    const oldObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                oldObserver.unobserve(entry.target);
            }
        });
    }, oldObserverOptions);

    animateElements.forEach(el => oldObserver.observe(el));

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

    // 项目卡片点击跳转
    document.querySelectorAll('[data-link]').forEach(card => {
        card.style.cursor = 'pointer';
        card.addEventListener('click', () => {
            window.location.href = card.dataset.link;
        });
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
