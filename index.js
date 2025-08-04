const resourcesContainer = document.querySelector("#resourcesContainer");
const resourceTemplate = document.querySelector("template");
const domainFilters = document.querySelectorAll("#domain-filters .btnFilter");
const typeFilters = document.querySelectorAll("#type-filters .btnFilter");

let selectedDomain = null;
let selectedType = null;

function renderResources() {
  clearContainer(resourcesContainer);

  let resourcesToDisplay = dataResources.filter((resourceData) => {
    const domainMatch = selectedDomain ? resourceData.tags.includes(selectedDomain) : true;
    const typeMatch = selectedType ? resourceData.tags.includes(selectedType) : true;
    return domainMatch && typeMatch;
  });

  resourcesToDisplay.forEach((resourceData) => {
    const resourceCard = copyTemplateCard(resourceData);
    resourcesContainer.appendChild(resourceCard);
  });
}

function clearContainer(container) {
  container.innerHTML = "";
}

function copyTemplateCard(resourceData) {
  const resourceTemplateContent = document.importNode(resourceTemplate.content, true);
  const card = resourceTemplateContent.querySelector("#resource");

  const title = card.querySelector("#title");
  title.innerText = resourceData.title;
  title.href = resourceData.link;

  const description = card.querySelector("#description");
  description.innerText = resourceData.description;

  const tagsContainer = card.querySelector("#tagsContainer");
  resourceData.tags.forEach((resourceDataTag) => {
      const individualTag = document.createElement("span");
      individualTag.style.backgroundColor = "#ceead6";
      individualTag.style.color = "#000";
      individualTag.style.borderRadius = "0.5rem";
      individualTag.style.padding = "0.25rem 0.25rem";
      individualTag.style.fontSize = "0.5rem";
      individualTag.style.fontWeight = "500";
      individualTag.style.display = "inline-block";
      individualTag.textContent = `#${resourceDataTag}`;

      tagsContainer.appendChild(individualTag);
  });

  return card;
}

// In a more complex app, we'd use a state management object
domainFilters.forEach(btn => {
    btn.addEventListener("click", function() {
        const tag = this.id;
        if (selectedDomain === tag) {
            selectedDomain = null;
            this.classList.remove('selected');
        } else {
            domainFilters.forEach(b => b.classList.remove('selected'));
            selectedDomain = tag;
            this.classList.add('selected');
        }
        renderResources();
    });
});

typeFilters.forEach(btn => {
    btn.addEventListener("click", function() {
        const tag = this.id;
        if (selectedType === tag) {
            selectedType = null;
            this.classList.remove('selected');
        } else {
            typeFilters.forEach(b => b.classList.remove('selected'));
            selectedType = tag;
            this.classList.add('selected');
        }
        renderResources();
    });
});


renderResources();
