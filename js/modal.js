function openModal() {
  const modal = document.getElementById("signupModal");
  modal.classList.add("active");
  document.body.style.overflow = "hidden";
  setTimeout(() => {
    document.getElementById("email").focus();
  }, 100);
}

function closeModal() {
  const modal = document.getElementById("signupModal");
  modal.classList.remove("active");
  document.body.style.overflow = "auto";
  document.getElementById("signupForm").reset();
  document.getElementById("formContent").style.display = "block";
  document.getElementById("successMessage").classList.remove("show");
}

window.onclick = function (event) {
  const modal = document.getElementById("signupModal");
  const modalContent = document.querySelector(".modal-content");
  if (event.target == modal) {
    closeModal();
  }
};

document.addEventListener("keydown", function (event) {
  if (event.key === "Escape") {
    const modal = document.getElementById("signupModal");
    if (modal.classList.contains("active")) {
      closeModal();
    }
  }
});

document.getElementById("signupForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const submitBtn = document.getElementById("submitBtn");
  const originalText = submitBtn.innerText;
  const email = document.getElementById("email").value;
  const name = document.getElementById("name").value;
  const company = document.getElementById("company").value;
  const role = document.getElementById("role").value;

  if (!email || !name || !role) {
    alert("Please fill in all required fields");
    return;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    alert("Please enter a valid email address");
    return;
  }

  submitBtn.classList.add("loading");
  submitBtn.disabled = true;
  submitBtn.innerText = "Loading...";
  const GOOGLE_SCRIPT_URL =
    "https://script.google.com/macros/s/AKfycbxhFq_9wcw856GDG-N_z7j2mtVxjahNxze7ubbPvPUvoau3LQROmqZA17DNXwfKzqLD/exec";

  const formDataToSend = new FormData();
  formDataToSend.append("email", email);
  formDataToSend.append("name", name);
  formDataToSend.append("company", company);
  formDataToSend.append("role", role);

  fetch(GOOGLE_SCRIPT_URL, {
    method: "POST",
    body: formDataToSend,
    timeout: 10000,
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("Response:", data);

      if (data.status === "success") {
        console.log("✅ Успешно:", data.message);
        sendTelegramNotification(email, name, company, role);

        showSuccessMessage();
      } else if (data.status === "error") {
        alert("❌ " + data.message);

        resetSubmitButton(submitBtn, originalText);
      }
    })
    .catch((error) => {
      console.error("Network Error:", error);
      alert("Network error. Saving locally.");
      saveToLocalStorage(email, name, company, role);
      sendTelegramNotification(email, name, company, role);
      resetSubmitButton(submitBtn, originalText);
    });
});

function resetSubmitButton(btn, originalText) {
  btn.classList.remove("loading");
  btn.disabled = false;
  btn.innerText = originalText;
}

function showSuccessMessage() {
  document.getElementById("formContent").style.display = "none";
  document.getElementById("successMessage").classList.add("show");
  document.getElementById("signupForm").reset();
  setTimeout(() => {
    closeModal();
  }, 3000);
}

function saveToLocalStorage(email, name, company, role) {
  const data = {
    email: email,
    name: name,
    company: company,
    role: role,
    timestamp: new Date().toISOString(),
  };

  let allData = JSON.parse(localStorage.getItem("signupData") || "[]");
  allData.push(data);
  localStorage.setItem("signupData", JSON.stringify(allData));

  console.log("Данные сохранены локально:", allData);
}

function sendTelegramNotification(email, name, company, role) {
  if (typeof sendTelegramMessage === "function") {
    sendTelegramMessage(email, name, company, role);
  }
}
