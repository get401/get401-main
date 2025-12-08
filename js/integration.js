function switchIntegration(example) {
  document.querySelectorAll(".integration-block").forEach((block) => {
    block.style.display = "none";
  });

  document.querySelectorAll(".integration-tab").forEach((tab) => {
    tab.classList.remove("active");
  });

  const integrationBlock = document.getElementById(example);
  if (integrationBlock) {
    integrationBlock.style.display = "grid";
  }

  event.target.classList.add("active");
}
