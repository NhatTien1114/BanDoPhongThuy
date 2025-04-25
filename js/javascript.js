// Loader
setTimeout(function() {
    document.querySelector(".loader-wrapper").style.display = "none";
}, 1000);

document.addEventListener("DOMContentLoaded", function() {
    const tabs = document.querySelectorAll(".products-header h2");
    const productLists = document.querySelectorAll(".product-list");

    // Ẩn tất cả danh mục và chỉ hiển thị mục đầu tiên
    productLists.forEach(list => list.classList.remove("active"));
    tabs[0].classList.add("active");
    productLists[0].classList.add("active");

    tabs.forEach((tab, index) => {
        tab.addEventListener("click", function() {
            if (tab.classList.contains("active")) return; // Nếu đã active thì không làm gì cả

            // Xóa trạng thái active của tất cả tabs
            tabs.forEach(t => t.classList.remove("active"));
            tab.classList.add("active");

            // Ẩn danh mục cũ với hiệu ứng mượt
            const currentActive = document.querySelector(".product-list.active");
            if (currentActive) {
                currentActive.style.opacity = "0";
                currentActive.style.transform = "translateY(50px)";
                setTimeout(() => {
                    currentActive.classList.remove("active");
                }, 500); // Đợi 0.5s rồi ẩn
            }

            // Hiển thị danh mục mới sau khi danh mục cũ biến mất
            setTimeout(() => {
                const newList = productLists[index];
                newList.classList.add("active");
                newList.style.opacity = "1";
                newList.style.transform = "translateY(0)";
            }, 500); // Đợi 0.5s rồi hiện danh mục mới
        });
    });
});

// Di chuyển mượt hơn
function scrollToSection(id) {
    document.getElementById(id).scrollIntoView({
        behavior: "smooth"
    });
}

// Modal Sản Phẩm

$(document).ready(function() {
    $(".product-card").click(function() {
        let title = $(this).data("title");
        let image = $(this).data("image");
        let type = $(this).data("type");
        let desc = $(this).data("desc");
        let details = $(this).data("details");
        let oldPrice = $(this).data("oldprice");
        let newPrice = $(this).data("newprice");

        $("#productTitle").text(title);
        $("#productImage").attr("src", image);
        $("#productType").text(type);
        $("#productDesc").text(desc);
        $("#productDetails").text(details);
        $("#productOldPrice").text(oldPrice ? `Giá gốc: ${oldPrice}` : "");
        $("#productNewPrice").text(newPrice);

        $("#productModal").modal("show");
    });

    $("#increaseQty").click(function() {
        let qty = parseInt($("#quantity").val());
        $("#quantity").val(qty + 1);
    });

    $("#decreaseQty").click(function() {
        let qty = parseInt($("#quantity").val());
        if (qty > 1) $("#quantity").val(qty - 1);
    });
});

document.addEventListener("DOMContentLoaded", function() {
    const buttons = document.querySelectorAll(".btn-view");

    buttons.forEach(button => {
        button.addEventListener("click", function() {
            const product = this.closest(".product-card");

            // Lấy dữ liệu từ thuộc tính data
            document.getElementById("productTitle").textContent = product.dataset.title;
            document.getElementById("productType").textContent = product.dataset.type;
            document.getElementById("productDesc").textContent = product.dataset.desc;
            document.getElementById("productDetails").textContent = product.dataset.details;
            document.getElementById("productOldPrice").textContent = product.dataset.oldprice;
            document.getElementById("productNewPrice").textContent = product.dataset.newprice;
            document.getElementById("productImage").src = product.dataset.image;

            // Reset lại số lượng
            document.getElementById("quantity").value = 1;

            // Mở modal
            $('#productModal').modal('show');
        });
    });
});

// Giỏ hàng
document.addEventListener("DOMContentLoaded", function() {
    const btn = document.querySelector('.shopping-cart-btn');
    const dropdown = document.querySelector('.dropdown-menu');

    if (btn && dropdown) {
        btn.addEventListener('click', function(e) {
            dropdown.classList.toggle('show');
            e.stopPropagation(); // tránh bị ẩn sau khi hiện
        });

        // Ẩn dropdown khi click ra ngoài
        document.addEventListener('click', function(e) {
            if (!dropdown.contains(e.target) && !btn.contains(e.target)) {
                dropdown.classList.remove('show');
            }
        });
    }
});

// Thêm vào giỏ hàng
let cart = JSON.parse(localStorage.getItem("cart")) || [];

document.addEventListener("DOMContentLoaded", function() {
    const cartCountEl = document.getElementById("cartCount");
    const cartItemsContainer = document.getElementById("cartItemsContainer");

    function updateCartCount() {
        const total = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCountEl.textContent = total;
    }

    function renderCartItems() {
        cartItemsContainer.innerHTML = "";

        if (cart.length === 0) {
            cartItemsContainer.innerHTML = `
                <div class="dropdown-item figure text-center rounded-0 p-3 mx-auto empty-cart">
                    <img src="../img/cart.png" height="100" alt="">
                    <div class="figure-caption text-bg text-big">Chưa chọn sản phẩm nào</div>
                </div>`;
            return;
        }

        cart.forEach((item, index) => {
            const itemHTML = `
                <div class="dropdown-item d-flex align-items-center justify-content-between">
                    <img src="${item.image}" height="40" class="mr-2 rounded" alt="" style="object-fit: cover; width: 40px;">
                    <div class="flex-grow-1 ml-2">
                        <div class="font-weight-bold">${item.title}</div>
                        <div class="d-flex align-items-center mt-1">
                            <button class="btn btn-sm btn-outline-secondary btn-decrease" data-index="${index}">−</button>
                            <span class="mx-2">${item.quantity}</span>
                            <button class="btn btn-sm btn-outline-secondary btn-increase" data-index="${index}">+</button>
                        </div>
                        <div class="text-danger small mt-1">${item.price}</div>
                    </div>
                    <button class="btn btn-sm btn-danger btn-remove ml-2" data-index="${index}">&times;</button>
                </div>
            `;
            cartItemsContainer.innerHTML += itemHTML;
        });

        attachCartItemEvents(); // gọi sau khi render xong
    }

    function attachCartItemEvents() {
        document.querySelectorAll(".btn-remove").forEach(btn => {
            btn.addEventListener("click", function() {
                const index = this.dataset.index;
                cart.splice(index, 1);
                localStorage.setItem("cart", JSON.stringify(cart));
                updateCartCount();
                renderCartItems();
            });
        });

        document.querySelectorAll(".btn-increase").forEach(btn => {
            btn.addEventListener("click", function() {
                const index = this.dataset.index;
                cart[index].quantity++;
                localStorage.setItem("cart", JSON.stringify(cart));
                updateCartCount();
                renderCartItems();
            });
        });

        document.querySelectorAll(".btn-decrease").forEach(btn => {
            btn.addEventListener("click", function() {
                const index = this.dataset.index;
                if (cart[index].quantity > 1) {
                    cart[index].quantity--;
                } else {
                    cart.splice(index, 1);
                }
                localStorage.setItem("cart", JSON.stringify(cart));
                updateCartCount();
                renderCartItems();
            });
        });
    }

    document.querySelector(".modal-footer .btn-primary").addEventListener("click", function() {
        const title = document.getElementById("productTitle").textContent;
        const image = document.getElementById("productImage").src;
        const price = document.getElementById("productNewPrice").textContent;
        const quantity = parseInt(document.getElementById("quantity").value);

        const existingItem = cart.find(item => item.title === title);
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            cart.push({ title, image, price, quantity });
        }

        localStorage.setItem("cart", JSON.stringify(cart));
        updateCartCount();
        renderCartItems();
        $('#productModal').modal('hide');
    });

    document.getElementById("increaseQty").addEventListener("click", () => {
        const qty = document.getElementById("quantity");
        qty.value = parseInt(qty.value) + 1;
    });

    document.getElementById("decreaseQty").addEventListener("click", () => {
        const qty = document.getElementById("quantity");
        if (parseInt(qty.value) > 1) {
            qty.value = parseInt(qty.value) - 1;
        }
    });

    updateCartCount();
    renderCartItems(); // ban đầu cần gọi để render lần đầu
});