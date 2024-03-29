async function run(sql) {
    const tokenInfo = await grist.docApi.getAccessToken({readOnly: true});
    console.log(tokenInfo);
    const url = tokenInfo.baseUrl + `/sql?auth=${tokenInfo.token}`;
    const result = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        sql
      }),
    });
    const result2 = await result.json();
    console.log(result2);
    makeTable(result2.records);
  }
  
  function makeTable(data) {
    const tableHeadersRow = document.getElementById('table-headers');
    const tableBody = document.getElementById('table-body');
    tableHeadersRow.innerHTML = "";
    tableBody.innerHTML = "";
  
    // Extract the headers from the first object in the data array
    const firstItem = data[0];
    const headers = Object.keys(firstItem.fields);
  
    // Create table headers dynamically
    headers.forEach(headerText => {
      const th = document.createElement('th');
      th.textContent = headerText;
      tableHeadersRow.appendChild(th);
    });
  
    // Populate the table body
    data.forEach(item => {
      const fields = item.fields;
      const row = document.createElement('tr');
      
      headers.forEach(header => {
        const cell = document.createElement('td');
        cell.textContent = fields[header];
        row.appendChild(cell);
      });
      
      tableBody.appendChild(row);
    });
  }
  
  
  
  function init() {
    document.getElementById('run').addEventListener('click', async function() {
      const sql = document.getElementById('query').value;
      await run(sql);
    });
  }
  
  grist.ready({
    requiredAccess: 'full'
  });
  
  function ready(fn) {
    if (document.readyState !== 'loading') {
      fn();
    } else {
      document.addEventListener('DOMContentLoaded', fn);
    }
  }
  
  ready(init);
  