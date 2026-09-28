const reduce =
    window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;


const heroPlate =
    document.querySelector("#heroPlate");

const largePlate =
    document.querySelector("#largePlate");

const miniPlate =
    document.querySelector("#miniPlate");

const selected =
    document.querySelector("#selectedWell");


/* =========================================================
   BUILD 96-WELL PLATES
========================================================= */

function buildPlate(parent, className) {

    for (let i = 0; i < 96; i++) {

        const well =
            document.createElement("button");

        well.className = className;

        well.dataset.index = i;

        well.setAttribute(
            "aria-label",
            `${String.fromCharCode(
                65 + Math.floor(i / 12)
            )}${i % 12 + 1}`
        );

        parent.appendChild(well);
    }
}


buildPlate(heroPlate, "well");
buildPlate(largePlate, "large-well");
buildPlate(miniPlate, "mini-well");


const heroWells =
    [...heroPlate.children];

const largeWells =
    [...largePlate.children];

const miniWells =
    [...miniPlate.children];


/* =========================================================
   HERO PLATE ANIMATION
========================================================= */

let heroIndex = 0;


if (!reduce) {

    setInterval(() => {

        heroWells.forEach(
            well =>
                well.classList.remove("active")
        );

        heroWells[
            heroIndex
        ].classList.add("active");

        heroIndex =
            (heroIndex + 1) % 96;

    }, 90);

}


/* =========================================================
   INTERACTIVE LARGE PLATE
========================================================= */

largeWells.forEach((well, index) => {

    well.addEventListener(
        "mouseenter",
        () => {

            largeWells.forEach(
                item =>
                    item.classList.remove(
                        "focused"
                    )
            );

            well.classList.add("focused");


            const row =
                Math.floor(index / 12);

            const column =
                index % 12;


            selected.textContent =
                `${String.fromCharCode(
                    65 + row
                )}${column + 1}`;

        }
    );


    well.addEventListener(
        "focus",
        () => {

            well.dispatchEvent(
                new Event("mouseenter")
            );

        }
    );

});


/* =========================================================
   SCROLL PROGRESS
========================================================= */

const progress =
    document.querySelector(
        ".progress span"
    );

const nav =
    document.querySelector(".nav");


function scrollUI() {

    const max =
        document.documentElement
            .scrollHeight -
        innerHeight;


    progress.style.width =
        `${max
            ? scrollY / max * 100
            : 0}%`;


    nav.classList.toggle(
        "scrolled",
        scrollY > 30
    );

}


addEventListener(
    "scroll",
    scrollUI,
    { passive: true }
);


/* =========================================================
   REVEAL ANIMATIONS
========================================================= */

const reveals =
    document.querySelectorAll(
        ".reveal"
    );


const observer =
    new IntersectionObserver(
        entries => {

            entries.forEach(entry => {

                if (!entry.isIntersecting)
                    return;


                entry.target.classList.add(
                    "visible"
                );


                observer.unobserve(
                    entry.target
                );

            });

        },
        {
            threshold: .12,
            rootMargin:
                "0px 0px -60px"
        }
    );


reveals.forEach(
    (element, index) => {

        element.style.setProperty(
            "--delay",
            `${Math.min(
                index * 55,
                300
            )}ms`
        );

        observer.observe(element);

    }
);


/* =========================================================
   WORKFLOW
========================================================= */

const steps =
    [
        ...document.querySelectorAll(".step")
    ];


const moving =
    document.querySelector(
        "#movingPipette"
    );


let stepIndex = 0;


function activateStep(index) {

    stepIndex = index;


    steps.forEach(
        step =>
            step.classList.remove(
                "active"
            )
    );


    steps[index].classList.add(
        "active"
    );


    miniWells.forEach(
        well =>
            well.classList.remove(
                "active"
            )
    );


    const targets =
        [
            7,
            31,
            55,
            79
        ];


    miniWells[
        targets[index]
    ].classList.add("active");


    const positions =
        [
            13,
            38,
            63,
            88
        ];


    moving.style.left =
        `${positions[index]}%`;

}


steps.forEach(
    (step, index) => {

        step.addEventListener(
            "click",
            () =>
                activateStep(index)
        );

    }
);


if (!reduce) {

    setInterval(
        () => {

            activateStep(
                (stepIndex + 1) % 4
            );

        },
        2400
    );

}


/* =========================================================
   SMOOTH NAVIGATION
========================================================= */

document
    .querySelectorAll(
        'a[href^="#"]'
    )
    .forEach(link => {

        link.addEventListener(
            "click",
            event => {

                const target =
                    document.querySelector(
                        link.getAttribute(
                            "href"
                        )
                    );


                if (!target)
                    return;


                event.preventDefault();


                target.scrollIntoView({
                    behavior:
                        reduce
                            ? "auto"
                            : "smooth"
                });

            }
        );

    });


/* =========================================================
   MOBILE MENU
========================================================= */

const menu =
    document.querySelector(".menu");

const navLinks =
    document.querySelector(
        ".nav nav"
    );


menu?.addEventListener(
    "click",
    () => {

        navLinks.classList.toggle(
            "open"
        );

    }
);


/* =========================================================
   CURSOR GLOW
========================================================= */

if (!reduce) {

    const glow =
        document.createElement(
            "div"
        );

    glow.className =
        "cursor-glow";

    document.body.appendChild(
        glow
    );


    addEventListener(
        "pointermove",
        event => {

            glow.style.transform =
                `translate3d(
                    ${event.clientX}px,
                    ${event.clientY}px,
                    0
                )`;

        }
    );

}


/* =========================================================
   PAGE LOAD
========================================================= */

addEventListener(
    "load",
    () => {

        document.body.classList.add(
            "loaded"
        );

        scrollUI();

    }
);
