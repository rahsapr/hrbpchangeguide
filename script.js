document.addEventListener('DOMContentLoaded', () => {

    // --- Core Interactive Component Functions ---

    // 1. Sticky Navigation & Progress Bar
    const initHeaderFeatures = () => {
        const progressBar = document.getElementById('progressBar');
        const updateProgressBar = () => {
            const scrollTotal = document.documentElement.scrollHeight - window.innerHeight;
            const scrollPercentage = (window.scrollY / scrollTotal) * 100;
            progressBar.style.width = `${scrollPercentage}%`;
        };
        window.addEventListener('scroll', updateProgressBar);
    };

    // 2. Active Navigation Link Highlighting
    const initActiveNavHighlighting = () => {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-link');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    navLinks.forEach(link => {
                        link.classList.remove('active');
                        if (link.getAttribute('href').substring(1) === entry.target.id) {
                            link.classList.add('active');
                        }
                    });
                }
            });
        }, { rootMargin: '-30% 0px -70% 0px' });
        sections.forEach(section => observer.observe(section));
    };

    // 3. Hamburger Menu for Mobile
    const initHamburgerMenu = () => {
        const hamburger = document.getElementById('hamburger-menu');
        const navLinksContainer = document.querySelector('.nav-links');
        const navLinks = document.querySelectorAll('.nav-link');
        hamburger.addEventListener('click', () => {
            navLinksContainer.classList.toggle('open');
            hamburger.setAttribute('aria-expanded', navLinksContainer.classList.contains('open'));
        });
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (navLinksContainer.classList.contains('open')) {
                    navLinksContainer.classList.remove('open');
                    hamburger.setAttribute('aria-expanded', false);
                }
            });
        });
    };

    // 4. Expandable Sidebar Checklist with localStorage Persistence
    const initSidebarChecklist = () => {
        const toggleBtn = document.getElementById('checklist-toggle');
        const closeBtn = document.getElementById('close-sidebar');
        const sidebar = document.getElementById('sidebar-checklist');
        const overlay = document.getElementById('sidebar-overlay');
        const checklistItems = document.querySelectorAll('.checklist-item input[type="checkbox"]');
        const quickLinks = document.querySelectorAll('.checklist-item .quick-link');
        const storageKey = 'hrbpPlaybookCheckedTasks';

        const openSidebar = () => { sidebar.classList.add('open'); overlay.classList.add('visible'); document.body.classList.add('sidebar-open'); };
        const closeSidebar = () => { sidebar.classList.remove('open'); overlay.classList.remove('visible'); document.body.classList.remove('sidebar-open'); };

        const loadCheckedState = () => {
            const checkedTasks = JSON.parse(localStorage.getItem(storageKey)) || [];
            checklistItems.forEach(checkbox => checkbox.checked = checkedTasks.includes(checkbox.dataset.id));
        };
        const saveCheckedState = () => {
            const checkedTasks = Array.from(checklistItems).filter(cb => cb.checked).map(cb => cb.dataset.id);
            localStorage.setItem(storageKey, JSON.stringify(checkedTasks));
        };
        
        toggleBtn.addEventListener('click', openSidebar);
        closeBtn.addEventListener('click', closeSidebar);
        overlay.addEventListener('click', closeSidebar);
        quickLinks.forEach(link => link.addEventListener('click', closeSidebar));
        checklistItems.forEach(checkbox => checkbox.addEventListener('change', saveCheckedState));
        loadCheckedState();
    };

    // 5. Jump to Top Button
    const initJumpToTop = () => {
        const jumpBtn = document.getElementById('jumpToTop');
        window.addEventListener('scroll', () => {
            jumpBtn.classList.toggle('visible', window.scrollY > 300);
        });
    };

    // --- Page Section Specific Functions ---

    // 6. 5-Phase Process Tabs
    const initTabs = () => {
        const tabsContainer = document.querySelector('.tabs-container');
        if (!tabsContainer) return;
        const tabButtons = tabsContainer.querySelectorAll('.tab-button');
        const tabPanels = tabsContainer.querySelectorAll('.tab-panel');

        tabsContainer.addEventListener('click', (e) => {
            const clickedTab = e.target.closest('.tab-button');
            if (!clickedTab) return;
            e.preventDefault();
            tabButtons.forEach(button => { button.classList.remove('active'); button.setAttribute('aria-selected', 'false'); });
            tabPanels.forEach(panel => panel.classList.remove('active'));
            clickedTab.classList.add('active');
            clickedTab.setAttribute('aria-selected', 'true');
            document.getElementById(clickedTab.getAttribute('aria-controls')).classList.add('active');
        });
    };
    
    // 7. Horizontal Drag-to-Scroll Timeline
    const initTimelineDragScroll = () => {
        const slider = document.querySelector('.timeline-container');
        if (!slider) return;
        let isDown = false, startX, scrollLeft;
        slider.addEventListener('mousedown', e => { isDown = true; slider.style.cursor = 'grabbing'; startX = e.pageX - slider.offsetLeft; scrollLeft = slider.scrollLeft; });
        slider.addEventListener('mouseleave', () => { isDown = false; slider.style.cursor = 'grab'; });
        slider.addEventListener('mouseup', () => { isDown = false; slider.style.cursor = 'grab'; });
        slider.addEventListener('mousemove', e => { if (!isDown) return; e.preventDefault(); const x = e.pageX - slider.offsetLeft; slider.scrollLeft = scrollLeft - (x - startX) * 2; });
    };

    // 8. FAQ Accordion
    const initAccordion = () => {
        const accordionItems = document.querySelectorAll('.accordion-item');
        if (!accordionItems.length) return;
        accordionItems.forEach(item => {
            const header = item.querySelector('.accordion-header');
            const content = item.querySelector('.accordion-content');
            header.addEventListener('click', () => {
                const isExpanded = header.getAttribute('aria-expanded') === 'true';
                header.setAttribute('aria-expanded', !isExpanded);
                content.style.maxHeight = !isExpanded ? content.scrollHeight + 'px' : null;
            });
        });
    };

    // 9. Interactive Resource Library
    const initResourceLibrary = () => {
        const library = document.querySelector('.resource-library');
        if (!library) return;
        const categoryButtons = library.querySelectorAll('.category-btn');
        const contentPanels = library.querySelectorAll('.resource-panel');
        const bgIcon = library.querySelector('#content-bg-icon');
        const promptPanel = library.querySelector('#resource-prompt');

        categoryButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const clickedButton = e.currentTarget;
                const targetCategory = clickedButton.dataset.category;
                const targetIconClass = clickedButton.dataset.icon;
                const targetPanel = library.querySelector(`#${targetCategory}-content`);

                categoryButtons.forEach(btn => btn.classList.remove('active'));
                clickedButton.classList.add('active');
                
                contentPanels.forEach(panel => panel.classList.remove('active'));
                if (targetPanel) {
                    targetPanel.classList.add('active');
                } else {
                    promptPanel.classList.add('active');
                }

                if (targetIconClass) { bgIcon.className = `fas ${targetIconClass}`; }
            });
        });
    };

    // --- Initialize All Features ---
    initHeaderFeatures();
    initActiveNavHighlighting();
    initHamburgerMenu();
    initSidebarChecklist();
    initJumpToTop();
    initTabs();
    initTimelineDragScroll();
    initAccordion();
    initResourceLibrary();

});
