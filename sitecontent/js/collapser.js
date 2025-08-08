// Auto-initialize all rows when page loads
document.addEventListener('DOMContentLoaded', function() {
  initializeRowCollapse();
  initializeSidebar();
});

function initializeRowCollapse() {
  const rows = document.querySelectorAll('.row');
  
  rows.forEach(function(row, index) {
    // skip already done
    const blogDivs = row.querySelectorAll('.blog-content');
    if (row.classList.contains('collapsible-initialized')) return;
    if (row.classList.contains('non-collapsable')) return;
    row.classList.add('collapsible-initialized');

    // Create collapse button
    const button = document.createElement('button');
    button.className = 'row-collapse-btn';
    button.innerHTML = '−';
    button.setAttribute('aria-label', 'Toggle row content');
    
    // Prepare each blog-content div for collapsing
    blogDivs.forEach(function(div) {
      // Find the title
      const title = div.querySelector('h1, h2, h3, h4, h5, h6, .post-title');
      
      // Create wrapper for collapsible content
      const wrapper = document.createElement('div');
      wrapper.className = 'collapsible-content';
      
      // Move all content except title into wrapper
      const children = Array.from(div.children);
      children.forEach(child => {
        if (child !== title) {
          wrapper.appendChild(child);
        }
      });
      
      // Add wrapper back to div
      div.appendChild(wrapper);
    });
    
    // Add button to row (position it at the top right)
    row.style.position = 'relative';
    row.appendChild(button);
    
    // Add click handler
    button.addEventListener('click', function() {
      toggleRowContent(row, button, blogDivs);
    });
  });
}

function toggleRowContent(row, button, blogDivs) {
  const isCollapsed = row.classList.contains('collapsed');
  
  if (isCollapsed) {
    // Expand all blog-content divs in this row
    row.classList.remove('collapsed');
    blogDivs.forEach(function(div) {
      const wrapper = div.querySelector('.collapsible-content');
      if (wrapper) {
        wrapper.style.maxHeight = wrapper.scrollHeight + 'px';
      }
    });
    button.innerHTML = '−';
  } else {
    // Collapse all blog-content divs in this row
    row.classList.add('collapsed');
    blogDivs.forEach(function(div) {
      const wrapper = div.querySelector('.collapsible-content');
      if (wrapper) {
        wrapper.style.maxHeight = '0px';
      }
    });
    button.innerHTML = '+';
  }
}

// SIDEBAR

function initializeSidebar() {
  document.querySelectorAll('.sidebar').forEach(sidebar => {
    // Skip if already initialized
    if (sidebar.classList.contains('sidebar-initialized')) return;
    
    // Mark as initialized
    sidebar.classList.add('sidebar-initialized');
    
    // Create toggle button
    const button = document.createElement('button');
    button.className = 'sidebar-toggle-btn';
    button.innerHTML = sidebar.dataset.icon; // icon
    button.setAttribute('aria-label', 'Toggle sidebar');
    
    // Create wrapper for collapsible content
    const wrapper = document.createElement('div');
    wrapper.className = 'sidebar-content';
    
    // Move all existing content into wrapper
    const children = Array.from(sidebar.children);
    children.forEach(child => {
      wrapper.appendChild(child);
    });
    
    // Add button and wrapper back to sidebar
    sidebar.appendChild(button);
    sidebar.appendChild(wrapper);
    
    // Start collapsed
    sidebar.classList.add('sidebar-collapsed');
    
    // Add click handler
    button.addEventListener('click', function() {
      toggleSidebar(sidebar, button, wrapper);
    });
  });
}

function toggleSidebar(sidebar, button, wrapper) {
  const isCollapsed = sidebar.classList.contains('sidebar-collapsed');
  
  if (isCollapsed) {
    // Expand
    sidebar.classList.remove('sidebar-collapsed');
    wrapper.style.opacity = '';
    wrapper.style.visibility = '';
    button.innerHTML = '×';
  } else {
    // Collapse
    sidebar.classList.add('sidebar-collapsed');
    // Remove inline styles to let CSS handle it
    wrapper.style.opacity = '';
    wrapper.style.visibility = '';
    button.innerHTML = sidebar.dataset.icon;
  }
}