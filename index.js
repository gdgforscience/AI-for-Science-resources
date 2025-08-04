const resourcesContainer = document.querySelector("#resourcesContainer");
      const resourceTemplate = document.querySelector("template");
      const filterButtons = document.querySelectorAll(".btnFilter");
      const allButton = document.getElementById("all");

      // Use a Set to store selected tags for efficient adding and removing
      let selectedTags = new Set();

      function renderResources() {
        clearContainer(resourcesContainer);

        let resourcesToDisplay = dataResources;

        // If no tags are selected, show all resources.
        // Otherwise, filter based on selected tags.
        if (selectedTags.size > 0) {
          resourcesToDisplay = dataResources.filter((resourceData) =>
            // Check if the resource has at least one tag that is in the selectedTags set
            resourceData.tags.some((tag) => selectedTags.has(tag)),
          );
        }

        // Iterate through the resources to display and append them to the container
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

        // Set Title
        const title = card.querySelector("#title");
        title.innerText = resourceData.title;
        title.href = resourceData.link;

        // Set Description
        const description = card.querySelector("#description");
        description.innerText = resourceData.description;

        // Set Tags
        const tagsContainer = card.querySelector("#tagsContainer");
        resourceData.tags.forEach((resourceDataTag) => {
            const individualTag = document.createElement("span");
            individualTag.style.backgroundColor = "#ceead6"; /* Muted teal */
            individualTag.style.color = "#000"; /* Black font */
            individualTag.style.borderRadius = "0.5rem";
            individualTag.style.padding = "0.25rem 0.25rem";
            individualTag.style.fontSize = "0.5rem";
            individualTag.style.fontWeight = "500";
            individualTag.style.display = "inline-block";
            individualTag.textContent = `#${resourceDataTag}`; // Use textContent for security

            tagsContainer.appendChild(individualTag);
        });

        return card;
      }

      function handleFilterButtonClick() {
        const tag = this.id;

        if (tag === 'all') {
          // If 'All' is clicked, clear all selected tags and remove 'selected' class
          selectedTags.clear();
          filterButtons.forEach(btn => btn.classList.remove('selected'));
          allButton.classList.add('selected'); // Optionally keep 'All' selected visually
        } else {
          // If another tag is clicked
          allButton.classList.remove('selected'); // Deselect 'All'

          if (selectedTags.has(tag)) {
            // If the tag is already selected, deselect it
            selectedTags.delete(tag);
            this.classList.remove('selected');
          } else {
            // If the tag is not selected, select it
            selectedTags.add(tag);
            this.classList.add('selected');
          }

          // If no tags are selected after clicking a tag other than 'all', select 'all'
          if (selectedTags.size === 0) {
             allButton.classList.add('selected');
          }
        }

        renderResources();
      }

      // Add event listeners to filter buttons
      filterButtons.forEach(function (btn) {
        btn.addEventListener("click", handleFilterButtonClick);
      });

      // Initial render with all resources
      allButton.classList.add('selected'); // Mark 'All' as selected initially
      renderResources();
