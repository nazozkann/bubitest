document.addEventListener("DOMContentLoaded", function () {
    const shopMain = document.querySelector(".shop-main");
    const submenu = document.querySelector(".submenu");

    if (shopMain && submenu) {
        shopMain.addEventListener("click", function (event) {
            event.stopPropagation();
            submenu.classList.toggle("active");
        });

        document.addEventListener("click", function () {
            if (submenu.classList.contains("active")) {
                submenu.classList.remove("active");
            }
        });

        // Prevent clicks inside the submenu from closing it
        submenu.addEventListener("click", function(event) {
            event.stopPropagation();
        });
    }

    // Toggle mobile submenu
    const mobileShopToggle = document.querySelector(".shop-toggle");
    const mobileShopMenu = document.querySelector(".mobile-shop");

    if (mobileShopToggle && mobileShopMenu) {
        mobileShopToggle.addEventListener("click", function (event) {
            event.stopPropagation();
            mobileShopMenu.classList.toggle("mobile-shop-active");
        });

        document.addEventListener("click", function () {
            mobileShopMenu.classList.remove("mobile-shop-active");
        });
    }
});

