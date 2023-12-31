const apiUrl = 'https://s3.amazonaws.com/open-to-cors/assignment.json';
const itemsPerPage = 10;

async function fetchData(page = 1) {
    try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        const products = data.products;

        const productArray = Object.keys(products).map(key => ({
            id: key,
            ...products[key]
        }));

        productArray.sort((a, b) => b.popularity - a.popularity);

        const startIndex = (page - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const displayedProducts = productArray.slice(startIndex, endIndex);

        const tableBody = document.getElementById('tableBody');
        tableBody.innerHTML = '';

        displayedProducts.forEach(product => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${product.title}</td>
                <td>${product.price}</td>
                <td>${product.popularity}</td>
            `;
            tableBody.appendChild(row);
        });

        const totalPages = Math.ceil(productArray.length / itemsPerPage);
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
