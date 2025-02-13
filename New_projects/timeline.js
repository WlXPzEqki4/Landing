// timeline.js

// Example data: each event could represent a milestone or deliverable
export const timelineData = [
    {
      date: "2024-12-15",
      title: "Project Inception",
      description: "Brainstorming, initial scope, and planning.",
      // more fields if you like...
    },
    {
      date: "2025-01-10",
      title: "Prototype Release",
      description: "Early alpha release for internal testing.",
    },
    // ...
  ];
  
  // This function will initialise and render the timeline into #timelineContainer
  export function initTimeline() {
    const container = document.getElementById('timelineContainer');
    if (!container) {
      console.error('No container for timeline found!');
      return;
    }
  
    // Clear out any existing elements
    container.innerHTML = '';
  
    // You might create your timeline with a series of <div> or <svg> elements
    // This is a simplistic horizontal timeline approach
    // You can style it via CSS or manipulate it further for animations
    const timelineWrapper = document.createElement('div');
    timelineWrapper.classList.add('timeline-wrapper');
  
    // For each event in timelineData
    timelineData.forEach((event, index) => {
      const eventElement = document.createElement('div');
      eventElement.classList.add('timeline-event');
  
      eventElement.innerHTML = `
        <div class="date-label">${event.date}</div>
        <div class="title">${event.title}</div>
        <div class="description">${event.description}</div>
      `;
  
      // Optional: add event handlers for hover or click
      eventElement.addEventListener('mouseenter', () => {
        // Show a tooltip or highlight
      });
      eventElement.addEventListener('mouseleave', () => {
        // Hide tooltip or unhighlight
      });
  
      timelineWrapper.appendChild(eventElement);
    });
  
    container.appendChild(timelineWrapper);
  }
  