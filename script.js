document.addEventListener('DOMContentLoaded', () => {

    // --- 1. UNIFIED SCROLL HANDLER ---
    // Manages all scroll-based events for performance and stability.
    const handleScrollEvents = () => {
        const scrollY = window.scrollY;
        
        // Progress Bar
        const progressBar = document.getElementById('progressBar');
        if (progressBar) {
            const scrollTotal = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const progress = (scrollY / scrollTotal) * 100;
            progressBar.style.width = progress + "%";
        }

        // Jump to Top Button
        const jumpToTopBtn = document.getElementById('jumpToTopBtn');
        if (jumpToTopBtn) {
            jumpToTopBtn.classList.toggle('visible', scrollY > 300);
        }
    };
    window.addEventListener('scroll', handleScrollEvents);

    // --- 2. INTERACTIVE SIDEBAR CHECKLIST ---
    const checklistToggleBtn = document.getElementById('checklistToggleBtn');
    const closeSidebarBtn = document.getElementById('closeSidebarBtn');
    const checklistSidebar = document.getElementById('checklistSidebar');
    const sidebarOverlay = document.getElementById('sidebarOverlay');
    const checklistCheckboxes = document.querySelectorAll('.checklist-item input[type="checkbox"]');

    if (checklistToggleBtn && checklistSidebar && closeSidebarBtn && sidebarOverlay) {
        const toggleSidebar = () => {
            checklistSidebar.classList.toggle('active');
            sidebarOverlay.classList.toggle('active');
        };
        [checklistToggleBtn, closeSidebarBtn, sidebarOverlay].forEach(el => el.addEventListener('click', toggleSidebar));
    }

    if (checklistCheckboxes.length > 0) {
        const updateChecklist = () => {
            const progress = {};
            checklistCheckboxes.forEach(checkbox => {
                progress[checkbox.dataset.task] = checkbox.checked;
                checkbox.closest('.checklist-item').classList.toggle('completed', checkbox.checked);
            });
            localStorage.setItem('checklistProgress', JSON.stringify(progress));
        };
        const loadChecklist = () => {
            const progress = JSON.parse(localStorage.getItem('checklistProgress')) || {};
            checklistCheckboxes.forEach(checkbox => {
                checkbox.checked = progress[checkbox.dataset.task] || false;
            });
            updateChecklist(); // Also updates styling
        };
        checklistCheckboxes.forEach(checkbox => checkbox.addEventListener('change', updateChecklist));
        loadChecklist(); // Load progress on page start
    }

    // --- 3. FAQ ACCORDION ---
    document.querySelectorAll('.faq-item').forEach(item => {
        const question = item.querySelector('.faq-question');
        question.addEventListener('click', () => {
            const answer = item.querySelector('.faq-answer');
            const isActive = item.classList.toggle('active');
            answer.style.maxHeight = isActive ? answer.scrollHeight + 'px' : null;
        });
    });

    // --- 4. PROCESS TABS ---
    const tabsContainer = document.querySelector('.tabs-container');
    if (tabsContainer) {
        const tabButtons = tabsContainer.querySelectorAll('.tab-btn');
        const tabContents = tabsContainer.querySelectorAll('.tab-content');
        tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                const targetTab = button.dataset.tab;
                tabButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                tabContents.forEach(content => content.classList.toggle('active', content.dataset.tab === targetTab));
            });
        });
    }

    // --- 5. HORIZONTAL TIMELINE DRAG-TO-SCROLL ---
    const timeline = document.querySelector('.timeline-wrapper');
    if (timeline) {
        let isDown = false, startX, scrollLeft;
        timeline.addEventListener('mousedown', (e) => { isDown = true; startX = e.pageX - timeline.offsetLeft; scrollLeft = timeline.scrollLeft; });
        timeline.addEventListener('mouseleave', () => { isDown = false; });
        timeline.addEventListener('mouseup', () => { isDown = false; });
        timeline.addEventListener('mousemove', (e) => { if (!isDown) return; e.preventDefault(); const x = e.pageX - timeline.offsetLeft; const walk = x - startX; timeline.scrollLeft = scrollLeft - walk; });
    }

    // --- 6. ROTATING TIPS ---
    const tipTextElement = document.getElementById('rotating-tip-text');
    if (tipTextElement) {
        const tips = ["Always start with the 'Why'.", "Empower managers; they are your change champions.", "Over-communicate: clarity prevents anxiety."];
        let currentTipIndex = 0;
        setInterval(() => {
            currentTipIndex = (currentTipIndex + 1) % tips.length;
            tipTextElement.style.opacity = '0';
            setTimeout(() => { tipTextElement.textContent = tips[currentTipIndex]; tipTextElement.style.opacity = '1'; }, 300);
        }, 5000);
    }
    
    // --- 7. ACTIVE NAV LINK ON SCROLL ---
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-menu a');
    if (navLinks.length > 0 && sections.length > 0) {
        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    navLinks.forEach(link => {
                        link.classList.toggle('active', link.getAttribute('href').substring(1) === entry.target.id);
                    });
                }
            });
        }, { rootMargin: "-30% 0px -70% 0px" });
        sections.forEach(section => observer.observe(section));
    }
});
