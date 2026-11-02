$(function () {

    /* ===== NAVBAR: background + active link on scroll ===== */
    function onScroll() {
        var y = $(window).scrollTop();
        $(".navbar").toggleClass("scrolled", y > 50);

        var current = "home";
        $("section[id]").each(function () {
            if (y + 120 >= $(this).offset().top) current = this.id;
        });
        $(".navbar .nav-link").removeClass("active")
            .filter('[href="#' + current + '"]').addClass("active");
    }
    $(window).on("scroll", onScroll);
    onScroll();

    /* ===== CLOSE MOBILE MENU AFTER CLICK ===== */
    $(".navbar .nav-link, .navbar .book-btn").on("click", function () {
        var menu = document.getElementById("mainNavbar");
        if (menu.classList.contains("show")) {
            bootstrap.Collapse.getOrCreateInstance(menu).hide();
        }
    });

    /* ===== COUNTERS (start when section becomes visible) ===== */
    $(".counter").each(function () {
        $(this).attr("data-target", parseInt($(this).text(), 10)).text("0");
    });

    function runCounters() {
        $(".counter").each(function () {
            var $t = $(this), target = parseInt($t.attr("data-target"), 10);
            $({ n: 0 }).animate({ n: target }, {
                duration: 2000,
                step: function (now) { $t.text(Math.floor(now)); },
                complete: function () { $t.text(target + "+"); }
            });
        });
    }

    var stats = document.querySelector(".stats-section");
    if ("IntersectionObserver" in window && stats) {
        var obs = new IntersectionObserver(function (entries) {
            if (entries[0].isIntersecting) {
                runCounters();
                obs.disconnect();
            }
        }, { threshold: 0.3 });
        obs.observe(stats);
    } else {
        runCounters();
    }

    /* ===== REVIEW STARS (rating inside each card) ===== */
    $(".review-stars").on("click", ".fa-star", function () {
        var idx = $(this).index();
        $(this).parent().children(".fa-star").each(function (i) {
            $(this).toggleClass("selected", i <= idx);
        });
    });

    /* ===== BOOKING FORM ===== */
    var namePattern  = /^[a-zA-Z ]+$/;
    var emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    $("#date").attr("min", new Date().toISOString().split("T")[0]);

    $("#tourForm").on("submit", function (e) {
        e.preventDefault();

        var name = $("#name").val().trim();
        var email = $("#email").val().trim();
        var destination = $("#destination").val();
        var date = $("#date").val();
        var msg = $("#message").val().trim();
        var valid = true;

        function check(ok, errSelector) {
            $(errSelector).toggle(!ok);
            if (!ok) valid = false;
        }

        check(namePattern.test(name), "#er_name");
        check(emailPattern.test(email), "#err_email");
        check(destination !== "", "#err_destination");
        check(date !== "", "#err_date");
        check(msg.length >= 10, "#err_mesg");

        if (valid) {
            alert("Thank you " + name + "! Your booking request for " +
                  destination + " has been received.");
            this.reset();
        }
    });

});
