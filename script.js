document.addEventListener('DOMContentLoaded', () => {

    // --- Core Interactive Component Functions ---

    // 1. Sticky Navigation & Progress Bar
    const initHeaderFeatures = () => {
        const progressBar = document.getElementById('progressBar');
        const mainHeader = document.getElementById('mainHeader');
        
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
        }, { rootMargin: '-30% 0px -70% 0px' }); // Highlights when section is in the middle 30% of the screen

        sections.forEach(section => observer.observe(section));
    };

    // 3. Hamburger Menu for Mobile
    const initHamburgerMenu = () => {
        const hamburger = document.getElementById('hamburger-menu');
        const navLinksContainer = document.querySelector('.nav-links');
        const navLinks = document.querySelectorAll('.nav-link');

        hamburger.addEventListener('click', () => {
            navLinksContainer.classList.toggle('open');
            const isOpen = navLinksContainer.classList.contains('open');
            hamburger.setAttribute('aria-expanded', isOpen);
        });
        
        // Close menu when a link is clicked
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

        const openSidebar = () => {
            sidebar.classList.add('open');
            overlay.classList.add('visible');
            document.body.classList.add('sidebar-open');
        };

        const closeSidebar = () => {
            sidebar.classList.remove('open');
            overlay.classList.remove('visible');
            document.body.classList.remove('sidebar-open');
        };

        // Load checked state from localStorage
        const loadCheckedState = () => {
            const checkedTasks = JSON.parse(localStorage.getItem(storageKey)) || [];
            checklistItems.forEach(checkbox => {
                if (checkedTasks.includes(checkbox.dataset.id)) {
                    checkbox.checked = true;
                }
            });
        };

        // Save checked state to localStorage
        const saveCheckedState = () => {
            const checkedTasks = [];
            checklistItems.forEach(checkbox => {
                if (checkbox.checked) {
                    checkedTasks.push(checkbox.dataset.id);
                }
            });
            localStorage.setItem(storageKey, JSON.stringify(checkedTasks));
        };
        
        toggleBtn.addEventListener('click', openSidebar);
        closeBtn.addEventListener('click', closeSidebar);
        overlay.addEventListener('click', closeSidebar);
        
        quickLinks.forEach(link => link.addEventListener('click', closeSidebar));

        checklistItems.forEach(checkbox => checkbox.addEventListener('change', saveCheckedState));

        loadCheckedState(); // Initial load
    };

    // 5. Jump to Top Button
    const initJumpToTop = () => {
        const jumpBtn = document.getElementById('jumpToTop');
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                jumpBtn.classList.add('visible');
            } else {
                jumpBtn.classList.remove('visible');
            }
        });
    };

    // --- Page Section Specific Functions ---

    // 6. Rotating Tip Tile
    const initRotatingTips = () => {
        const tipElement = document.getElementById('rotating-tip-text');
        if (!tipElement) return;

        const tips = [
            "Over-communicate. It's better to repeat key messages than to leave people guessing.",
            "Involve managers early and often. They are your most critical partners in any change.",
            "Focus on fairness and equity. Every decision must be defensible and consistently applied.",
            "Use data to tell the story and justify the change, from headcount to market compensation."
        ];
        let currentTipIndex = 0;

        setInterval(() => {
            tipElement.classList.add('fade-out');
            
            setTimeout(() => {
                currentTipIndex = (currentTipIndex + 1) % tips.length;
                tipElement.textContent = tips[currentTipIndex];
                tipElement.classList.remove('fade-out');
            }, 500); // Matches CSS transition duration

        }, 5000); // Change tip every 5 seconds
    };

    // 7. 5-Phase Process Tabs
    const initTabs = () => {
        const tabsContainer = document.querySelector('.tabs-container');
        if (!tabsContainer) return;

        const tabButtons = tabsContainer.querySelectorAll('.tab-button');
        const tabPanels = tabsContainer.querySelectorAll('.tab-panel');

        tabsContainer.addEventListener('click', (e) => {
            const clickedTab = e.target.closest('.tab-button');
            if (!clickedTab) return;

            e.preventDefault();

            // Deactivate all
            tabButtons.forEach(button => {
                button.classList.remove('active');
                button.setAttribute('aria-selected', 'false');
            });
            tabPanels.forEach(panel => panel.classList.remove('active'));

            // Activate clicked
            clickedTab.classList.add('active');
            clickedTab.setAttribute('aria-selected', 'true');
            const targetPanel = document.getElementById(clickedTab.getAttribute('aria-controls'));
            if (targetPanel) {
                targetPanel.classList.add('active');
            }
        });
    };
    
    // 8. Horizontal Drag-to-Scroll Timeline
    const initTimelineDragScroll = () => {
        const slider = document.querySelector('.timeline-container');
        if (!slider) return;

        let isDown = false;
        let startX;
        let scrollLeft;

        slider.addEventListener('mousedown', (e) => {
            isDown = true;
            slider.classList.add('active');
            startX = e.pageX - slider.offsetLeft;
            scrollLeft = slider.scrollLeft;
        });
        slider.addEventListener('mouseleave', () => {
            isDown = false;
            slider.classList.remove('active');
        });
        slider.addEventListener('mouseup', () => {
            isDown = false;
            slider.classList.remove('active');
        });
        slider.addEventListener('mousemove', (e) => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - slider.offsetLeft;
            const walk = (x - startX) * 2; // The multiplier '2' makes it scroll faster
            slider.scrollLeft = scrollLeft - walk;
        });
    };

    // 9. FAQ Accordion
    const initAccordion = () => {
        const accordionItems = document.querySelectorAll('.accordion-item');
        if (!accordionItems.length) return;

        accordionItems.forEach(item => {
            const header = item.querySelector('.accordion-header');
            const content = item.querySelector('.accordion-content');

            header.addEventListener('click', () => {
                const isExpanded = header.getAttribute('aria-expanded') === 'true';

                // Optional: Close other accordions when one is opened
                // accordionItems.forEach(otherItem => {
                //     otherItem.querySelector('.accordion-header').setAttribute('aria-expanded', 'false');
                //     otherItem.querySelector('.accordion-content').style.maxHeight = null;
                // });

                if (isExpanded) {
                    header.setAttribute('aria-expanded', 'false');
                    content.style.maxHeight = null;
                } else {
                    header.setAttribute('aria-expanded', 'true');
                    content.style.maxHeight = content.scrollHeight + 'px';
                }
            });
        });
    };

    // --- Initialize All Features ---
    initHeaderFeatures();
    initActiveNavHighlighting();
    initHamburgerMenu();
    initSidebarChecklist();
    initJumpToTop();
    initRotatingTips();
    initTabs();
    initTimelineDragScroll();
    initAccordion();

});
