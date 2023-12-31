const itemsPerPage = 10;

async function fetchData(page = 1) {
    try {
        let data = JSON.parse(sessionStorage.getItem('data'));
        const selectedFields = JSON.parse(sessionStorage.getItem('selectedFields'));

        data.sort((a, b) => b.popularity - a.popularity);

        data = data.map(obj => {
            const filteredObj = {};
        
            selectedFields.forEach(field => {
                if (obj.hasOwnProperty(field)) {
                    filteredObj[field] = obj[field];
                }
            });
        
            return filteredObj;
        });
        
        const tableHeadersRow = document.getElementById('tableHeaders');
        const tableBody = document.getElementById('tableBody');
        tableHeadersRow.innerHTML = '';

        selectedFields.forEach(field => {
            const th = document.createElement('th');
            th.textContent = field;
            tableHeadersRow.appendChild(th);
        });

        const startIndex = (page - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const displayedProducts = data.slice(startIndex, endIndex);

        tableBody.innerHTML = '';

        displayedProducts.forEach(product => {
            const row = document.createElement('tr');

            selectedFields.forEach(field => {
                const cell = document.createElement('td');
                cell.textContent = product[field] || '';
                row.appendChild(cell);
            });

            tableBody.appendChild(row);
        });

        // Pagination
        const totalPages = Math.ceil(data.length / itemsPerPage);
        const pagination = document.getElementById('pagination');
        pagination.innerHTML = '';

        const maxVisiblePages = 5;

        function addPageLink(page) {
            const link = document.createElement('a');
            link.href = '#';

            if (page === '...') {
                link.textContent = '...';
                link.classList.add('ellipsis');
            } else {
                link.textContent = page;
                link.addEventListener('click', () => fetchData(page));
            }

            pagination.appendChild(link);
        }

        if (totalPages <= maxVisiblePages * 2 + 1) {
            for (let i = 1; i <= totalPages; i++) {
                addPageLink(i);
            }
        } else {
            addPageLink(1);
            addPageLink('...')

            let start = Math.max(1, page - Math.floor(maxVisiblePages / 2));
            let end = Math.min(totalPages, start + maxVisiblePages-1);
            if(page<=2){
                start = 2;
                end = start + maxVisiblePages -1;
            }
            else if(page>=totalPages-1){
                start=totalPages-maxVisiblePages;
                end=totalPages-1;
            }
            for (let i = start; i <= end; i++) {
                addPageLink(i);
            }

            addPageLink('...')
            addPageLink(totalPages)
        }

        document.querySelector(`#pagination a:nth-child(${page + 1})`).classList.add('active');

    } catch (error) {
        console.error('Error fetching data:', error.message);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    fetchData();
});
