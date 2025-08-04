const resourcesContainer = document.querySelector("#resourcesContainer");
const resourceTemplate = document.querySelector("template");
const domainFilters = document.querySelectorAll("#domain-filters .btnFilter");
const typeFilters = document.querySelectorAll("#type-filters .btnFilter");

let selectedDomain = null;
let selectedType = null;

async function renderResources() {
  clearContainer(resourcesContainer);

  let resourcesToDisplay = dataResources.filter((resourceData) => {
    const domainMatch = selectedDomain
      ? resourceData.tags.includes(selectedDomain)
      : true;
    const typeMatch = selectedType
      ? resourceData.tags.includes(selectedType)
      : true;
    return domainMatch && typeMatch;
  });

  const cardPromises = resourcesToDisplay.map((resourceData) =>
    copyTemplateCard(resourceData)
  );

  const cards = await Promise.all(cardPromises);
  cards.forEach((card) => {
    resourcesContainer.appendChild(card);
  });
}

function clearContainer(container) {
  container.innerHTML = "";
}

async function copyTemplateCard(resourceData) {
  const resourceTemplateContent = document.importNode(
    resourceTemplate.content,
    true
  );
  const card = resourceTemplateContent.querySelector("#resource");

  const title = card.querySelector("#title");
  title.innerText = resourceData.title;
  title.href = resourceData.link;

  const previewImage = card.querySelector("#previewImage");
  const hostname = new URL(resourceData.link).hostname;
  const fallbackImage = `https://www.google.com/s2/favicons?domain=${hostname}&sz=128`;

  try {
    const corsProxy = "https://cors-anywhere.herokuapp.com/";
    const preview = await linkPreview.getLinkPreview(
      `${corsProxy}${resourceData.link}`
    );
    if (preview.images && preview.images.length > 0) {
      previewImage.src = preview.images[0];
    } else {
      previewImage.src = fallbackImage;
    }
  } catch (error) {
    console.error("Failed to get link preview", error);
    previewImage.src = fallbackImage;
  }

  previewImage.alt = resourceData.title;

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
