/* =========================================================
   SUPERSEB — PIMP MY BENZ
   PROTOTYPE JAVASCRIPT
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    /* =====================================================
       SPLASH SCREEN
       ===================================================== */

    const splash = document.querySelector(".splash-screen");

    if (splash) {

        const hideSplash = () => {
            splash.classList.add("hide");
            document.body.classList.remove("splash-active");
        };

        // Give the branded intro enough time to be visible.
        setTimeout(hideSplash, 1800);

        // Safety fallback.
        window.addEventListener("load", () => {
            setTimeout(hideSplash, 2200);
        });
    }


    /* =====================================================
       MOBILE SIDEBAR
       ===================================================== */

    const burger = document.querySelector(".burger-btn");
    const sidebar = document.querySelector(".sidebar");
    const overlay = document.querySelector(".sidebar-overlay");
    const sidebarClose = document.querySelector(".sidebar-close");

    function openSidebar() {

        if (!sidebar) return;

        sidebar.classList.add("open");

        if (overlay) {
            overlay.classList.add("show");
        }

        if (burger) {
            burger.classList.add("active");
            burger.setAttribute("aria-expanded", "true");
        }

        document.body.classList.add("sidebar-open");
    }

    function closeSidebar() {

        if (!sidebar) return;

        sidebar.classList.remove("open");

        if (overlay) {
            overlay.classList.remove("show");
        }

        if (burger) {
            burger.classList.remove("active");
            burger.setAttribute("aria-expanded", "false");
        }

        document.body.classList.remove("sidebar-open");
    }

    if (burger) {

        burger.addEventListener("click", () => {

            if (sidebar && sidebar.classList.contains("open")) {
                closeSidebar();
            } else {
                openSidebar();
            }

        });
    }

    if (sidebarClose) {
        sidebarClose.addEventListener("click", closeSidebar);
    }

    if (overlay) {
        overlay.addEventListener("click", closeSidebar);
    }

    // Close sidebar after clicking a navigation link.
    document.querySelectorAll(".sidebar a").forEach(link => {

        link.addEventListener("click", () => {
            closeSidebar();
        });

    });

    // Escape key closes the sidebar.
    document.addEventListener("keydown", event => {

        if (event.key === "Escape") {
            closeSidebar();
        }

    });


    /* =====================================================
       ACTIVE NAVIGATION
       ===================================================== */

    const currentPage =
        window.location.pathname
            .split("/")
            .pop()
            .toLowerCase() || "index.html";

    document.querySelectorAll(
        ".nav-links a, .sidebar-link, .dashboard-nav a"
    ).forEach(link => {

        const href =
            link.getAttribute("href");

        if (!href) return;

        const linkPage =
            href.split("/").pop().toLowerCase();

        if (
            linkPage === currentPage ||
            (currentPage === "" && linkPage === "index.html")
        ) {
            link.classList.add("active");
        }

    });


    /* =====================================================
       SCROLL REVEAL ANIMATION
       ===================================================== */

    const revealElements =
        document.querySelectorAll(".reveal");

    if (revealElements.length) {

        const revealObserver =
            new IntersectionObserver(
                entries => {

                    entries.forEach(entry => {

                        if (entry.isIntersecting) {

                            entry.target.classList.add("show");

                            revealObserver.unobserve(
                                entry.target
                            );
                        }

                    });

                },
                {
                    threshold: 0.12
                }
            );

        revealElements.forEach(element => {
            revealObserver.observe(element);
        });
    }


    /* =====================================================
       GENERIC MULTI-STEP FORM / WIZARD
       ===================================================== */

    document.querySelectorAll("[data-wizard]").forEach(wizard => {

        const steps =
            wizard.querySelectorAll(".wizard-step");

        const indicators =
            wizard.querySelectorAll("[data-step-indicator]");

        const nextButtons =
            wizard.querySelectorAll("[data-next]");

        const backButtons =
            wizard.querySelectorAll("[data-back]");

        const progressBar =
            wizard.querySelector("[data-progress]");

        const counter =
            wizard.querySelector("[data-step-counter]");

        if (!steps.length) return;

        let currentStep = 0;

        function showStep(index) {

            if (index < 0) {
                index = 0;
            }

            if (index >= steps.length) {
                index = steps.length - 1;
            }

            currentStep = index;

            steps.forEach((step, i) => {

                step.classList.toggle(
                    "active",
                    i === currentStep
                );

            });

            indicators.forEach((indicator, i) => {

                indicator.classList.toggle(
                    "active",
                    i === currentStep
                );

                indicator.classList.toggle(
                    "completed",
                    i < currentStep
                );

            });

            const percentage =
                ((currentStep + 1) / steps.length) * 100;

            if (progressBar) {
                progressBar.style.width =
                    `${percentage}%`;
            }

            if (counter) {

                counter.textContent =
                    `Step ${currentStep + 1} of ${steps.length}`;
            }

            window.scrollTo({
                top:
                    wizard.getBoundingClientRect().top +
                    window.scrollY -
                    110,
                behavior: "smooth"
            });
        }

        function validateStep() {

            const activeStep =
                steps[currentStep];

            if (!activeStep) return true;

            const requiredInputs =
                activeStep.querySelectorAll(
                    "[required]"
                );

            let valid = true;

            requiredInputs.forEach(input => {

                if (!input.value.trim()) {

                    input.style.borderColor =
                        "#ef5b50";

                    valid = false;

                } else {

                    input.style.borderColor = "";
                }

            });

            if (!valid) {

                const message =
                    activeStep.querySelector(
                        "[data-validation-message]"
                    );

                if (message) {

                    message.textContent =
                        "Please complete the required fields before continuing.";

                    message.classList.remove("hidden");
                }

                return false;
            }

            return true;
        }

        nextButtons.forEach(button => {

            button.addEventListener("click", () => {

                if (!validateStep()) {
                    return;
                }

                if (currentStep < steps.length - 1) {
                    showStep(currentStep + 1);
                }

            });

        });

        backButtons.forEach(button => {

            button.addEventListener("click", () => {

                if (currentStep > 0) {
                    showStep(currentStep - 1);
                }

            });

        });

        showStep(0);
    });


    /* =====================================================
       FAQ ACCORDION
       ===================================================== */

    document.querySelectorAll(".faq-question")
        .forEach(question => {

            question.addEventListener("click", () => {

                const item =
                    question.closest(".faq-item");

                if (!item) return;

                const alreadyOpen =
                    item.classList.contains("open");

                document.querySelectorAll(".faq-item")
                    .forEach(other => {
                        other.classList.remove("open");
                    });

                if (!alreadyOpen) {
                    item.classList.add("open");
                }

            });

        });


    /* =====================================================
       MODALS
       ===================================================== */

    document.querySelectorAll("[data-modal-open]")
        .forEach(button => {

            button.addEventListener("click", () => {

                const modalId =
                    button.getAttribute(
                        "data-modal-open"
                    );

                const modal =
                    document.getElementById(modalId);

                if (modal) {
                    modal.classList.add("show");
                    document.body.classList.add(
                        "sidebar-open"
                    );
                }

            });

        });

    document.querySelectorAll("[data-modal-close]")
        .forEach(button => {

            button.addEventListener("click", () => {

                const modal =
                    button.closest(".modal");

                if (modal) {
                    modal.classList.remove("show");
                    document.body.classList.remove(
                        "sidebar-open"
                    );
                }

            });

        });

    document.querySelectorAll(".modal")
        .forEach(modal => {

            modal.addEventListener("click", event => {

                if (event.target === modal) {

                    modal.classList.remove("show");

                    document.body.classList.remove(
                        "sidebar-open"
                    );
                }

            });

        });


    /* =====================================================
       DEMO ACTIONS
       ===================================================== */

    document.querySelectorAll("[data-demo-action]")
        .forEach(button => {

            button.addEventListener("click", () => {

                const message =
                    button.getAttribute(
                        "data-demo-action"
                    ) ||
                    "This feature is available in the prototype.";

                showPrototypeMessage(message);

            });

        });


    /* =====================================================
       DEMO LOGIN
       ===================================================== */

    const loginForm =
        document.getElementById("demoLoginForm");

    if (loginForm) {

        loginForm.addEventListener("submit", event => {

            event.preventDefault();

            const phone =
                loginForm.querySelector(
                    "[name='phone']"
                )?.value.trim();

            const password =
                loginForm.querySelector(
                    "[name='password']"
                )?.value;

            const message =
                loginForm.querySelector(
                    "[data-login-message]"
                );

            const validPhone =
                phone === "+2347030467337" ||
                phone === "07030467337";

            const validPassword =
                password === "1234";

            if (validPhone && validPassword) {

                if (message) {

                    message.className =
                        "alert alert-success";

                    message.textContent =
                        "Login successful. Sending you to OTP verification...";
                }

                setTimeout(() => {

                    window.location.href =
                        "verify-otp.html";

                }, 700);

            } else {

                if (message) {

                    message.className =
                        "alert alert-danger";

                    message.textContent =
                        "Demo login: use 07030467337 and password 1234.";
                }

            }

        });

    }


    /* =====================================================
       DEMO OTP
       ===================================================== */

    const otpForm =
        document.getElementById("demoOtpForm");

    if (otpForm) {

        otpForm.addEventListener("submit", event => {

            event.preventDefault();

            const otp =
                otpForm.querySelector(
                    "[name='otp']"
                )?.value.trim();

            const message =
                otpForm.querySelector(
                    "[data-otp-message]"
                );

            if (otp === "1234") {

                if (message) {

                    message.className =
                        "alert alert-success";

                    message.textContent =
                        "Verification successful. Opening your dashboard...";
                }

                setTimeout(() => {

                    window.location.href =
                        "dashboard.html";

                }, 700);

            } else {

                if (message) {

                    message.className =
                        "alert alert-danger";

                    message.textContent =
                        "Demo OTP is 1234.";
                }

            }

        });

    }


    /* =====================================================
       DEMO REGISTRATION
       ===================================================== */

    const registerForm =
        document.getElementById("demoRegisterForm");

    if (registerForm) {

        registerForm.addEventListener(
            "submit",
            event => {

                event.preventDefault();

                const password =
                    registerForm.querySelector(
                        "[name='password']"
                    )?.value;

                const confirmPassword =
                    registerForm.querySelector(
                        "[name='confirm_password']"
                    )?.value;

                const message =
                    registerForm.querySelector(
                        "[data-register-message]"
                    );

                if (
                    password &&
                    password !== confirmPassword
                ) {

                    if (message) {

                        message.className =
                            "alert alert-danger";

                        message.textContent =
                            "Your passwords do not match.";
                    }

                    return;
                }

                if (message) {

                    message.className =
                        "alert alert-success";

                    message.textContent =
                        "Prototype registration successful. Verification email simulation complete.";
                }

            }
        );

    }


    /* =====================================================
       PASSWORD VISIBILITY
       ===================================================== */

    document.querySelectorAll(
        "[data-password-toggle]"
    ).forEach(button => {

        button.addEventListener("click", () => {

            const targetSelector =
                button.getAttribute(
                    "data-password-toggle"
                );

            const input =
                document.querySelector(
                    targetSelector
                );

            if (!input) return;

            if (input.type === "password") {

                input.type = "text";

                button.textContent =
                    "Hide";

            } else {

                input.type = "password";

                button.textContent =
                    "Show";
            }

        });

    });


    /* =====================================================
       SEARCH / FILTER DEMO
       ===================================================== */

    const searchInput =
        document.querySelector(
            "[data-live-search]"
        );

    if (searchInput) {

        searchInput.addEventListener(
            "input",
            () => {

                const query =
                    searchInput.value
                        .trim()
                        .toLowerCase();

                const targetSelector =
                    searchInput.getAttribute(
                        "data-live-search"
                    );

                const cards =
                    document.querySelectorAll(
                        targetSelector
                    );

                cards.forEach(card => {

                    const searchableText =
                        card.textContent.toLowerCase();

                    card.style.display =
                        !query ||
                        searchableText.includes(query)
                            ? ""
                            : "none";

                });

            }
        );

    }


    /* =====================================================
       IMAGE PREVIEW
       ===================================================== */

    document.querySelectorAll(
        "[data-image-preview]"
    ).forEach(input => {

        input.addEventListener("change", () => {

            const previewSelector =
                input.getAttribute(
                    "data-image-preview"
                );

            const preview =
                document.querySelector(
                    previewSelector
                );

            if (!preview || !input.files?.length) {
                return;
            }

            const file =
                input.files[0];

            if (!file.type.startsWith("image/")) {
                return;
            }

            const reader =
                new FileReader();

            reader.onload = event => {

                preview.src =
                    event.target.result;

                preview.classList.remove(
                    "hidden"
                );
            };

            reader.readAsDataURL(file);

        });

    });


    /* =====================================================
       DEMO FILE UPLOAD
       ===================================================== */

    document.querySelectorAll(
        "[data-upload-name]"
    ).forEach(input => {

        input.addEventListener("change", () => {

            const outputSelector =
                input.getAttribute(
                    "data-upload-name"
                );

            const output =
                document.querySelector(
                    outputSelector
                );

            if (!output) return;

            if (!input.files.length) {

                output.textContent =
                    "No file selected.";

                return;
            }

            if (input.files.length === 1) {

                output.textContent =
                    input.files[0].name;

            } else {

                output.textContent =
                    `${input.files.length} files selected.`;
            }

        });

    });


    /* =====================================================
       COPY REFERRAL CODE
       ===================================================== */

    document.querySelectorAll(
        "[data-copy]"
    ).forEach(button => {

        button.addEventListener("click", async () => {

            const selector =
                button.getAttribute(
                    "data-copy"
                );

            const target =
                document.querySelector(
                    selector
                );

            if (!target) return;

            const value =
                target.value ||
                target.textContent;

            try {

                await navigator.clipboard.writeText(
                    value
                );

                const original =
                    button.textContent;

                button.textContent =
                    "Copied";

                setTimeout(() => {
                    button.textContent =
                        original;
                }, 1500);

            } catch (error) {

                showPrototypeMessage(
                    "Copy this referral code manually: " +
                    value
                );

            }

        });

    });


    /* =====================================================
       DEMO STATUS CHANGE
       ===================================================== */

    document.querySelectorAll(
        "[data-status-button]"
    ).forEach(button => {

        button.addEventListener("click", () => {

            const targetSelector =
                button.getAttribute(
                    "data-status-button"
                );

            const target =
                document.querySelector(
                    targetSelector
                );

            const status =
                button.getAttribute(
                    "data-status"
                );

            if (!target) return;

            target.textContent =
                status;

            target.classList.add(
                "badge-green"
            );

        });

    });


    /* =====================================================
       PROTOTYPE TOAST
       ===================================================== */

    function showPrototypeMessage(message) {

        let toast =
            document.querySelector(
                ".prototype-toast"
            );

        if (!toast) {

            toast =
                document.createElement("div");

            toast.className =
                "prototype-toast";

            toast.innerHTML = `
                <span class="prototype-toast-icon">✓</span>
                <span class="prototype-toast-text"></span>
            `;

            document.body.appendChild(toast);

            const style =
                document.createElement("style");

            style.textContent = `
                .prototype-toast {
                    position: fixed;
                    left: 50%;
                    bottom: 25px;
                    transform: translate(-50%, 25px);
                    z-index: 99999;
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    width: min(92%, 460px);
                    padding: 13px 16px;
                    border: 1px solid rgba(8,122,61,.35);
                    border-radius: 10px;
                    background: rgba(9,13,11,.96);
                    color: #fff;
                    box-shadow: 0 20px 60px rgba(0,0,0,.45);
                    font-size: 12px;
                    opacity: 0;
                    pointer-events: none;
                    transition: .3s ease;
                    backdrop-filter: blur(15px);
                }

                .prototype-toast.show {
                    opacity: 1;
                    transform: translate(-50%, 0);
                }

                .prototype-toast-icon {
                    width: 25px;
                    height: 25px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: 50%;
                    background: #087a3d;
                    color: white;
                    font-weight: 800;
                }

                .prototype-toast-text {
                    flex: 1;
                }
            `;

            document.head.appendChild(style);
        }

        const text =
            toast.querySelector(
                ".prototype-toast-text"
            );

        text.textContent = message;

        toast.classList.add("show");

        clearTimeout(
            toast.hideTimer
        );

        toast.hideTimer =
            setTimeout(() => {

                toast.classList.remove(
                    "show"
                );

            }, 3500);
    }


    /* =====================================================
       CURRENT YEAR
       ===================================================== */

    document.querySelectorAll(
        "[data-current-year]"
    ).forEach(element => {

        element.textContent =
            new Date().getFullYear();

    });


    /* =====================================================
       BACK TO TOP
       ===================================================== */

    const backTop =
        document.querySelector(
            "[data-back-top]"
        );

    if (backTop) {

        window.addEventListener("scroll", () => {

            if (window.scrollY > 500) {

                backTop.classList.add("show");

            } else {

                backTop.classList.remove("show");
            }

        });

        backTop.addEventListener(
            "click",
            () => {

                window.scrollTo({
                    top: 0,
                    behavior: "smooth"
                });

            }
        );
    }


    /* =====================================================
       PREVENT EMPTY PROTOTYPE LINKS
       ===================================================== */

    document.querySelectorAll(
        "a[href='#']"
    ).forEach(link => {

        link.addEventListener("click", event => {

            event.preventDefault();

        });

    });

});