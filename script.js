document.addEventListener('DOMContentLoaded', () => {

    // --- A. UNIFIED SCROLL HANDLER (for stability) ---
    // This single function handles everything that needs to happen on scroll.
    const handleScroll = () => {
        const scrollY = window.scrollY;
        const scrollTotal = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = document.documentElement.scrollTop;

        // 1. Progress Bar
        const progressBar = document.getElementById('progressBar');
        if (progressBar) {
            const progress = (scrolled / scrollTotal) * 100;
            progressBar.style.width = progress + "%";
        }

        // 2. Sticky Nav (now simpler and more reliable)
        const navbar = document.getElementById('navbar');
        if (navbar) {
            // No class needed, it's sticky by default in the new CSS for stability.
            // You can add back shadow effects here if desired.
        }

        // 3. Jump to Top Button Visibility
        const jumpToTopBtn = document.getElementById('jumpToTopBtn');
        if (jumpToTopBtn) {
            if (scrollY > 300) {
                jumpToTopBtn.classList.add('visible');
            } else {
                jumpToTopBtn.classList.remove('visible');
            }
        }
    };
    // Attach the single scroll handler
    window.addEventListener('scroll', handleScroll);


    // --- B. INTERACTIVE SIDEBAR CHECKLIST ---
    const checklistToggleBtn = document.getElementById('checklistToggleBtn');
    const closeSidebarBtn = document.getElementById('closeSidebarBtn');
    const checklistSidebar = document.getElementById('checklistSidebar');
    const sidebarOverlay = document.getElementById('sidebarOverlay');
    const checklistCheckboxes = document.querySelectorAll('.checklist-item input[type="checkbox"]');

    // Defensive check to ensure all sidebar elements exist before adding listeners
    if (checklistToggleBtn && closeSidebarBtn && checklistSidebar && sidebarOverlay) {
        const toggleSidebar = () => {
            checklistSidebar.classList.toggle('active');
            sidebarOverlay.classList.toggle('active');
        };

        checklistToggleBtn.addEventListener('click', toggleSidebar);
        closeSidebarBtn.addEventListener('click', toggleSidebar);
        sidebarOverlay.addEventListener('click', toggleSidebar);
    }
    
    // Logic for saving and loading checklist progress from browser storage
    if (checklistCheckboxes.length > 0) {
        const saveProgress = () => {
            const progress = {};
            checklistCheckboxes.forEach(checkbox => {
                progress[checkbox.dataset.task] = checkbox.checked;
                // Add a class to the parent for styling
                checkbox.closest('.checklist-item').classList.toggle('completed', checkbox.checked);
            });
            localStorage.setItem('checklistProgress', JSON.stringify(progress));
        };

        const loadProgress = () => {
            try {
                const progress = JSON.parse(localStorage.getItem('checklistProgress'));
                if (progress) {
                    checklistCheckboxes.forEach(checkbox => {
                        const taskName = checkbox.dataset.task;
                        checkbox.checked = progress[taskName] || false;
                        checkbox.closest('.checklist-item').classList.toggle('completed', checkbox.checked);
                    });
                }
            } catch (e) {
                console.error("Could not load checklist progress:", e);
            }
        };

        checklistCheckboxes.forEach(checkbox => {
            checkbox.addEventListener('change', saveProgress);
        });

        loadProgress(); // Load progress on page start
    }


    // --- C. ALL OTHER PAGE FUNCTIONALITY (stable versions) ---

    // FAQ Accordion
    document.querySelectorAll('.faq-item').forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');
        if (question && answer) {
            question.addEventListener('click', () => {
                const isActive = item.classList.toggle('active');
                answer.style.maxHeight = isActive ? answer.scrollHeight + 'px' : null;
            });
        }
    });

    // Process Tabs
    const tabsContainer = document.querySelector('.tabs-container');
    if (tabsContainer) {
        const tabButtons = tabsContainer.querySelectorAll('.tab-btn');
        const tabContents = tabsContainer.querySelectorAll('.tab-content');
        tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                const tabNumber = button.dataset.tab;
                tabButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                tabContents.forEach(content => content.classList.toggle('active', content.dataset.tab === tabNumber));
            });
        });
    }

    // Timeline Drag/Scroll
    const timeline = document.querySelector('.timeline-wrapper');
    if (timeline) {
        let isDown = false, startX, scrollLeft;
        timeline.addEventListener('mousedown', (e) => { isDown = true; startX = e.pageX - timeline.offsetLeft; scrollLeft = timeline.scrollLeft; });
        timeline.addEventListener('mouseleave', () => { isDown = false; });
        timeline.addEventListener('mouseup', () => { isDown = false; });
        timeline.addEventListener('mousemove', (e) => { if (!isDown) return; e.preventDefault(); const x = e.pageX - timeline.offsetLeft; const walk = (x - startX) * 2; timeline.scrollLeft = scrollLeft - walk; });
    }
});
