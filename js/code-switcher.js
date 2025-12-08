function switchCode(lang) {
  document.querySelectorAll(".code-block").forEach((block) => {
    block.classList.remove("active");
  });

  document.querySelectorAll(".code-tab").forEach((tab) => {
    tab.classList.remove("active");
  });

  const codeBlock = document.getElementById(lang);
  if (codeBlock) {
    codeBlock.classList.add("active");
  }

  event.target.classList.add("active");
}

function copyCode() {
  const activeCode = document.querySelector(".code-block.active");
  const text = activeCode.innerText;

  navigator.clipboard.writeText(text).then(() => {
    const btn = event.target;
    const originalText = btn.innerText;
    btn.innerText = "✓ Copied!";

    setTimeout(() => {
      btn.innerText = originalText;
    }, 2000);
  });
}
