window.addEventListener('load', function() {
  const expandButtons = document.querySelectorAll('.expand-button');
  const expandAllButtons = document.querySelectorAll('.expand-all-button');

  expandButtons.forEach(button => {
    button.addEventListener('click', () => {
      const row = button.parentElement.parentElement.nextElementSibling;
      row.style.display = row.style.display === 'none' ? '' : 'none';
      button.setAttribute('aria-expanded', row.style.display !== 'none');
      button.querySelector('.expand-icon').classList.toggle('rotate', row.style.display !== 'none');
      
      // Find the corresponding 'Expand All' button
      const parentTable = button.closest('.divTable');
      const expandAllButton = parentTable.querySelector('.expand-all-button');
      
      // Check if all rows are expanded
      let allRowsExpanded = true;
      const tableExpandButtons = parentTable.querySelectorAll('.expand-button');
      tableExpandButtons.forEach(b => {
        const row = b.parentElement.parentElement.nextElementSibling;
        if (row.style.display === 'none') {
          allRowsExpanded = false;
        }
      });

      // Update the 'Expand All' button's icon rotation and text
      expandAllButton.querySelector('.expand-icon').classList.toggle('rotate', allRowsExpanded);
      expandAllButton.querySelector('.button-text').textContent = allRowsExpanded ? 'Collapse All' : 'Expand All';
    });
  });

  // Add event listener for 'Expand All' buttons
  expandAllButtons.forEach(button => {
    button.addEventListener('click', () => {
      // Get parent table of clicked 'Expand All' button
      const parentTable = button.closest('.divTable');
      
      // Get all expand-buttons within this table
      const tableExpandButtons = parentTable.querySelectorAll('.expand-button');

      // Determine whether we're expanding or collapsing all
      const isExpandAll = button.querySelector('.button-text').textContent === 'Expand All';

      // Trigger a click on each expand-button within the same table
      let allRowsExpanded = isExpandAll;
      tableExpandButtons.forEach(b => {
        const row = b.parentElement.parentElement.nextElementSibling;
        if ((isExpandAll && row.style.display === 'none') || (!isExpandAll && row.style.display !== 'none')) {
          b.click();
        }
        if (row.style.display === 'none') {
          allRowsExpanded = false;
        }
      });

      // Update the 'Expand All' button's icon rotation and text
      button.querySelector('.expand-icon').classList.toggle('rotate', allRowsExpanded);
      button.querySelector('.button-text').textContent = allRowsExpanded ? 'Collapse All' : 'Expand All';
    });
  });
});

