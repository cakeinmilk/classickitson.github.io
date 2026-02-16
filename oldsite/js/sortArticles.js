// Call this function when the page loads
window.onload = function() {
    document.getElementById('selectAll').checked = true;
    toggleSelectAll(document.getElementById('selectAll'));
    currentSortedColumn = 0; // Assuming 'Date' is the first column
	sortOrder = -1; // Initially set to descending
    let icon = document.getElementById('dateIcon');
    updateArrowDirection(0); // Update arrow direction on page load
}

let sortOrder = 1; // 1 for ascending, -1 for descending
let currentSortedColumn = null;

function sortTable(columnIndex) {
    if (currentSortedColumn === columnIndex) {
        sortOrder = -sortOrder; // Toggle the sort order if the same column is clicked again
    } else {
        sortOrder = 1; // Reset to ascending for a new column
    }
    currentSortedColumn = columnIndex;

    // Sorting logic...
    let rows = Array.from(document.querySelectorAll('.art-table-row'));
    let sortedRows = rows.sort((a, b) => {
        let aValue = a.children[columnIndex].textContent;
        let bValue = b.children[columnIndex].textContent;
        return aValue.localeCompare(bValue) * sortOrder;
    });
    let table = document.querySelector('.art-table');
    sortedRows.forEach(row => table.appendChild(row));

    // Update the arrow direction
    updateArrowDirection(columnIndex);
}


function updateArrowDirection(columnIndex) {
    let icon = document.getElementById('dateIcon');
    if (columnIndex === 0) { // Date column
        if (sortOrder === -1) {
            icon.classList.add('rotate-date'); // Descending sort, arrow pointing down
        } else {
            icon.classList.remove('rotate-date'); // Ascending sort, arrow pointing up
        }
    }
}

function toggleDropdown() {
    let dropdown = document.getElementById("dropdown");
    let docTypeHeader = document.querySelector('.art-header-row .art-header:nth-child(3)'); // Adjust as needed

    // Calculate position
    let headerRect = docTypeHeader.getBoundingClientRect();
    dropdown.style.left = headerRect.left + 'px';
    dropdown.style.top = headerRect.bottom + 'px'; // Position it right below the header

    dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
}


function toggleSelectAll(selectAllCheckbox) {
    let checkboxes = document.querySelectorAll('.filter');
    checkboxes.forEach(chk => {
        chk.checked = selectAllCheckbox.checked;
        chk.disabled = selectAllCheckbox.checked; // Disable other checkboxes if 'Select All' is checked
    });
    filterRows();
}

function filterRows() {
    let checkboxes = document.querySelectorAll('.filter:checked');
    let filterValues = Array.from(checkboxes).map(chk => chk.nextSibling.textContent.trim());
    let rows = document.querySelectorAll('.art-table-row');
    
    if (document.getElementById('selectAll').checked) {
        rows.forEach(row => row.style.display = ''); // Show all rows if 'Select All' is checked
    } else {
        rows.forEach(row => {
            let cellValue = row.children[2].textContent; // Adjust the index for the Document Type column
            row.style.display = filterValues.includes(cellValue) ? '' : 'none';
        });
    }
}