const navToggle = document.querySelector(".nav-toggle");
const siteNav = document.querySelector(".site-nav");
const form = document.querySelector("#contact-form");
const formStatus = document.querySelector("#form-status");
const lightbox = document.querySelector("#lightbox");
const lightboxImage = lightbox.querySelector("img");
const lightboxCaption = lightbox.querySelector(".lightbox-caption");
let viewerItems = [];
let viewerIndex = 0;

function itemsFromButton(button) {
  if (button.dataset.photos) {
    const caption = button.dataset.caption;
    return button.dataset.photos.split("|").map((src) => ({
      src,
      alt: caption,
      caption,
    }));
  }
  return [
    {
      src: button.dataset.full,
      alt: button.querySelector("img").alt,
      caption: button.dataset.caption,
    },
  ];
}

function showViewer(index) {
  viewerIndex = (index + viewerItems.length) % viewerItems.length;
  const item = viewerItems[viewerIndex];
  lightboxImage.src = item.src;
  lightboxImage.alt = item.alt;
  lightboxCaption.textContent = item.caption;
  if (!lightbox.open) {
    lightbox.showModal();
  }
}

function openViewer(items, index) {
  viewerItems = items;
  showViewer(index);
}

document.querySelectorAll(".amenity-card").forEach((button) => {
  button.addEventListener("click", () => {
    openViewer(itemsFromButton(button), 0);
  });
});

lightbox.querySelector(".lightbox-close").addEventListener("click", () => lightbox.close());
lightbox.querySelector(".lightbox-prev").addEventListener("click", () => {
  showViewer(viewerIndex - 1);
});
lightbox.querySelector(".lightbox-next").addEventListener("click", () => {
  showViewer(viewerIndex + 1);
});

lightbox.addEventListener("click", (event) => {
  if (event.target === lightbox) {
    lightbox.close();
  }
});

navToggle.addEventListener("click", () => {
  const open = siteNav.classList.toggle("open");
  navToggle.setAttribute("aria-expanded", String(open));
});

siteNav.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    siteNav.classList.remove("open");
    navToggle.setAttribute("aria-expanded", "false");
  });
});

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  const data = new FormData(form);
  const name = data.get("name");
  const phone = data.get("phone");
  const email = data.get("email");
  const message = data.get("message");
  const contactEmail = "Angelshomecare26@outlook.com";

  formStatus.textContent = "Sending your message...";

  try {
    const response = await fetch(`https://formsubmit.co/ajax/${contactEmail}`, {
      method: "POST",
      headers: { Accept: "application/json" },
      body: data,
    });

    if (response.ok) {
      form.reset();
      formStatus.textContent = "Message sent. We will get back to you soon.";
      return;
    }
  } catch (error) {
    // Fall through to the email app if the send service is blocked.
  }

  const subject = encodeURIComponent(`Tour request from ${name}`);
  const body = encodeURIComponent(
    `Name: ${name}\nPhone: ${phone}\nEmail: ${email}\n\n${message}`
  );
  window.location.href = `mailto:${contactEmail}?subject=${subject}&body=${body}`;
  formStatus.textContent = `If your email app opens, send it to ${contactEmail}.`;
});
